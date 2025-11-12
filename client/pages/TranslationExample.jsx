/**
 * Translation Usage Example Component
 * Demonstrates different ways to use the translation system in components
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { translateText, translateBatch } from "@/lib/translationService";
import { UIText } from "@/lib/uiText";

export default function TranslationExample() {
  const { currentLanguage } = useLanguage();

  // Method 1: Using useTranslation hook for automatic re-renders on language change
  const { translatedText: dashboardTitle } = useTranslation(UIText.dashboard.title);
  const { translatedText: welcomeMessage } = useTranslation(UIText.dashboard.welcome);

  // Method 2: Using async translation for dynamic text
  const [dynamicTranslations, setDynamicTranslations] = useState({});
  const [batchTranslations, setBatchTranslations] = useState([]);

  useEffect(() => {
    // Example: Translate dynamic text when language changes
    const translateDynamicContent = async () => {
      // Single translation
      const translated = await translateText("Custom dynamic text", currentLanguage);
      setDynamicTranslations((prev) => ({
        ...prev,
        dynamicText: translated,
      }));

      // Batch translation
      const texts = ["Save", "Cancel", "Delete"];
      const translated_batch = await translateBatch(texts, currentLanguage);
      setBatchTranslations(translated_batch);
    };

    translateDynamicContent();
  }, [currentLanguage]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Translation System Examples</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Current Language: <strong>{currentLanguage.toUpperCase()}</strong>
        </p>
      </div>

      {/* Example 1: Using useTranslation Hook */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Method 1: useTranslation Hook</h3>
        <p className="text-sm mb-2">Best for UI strings that auto-update on language change:</p>
        <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-3">
{`const { translatedText: title } = useTranslation(UIText.dashboard.title);
return <h1>{title}</h1>;`}
        </pre>
        <div className="bg-accent p-3 rounded">
          <p className="text-sm">
            <strong>Result:</strong> {dashboardTitle}
          </p>
        </div>
      </div>

      {/* Example 2: Using translateText for dynamic content */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Method 2: Async translateText</h3>
        <p className="text-sm mb-2">Best for dynamic text that changes at runtime:</p>
        <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-3">
{`const [translated, setTranslated] = useState("");
useEffect(() => {
  translateText("Dynamic text", currentLanguage)
    .then(result => setTranslated(result));
}, [currentLanguage]);`}
        </pre>
        <div className="bg-accent p-3 rounded">
          <p className="text-sm">
            <strong>Result:</strong> {dynamicTranslations.dynamicText || "Loading..."}
          </p>
        </div>
      </div>

      {/* Example 3: Batch translation */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Method 3: Batch Translation</h3>
        <p className="text-sm mb-2">Best for translating multiple texts efficiently:</p>
        <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-3">
{`const texts = ["Save", "Cancel", "Delete"];
translateBatch(texts, currentLanguage).then(results => {
  setBatchTranslations(results);
});`}
        </pre>
        <div className="bg-accent p-3 rounded space-y-1">
          {batchTranslations.length > 0 ? (
            batchTranslations.map((text, i) => (
              <p key={i} className="text-sm">
                <strong>Button {i + 1}:</strong> {text}
              </p>
            ))
          ) : (
            <p className="text-sm">Loading...</p>
          )}
        </div>
      </div>

      {/* Example 4: Direct UIText usage */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Method 4: Direct UIText Constants</h3>
        <p className="text-sm mb-2">Access pre-defined UI text (before translation):</p>
        <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-3">
{`import { UIText } from "@/lib/uiText";
<button>{UIText.common.save}</button>`}
        </pre>
        <div className="bg-accent p-3 rounded">
          <p className="text-sm">
            <strong>UIText.dashboard.welcome:</strong> {UIText.dashboard.welcome}
          </p>
        </div>
      </div>

      {/* Example 5: Language context */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Method 5: Using Language Context</h3>
        <p className="text-sm mb-2">Access language state and control language changes:</p>
        <pre className="bg-background p-2 rounded text-xs overflow-x-auto mb-3">
{`const { currentLanguage, changeLanguage, translate } = useLanguage();
<select onChange={(e) => changeLanguage(e.target.value)}>
  <option value="en">English</option>
  <option value="ha">Hausa</option>
</select>`}
        </pre>
      </div>

      {/* Quick Reference */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Quick Reference</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>
            <strong>useTranslation(text):</strong> Hook that auto-updates on language change (recommended for static UI)
          </li>
          <li>
            <strong>translateText(text, lang):</strong> Async function for manual control (use for dynamic content)
          </li>
          <li>
            <strong>translateBatch(texts[], lang):</strong> Translate multiple texts efficiently
          </li>
          <li>
            <strong>useLanguage():</strong> Access language state and change language
          </li>
          <li>
            <strong>UIText:</strong> Pre-defined constants for all UI strings
          </li>
        </ul>
      </div>
    </div>
  );
}
