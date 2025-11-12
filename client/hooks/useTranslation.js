/**
 * useTranslation Hook
 * Makes translation easy to use in any component with automatic caching and fallback
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translateBatch } from "@/lib/translationService";

const serializeValue = (value) => {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return `str:${value}`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `prim:${String(value)}`;
  }
  try {
    return `json:${JSON.stringify(value)}`;
  } catch {
    return `ref:${Object.prototype.toString.call(value)}`;
  }
};

/**
 * Hook to translate text with automatic caching and re-renders on language change
 * @param {string|Object} textOrObject - Text to translate or object with text values
 * @returns {string|Object} - Translated text or object
 */
export const useTranslation = (textOrObject) => {
  const { currentLanguage, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(textOrObject);
  const [isTranslating, setIsTranslating] = useState(false);
  const latestInputRef = useRef(textOrObject);

  useEffect(() => {
    latestInputRef.current = textOrObject;
  }, [textOrObject]);

  const translationKey = useMemo(() => serializeValue(textOrObject), [textOrObject]);

  useEffect(() => {
    const value = latestInputRef.current;
    if (value === undefined || value === null) {
      setTranslatedText(value);
      return;
    }

    let cancelled = false;
    const translateValue = async (input) => {
      if (typeof input === "string") {
        return translate(input);
      }

      if (Array.isArray(input)) {
        const nestedResults = await Promise.all(input.map((item) => translateValue(item)));
        return nestedResults;
      }

      if (input && typeof input === "object") {
        const entries = await Promise.all(
          Object.entries(input).map(async ([key, val]) => [key, await translateValue(val)]),
        );
        return entries.reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, Array.isArray(input) ? [] : {});
      }

      return input;
    };

    const translateComposite = async (input) => {
      if (Array.isArray(input)) {
        const stringIndices = [];
        const stringValues = [];
        const otherPromises = [];

        input.forEach((item, idx) => {
          if (typeof item === "string") {
            stringIndices.push(idx);
            stringValues.push(item);
          } else {
            otherPromises[idx] = translateValue(item);
          }
        });

        const results = await Promise.all(
          input.map((item, idx) => {
            if (typeof item === "string") {
              return Promise.resolve(item);
            }
            return otherPromises[idx];
          }),
        );

        if (stringValues.length > 0) {
          const translatedStrings = await translateBatch(stringValues, currentLanguage);
          stringIndices.forEach((index, i) => {
            results[index] = translatedStrings[i];
          });
        }

        return results;
      }

      if (input && typeof input === "object" && !Array.isArray(input)) {
        const stringKeys = [];
        const stringValues = [];
        const otherEntries = [];

        Object.entries(input).forEach(([key, val]) => {
          if (typeof val === "string") {
            stringKeys.push(key);
            stringValues.push(val);
          } else {
            otherEntries.push([key, val]);
          }
        });

        const result = {};

        if (stringValues.length > 0) {
          const translatedStrings = await translateBatch(stringValues, currentLanguage);
          stringKeys.forEach((key, idx) => {
            result[key] = translatedStrings[idx];
          });
        }

        await Promise.all(
          otherEntries.map(async ([key, val]) => {
            result[key] = await translateValue(val);
          }),
        );

        return result;
      }

      return translateValue(input);
    };

    const runTranslation = async () => {
      setIsTranslating(true);
      try {
        const result = await translateComposite(value);
        if (cancelled) {
          return;
        }

        setTranslatedText((prev) => {
          const prevKey = serializeValue(prev);
          const nextKey = serializeValue(result);
          if (prevKey === nextKey) {
            return prev;
          }
          return result;
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Translation hook error:", error);
          setTranslatedText(value);
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [translationKey, currentLanguage, translate]);

  return { translatedText, isTranslating };
};

export default useTranslation;
