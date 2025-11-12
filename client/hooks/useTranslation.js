import { useState, useEffect } from "react";
import {
  getPreferredLanguage,
  setPreferredLanguage,
  translateText as translate,
  getSupportedLanguages,
} from "@/lib/translationService";

export const useTranslation = () => {
  const [language, setLanguage] = useState(getPreferredLanguage());
  const [supportedLanguages] = useState(getSupportedLanguages());

  // Listen for language changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = getPreferredLanguage();
      setLanguage(newLang);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const t = (text) => {
    return translate(text, language);
  };

  const changeLanguage = (newLang) => {
    if (supportedLanguages[newLang]) {
      setPreferredLanguage(newLang);
      setLanguage(newLang);
      // Dispatch custom event for real-time updates across components
      window.dispatchEvent(new CustomEvent("language-changed", { detail: { language: newLang } }));
    }
  };

  return {
    t,
    language,
    changeLanguage,
    supportedLanguages,
  };
};
