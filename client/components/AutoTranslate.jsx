import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translateText } from "@/lib/translationService";

const originalTextMap = new WeakMap();
const nodeTranslationMap = new WeakMap();
const originalAttributeMap = new WeakMap();
const attributeTranslationMap = new WeakMap();

const BLOCKED_PARENT_SELECTORS = "script, style, code, pre";
const ATTRIBUTES_TO_TRANSLATE = ["placeholder", "aria-label", "title"];
const FORWARD_ATTRIBUTE_SCHEMA = {
  img: ["src", "srcset", "fetchpriority"],
};

const shouldTranslateText = (text, textNode) => {
  if (!text) {
    return false;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  if (!/[A-Za-z]/.test(trimmed)) {
    return false;
  }

  const parent = textNode.parentElement;
  if (!parent) {
    return false;
  }

  if (parent.closest("[data-no-translate]")) {
    return false;
  }

  if (parent.closest(BLOCKED_PARENT_SELECTORS)) {
    return false;
  }

  return true;
};

const shouldTranslateAttributeValue = (value, element) => {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (!/[A-Za-z]/.test(trimmed)) {
    return false;
  }

  if (element.closest("[data-no-translate]")) {
    return false;
  }

  if (element.closest(BLOCKED_PARENT_SELECTORS)) {
    return false;
  }

  return true;
};

const collectTextNodes = (root, out) => {
  if (!root) {
    return;
  }

  if (root.nodeType === Node.TEXT_NODE) {
    if (shouldTranslateText(root.textContent, root)) {
      out.push(root);
    }
    return;
  }

  if (!(root instanceof Element)) {
    return;
  }

  if (root.matches("[data-no-translate]")) {
    return;
  }

  if (root.matches(BLOCKED_PARENT_SELECTORS)) {
    return;
  }

  root.childNodes.forEach((child) => collectTextNodes(child, out));
};

const shouldForwardAttribute = (element, attr) => {
  const tag = element.tagName?.toLowerCase();
  if (!tag) {
    return false;
  }
  const allowed = FORWARD_ATTRIBUTE_SCHEMA[tag];
  if (!Array.isArray(allowed)) {
    return false;
  }
  return allowed.includes(attr);
};

const collectAttributeTargets = (root, out) => {
  if (!root || !(root instanceof Element)) {
    return;
  }

  if (root.matches("[data-no-translate]")) {
    return;
  }

  if (root.matches(BLOCKED_PARENT_SELECTORS)) {
    return;
  }

  [...ATTRIBUTES_TO_TRANSLATE, ...(FORWARD_ATTRIBUTE_SCHEMA[root.tagName?.toLowerCase()] ?? [])].forEach((attr) => {
    if (!root.hasAttribute(attr)) {
      return;
    }
    const attrName = attr.toLowerCase();
    if (ATTRIBUTES_TO_TRANSLATE.includes(attrName)) {
      const value = root.getAttribute(attrName);
      if (shouldTranslateAttributeValue(value, root)) {
        out.push({ element: root, attr: attrName, isForward: false });
      }
      return;
    }

    if (shouldForwardAttribute(root, attrName)) {
      out.push({ element: root, attr: attrName, isForward: true });
    }
  });

  root.childNodes.forEach((child) => collectAttributeTargets(child, out));
};

const translateNodes = async (nodes, language, cancelledRef) => {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return;
  }

  await Promise.all(
    nodes.map(async (node) => {
      const original = originalTextMap.get(node) ?? node.textContent;
      originalTextMap.set(node, original);

      if (language === "en") {
        if (!cancelledRef.current && node.textContent !== original) {
          node.textContent = original;
        }
        nodeTranslationMap.delete(node);
        return;
      }

      const existing = nodeTranslationMap.get(node);
      if (existing && existing.language === language) {
        if (!cancelledRef.current && node.textContent !== existing.value) {
          node.textContent = existing.value;
        }
        return;
      }

      try {
        const translated = await translateText(original, language);
        if (!cancelledRef.current && translated && node.textContent !== translated) {
          node.textContent = translated;
          nodeTranslationMap.set(node, { language, value: translated });
        }
      } catch (error) {
        console.warn("AutoTranslate failed:", error);
      }
    }),
  );
};

const translateAttributes = async (targets, language, cancelledRef) => {
  if (!Array.isArray(targets) || targets.length === 0) {
    return;
  }

  await Promise.all(
    targets.map(async ({ element, attr, isForward }) => {
      const attrKey = attr.toLowerCase();
      if (!ATTRIBUTES_TO_TRANSLATE.includes(attrKey)) {
        if (isForward && attrKey === "fetchpriority") {
          element.setAttribute("fetchpriority", element.getAttribute(attr) ?? "");
        }
        return;
      }

      let originalMap = originalAttributeMap.get(element);
      if (!originalMap) {
        originalMap = new Map();
        originalAttributeMap.set(element, originalMap);
      }

      if (!originalMap.has(attrKey)) {
        originalMap.set(attrKey, element.getAttribute(attrKey) ?? "");
      }

      const original = originalMap.get(attrKey) ?? "";

      if (!shouldTranslateAttributeValue(original, element)) {
        return;
      }

      if (language === "en") {
        if (!cancelledRef.current && element.getAttribute(attrKey) !== original) {
          element.setAttribute(attrKey, original);
        }
        const existing = attributeTranslationMap.get(element);
        if (existing) {
          existing.delete(attrKey);
        }
        return;
      }

      const existingTranslations = attributeTranslationMap.get(element);
      const match = existingTranslations?.get(attrKey);
      if (match && match.language === language) {
        if (!cancelledRef.current && element.getAttribute(attrKey) !== match.value) {
          element.setAttribute(attrKey, match.value);
        }
        return;
      }

      try {
        const translated = await translateText(original, language);
        if (!cancelledRef.current && translated && element.getAttribute(attrKey) !== translated) {
          element.setAttribute(attrKey, translated);
          const map = attributeTranslationMap.get(element) ?? new Map();
          map.set(attrKey, { language, value: translated });
          attributeTranslationMap.set(element, map);
        }
      } catch (error) {
        console.warn("AutoTranslate attribute failed:", error);
      }
    }),
  );
};

export const AutoTranslate = ({ as: Component = "div", children, ...props }) => {
  const ref = useRef(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }

    const cancelledRef = { current: false };
    const initialNodes = [];
    const attributeTargets = [];
    collectTextNodes(container, initialNodes);
    collectAttributeTargets(container, attributeTargets);
    translateNodes(initialNodes, currentLanguage, cancelledRef);
    translateAttributes(attributeTargets, currentLanguage, cancelledRef);

    const observer = new MutationObserver((mutations) => {
      const nodesToTranslate = [];
      const attrsToTranslate = [];

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((added) => {
          collectTextNodes(added, nodesToTranslate);
          collectAttributeTargets(added, attrsToTranslate);
        });

        if (mutation.type === "characterData") {
          const target = mutation.target;
          if (shouldTranslateText(target.textContent, target)) {
            nodesToTranslate.push(target);
          }
        }

        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          const attrName = mutation.attributeName?.toLowerCase();
          if (attrName && ATTRIBUTES_TO_TRANSLATE.includes(attrName)) {
            const element = mutation.target;
            const value = element.getAttribute(attrName) ?? "";
            if (shouldTranslateAttributeValue(value, element)) {
              attrsToTranslate.push({ element, attr: attrName });
            }
          }
        }
      });

      if (nodesToTranslate.length > 0) {
        translateNodes(nodesToTranslate, currentLanguage, cancelledRef);
      }

      if (attrsToTranslate.length > 0) {
        translateAttributes(attrsToTranslate, currentLanguage, cancelledRef);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES_TO_TRANSLATE,
    });

    return () => {
      cancelledRef.current = true;
      observer.disconnect();
    };
  }, [currentLanguage]);

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
};

export default AutoTranslate;

