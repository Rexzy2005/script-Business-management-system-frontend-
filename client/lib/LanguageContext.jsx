/**
 * Language Context
 * Manages global language state and provides translation functionality to all components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getPreferredLanguage,
  setPreferredLanguage,
  translateText,
  getSupportedLanguages,
} from "@/lib/translationService";

const LanguageContext = createContext();

/**
 * Language Provider Component
 * Wrap your app with this to enable translations everywhere
 */
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState({});

  // Initialize language from localStorage on mount
  useEffect(() => {
    const preferredLang = getPreferredLanguage();
    setCurrentLanguage(preferredLang);
    setSupportedLanguages(getSupportedLanguages());
  }, []);

  // Handle language change
  const changeLanguage = useCallback(async (languageCode) => {
    if (languageCode === currentLanguage) {
      return; // No need to change
    }

    setIsLoading(true);
    try {
      // Persist the language preference
      setPreferredLanguage(languageCode);
      setCurrentLanguage(languageCode);

      // Dispatch custom event so other components can react to language change
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: languageCode },
        })
      );
    } catch (error) {
      console.error("Failed to change language:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  // Translate function that components can use
  const translate = useCallback(
    async (text) => {
      if (!text || typeof text !== "string") {
        return text;
      }
      return translateText(text, currentLanguage);
    },
    [currentLanguage]
  );

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    isLoading,
    supportedLanguages,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

/**
 * Hook to use language context in any component
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
