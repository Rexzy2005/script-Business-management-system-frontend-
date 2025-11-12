/**
 * Advanced Translation Usage Example
 * Real-world examples of using the translation system in complex scenarios
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { UIText } from "@/lib/uiText";
import {
  translateWithRetry,
  createTranslatedOptions,
  formatCurrencyByLanguage,
  formatDateByLanguage,
  createTranslatedSearchFilter,
  getLanguageSwitcherOptions,
  getLanguageColor,
} from "@/lib/translationHelpers";

/**
 * Example 1: Complex Form with Dynamic Translation
 */
export function TranslationFormExample() {
  const { currentLanguage } = useLanguage();
  const { translatedText: title } = useTranslation(UIText.common.create);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Translate form options
    const formOptions = ["Option 1", "Option 2", "Option 3"];
    createTranslatedOptions(formOptions, currentLanguage).then(setOptions);
  }, [currentLanguage]);

  return (
    <div className="p-4 bg-card rounded-lg">
      <h2>{title} Item</h2>
      <select>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Example 2: Table with Translated Data
 */
export function TranslatedTableExample() {
  const { currentLanguage } = useLanguage();
  const { translatedText: name } = useTranslation(UIText.inventory.itemName);
  const { translatedText: price } = useTranslation(UIText.inventory.price);
  const { translatedText: lastUpdated } = useTranslation(UIText.inventory.lastUpdated);

  const [tableData] = useState([
    { id: 1, name: "Laptop", price: 500000, date: "2025-11-01" },
    { id: 2, name: "Mouse", price: 5000, date: "2025-11-02" },
  ]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">{name}</th>
            <th className="text-right p-2">{price}</th>
            <th className="text-left p-2">{lastUpdated}</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="p-2">{row.name}</td>
              <td className="text-right p-2">{formatCurrencyByLanguage(row.price, currentLanguage)}</td>
              <td className="p-2">{formatDateByLanguage(row.date, currentLanguage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Example 3: Search with Translation Support
 */
export function TranslatedSearchExample() {
  const { currentLanguage } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const demoItems = [
    { id: 1, name: "Inventory Management" },
    { id: 2, name: "Sales Dashboard" },
    { id: 3, name: "Expense Tracking" },
  ];

  useEffect(() => {
    const performSearch = async () => {
      if (!searchText) {
        setResults(demoItems);
        return;
      }

      const filtered = await createTranslatedSearchFilter(
        demoItems,
        searchText,
        currentLanguage,
        ["name"]
      );
      setResults(filtered);
    };

    performSearch();
  }, [searchText, currentLanguage]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <div className="space-y-2">
        {results.map((item) => (
          <div key={item.id} className="p-2 bg-accent rounded">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Multilingual Dashboard Cards
 */
export function MultilingualDashboardCards() {
  const { currentLanguage } = useLanguage();
  const { translatedText: revenue } = useTranslation(UIText.dashboard.totalRevenue);
  const { translatedText: expenses } = useTranslation(UIText.dashboard.totalExpenses);
  const { translatedText: sales } = useTranslation(UIText.dashboard.totalSales);

  const metrics = [
    { label: revenue, value: 2500000 },
    { label: expenses, value: 500000 },
    { label: sales, value: 1200 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-card border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
          <p className="text-2xl font-bold">
            {typeof metric.value === "number" && metric.value > 10000
              ? formatCurrencyByLanguage(metric.value, currentLanguage)
              : metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 5: Language-Specific Formatting
 */
export function LanguageFormattingExample() {
  const { currentLanguage } = useLanguage();

  const exampleData = {
    amount: 125500,
    date: "2025-11-11",
    percentage: 45.67,
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <h3 className="font-semibold mb-4">Language-Specific Formatting</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-lg font-bold">
            {formatCurrencyByLanguage(exampleData.amount, currentLanguage)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="text-lg font-bold">
            {formatDateByLanguage(exampleData.date, currentLanguage)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Percentage</p>
          <p className="text-lg font-bold">
            {exampleData.percentage.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            %
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Language</p>
          <p className="text-lg font-bold capitalize">{currentLanguage}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 6: Language Switcher with Flags
 */
export function AdvancedLanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const options = getLanguageSwitcherOptions();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Language</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.code}
            onClick={() => changeLanguage(option.code)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentLanguage === option.code
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <span className="mr-2">{option.flag}</span>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 7: Retry Translation with Error Handling
 */
export function TranslationWithRetryExample() {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslateWithRetry = async () => {
    setIsLoading(true);
    setError("");

    try {
      const text = "This text will be translated with retry logic";
      const result = await translateWithRetry(text, currentLanguage, 2);
      setTranslatedText(result);
    } catch (err) {
      setError("Translation failed after retries");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <button
        onClick={handleTranslateWithRetry}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Translating..." : "Translate with Retry"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {translatedText && (
        <div className="p-3 bg-accent rounded">
          <p className="text-sm text-muted-foreground">Translated Result:</p>
          <p className="text-lg">{translatedText}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Main Demo Component
 */
export default function AdvancedTranslationExample() {
  const { currentLanguage } = useLanguage();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Advanced Translation Examples</h1>
        <p className="text-muted-foreground">
          Current Language: <strong className="text-foreground">{currentLanguage.toUpperCase()}</strong>
        </p>
      </div>

      {/* Language Switcher */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">1. Advanced Language Switcher</h2>
        <AdvancedLanguageSwitcher />
      </section>

      {/* Formatting */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">2. Language-Specific Formatting</h2>
        <LanguageFormattingExample />
      </section>

      {/* Dashboard */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">3. Multilingual Dashboard</h2>
        <MultilingualDashboardCards />
      </section>

      {/* Search */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">4. Translated Search</h2>
        <TranslatedSearchExample />
      </section>

      {/* Table */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">5. Translated Table</h2>
        <TranslatedTableExample />
      </section>

      {/* Form */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">6. Translated Form</h2>
        <TranslationFormExample />
      </section>

      {/* Retry */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">7. Translation with Retry</h2>
        <TranslationWithRetryExample />
      </section>
    </div>
  );
}
