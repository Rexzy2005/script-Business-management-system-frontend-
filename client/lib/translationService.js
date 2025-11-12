/**
 * Translation Service
 * Provides static Hausa translations for UI strings without external API calls.
 */

const LANGUAGE_PREF_KEY = "preferred_language";

import { STATIC_TRANSLATIONS } from "@/lib/translations";

const SUPPORTED_LANGUAGES = {
  en: "English",
  ha: "Hausa",
};

/**
 * Get preferred language from localStorage
 */
export const getPreferredLanguage = () => {
  try {
    const lang = localStorage.getItem(LANGUAGE_PREF_KEY);
    return lang && SUPPORTED_LANGUAGES[lang] ? lang : "en";
  } catch (error) {
    console.warn("Failed to get preferred language:", error);
    return "en";
  }
};

/**
 * Set and persist preferred language
 */
export const setPreferredLanguage = (languageCode) => {
  if (!SUPPORTED_LANGUAGES[languageCode]) {
    console.warn(`Unsupported language: ${languageCode}`);
    return;
  }
  try {
    localStorage.setItem(LANGUAGE_PREF_KEY, languageCode);
  } catch (error) {
    console.warn("Failed to set preferred language:", error);
  }
};

/**
 * Translate a single text string
 */
export const translateText = async (text, targetLanguage = "en") => {
  if (!text || typeof text !== "string") {
    return text;
  }

  if (targetLanguage === "en") {
    return text;
  }

  const languageMap = STATIC_TRANSLATIONS[targetLanguage];
  if (!languageMap) {
    return text;
  }

  // Try exact match
  if (languageMap[text]) {
    return languageMap[text];
  }

  // Case-insensitive match fallback
  const lowerText = text.trim().toLowerCase();
  const matchedEntry = Object.entries(languageMap).find(([source]) => source.trim().toLowerCase() === lowerText);
  if (matchedEntry) {
    return matchedEntry[1];
  }

  return text;
};

/**
 * Translate multiple texts in batch (for efficiency)
 */
export const translateBatch = async (textArray, targetLanguage = "en") => {
  if (!Array.isArray(textArray)) {
    return textArray;
  }

  if (targetLanguage === "en") {
    return textArray;
  }

  const languageMap = STATIC_TRANSLATIONS[targetLanguage];
  if (!languageMap) {
    return textArray;
  }

  return Promise.all(textArray.map((text) => translateText(text, targetLanguage)));
};

/**
 * Translate an object's string values
 */
export const translateObject = async (obj, targetLanguage = "en") => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (targetLanguage === "en") {
    return obj;
  }

  const translated = {};
  const promises = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      const promise = translateText(value, targetLanguage).then((result) => {
        translated[key] = result;
      });
      promises.push(promise);
    } else if (typeof value === "object" && value !== null) {
      const promise = translateObject(value, targetLanguage).then((result) => {
        translated[key] = result;
      });
      promises.push(promise);
    } else {
      translated[key] = value;
    }
  }

  await Promise.all(promises);
  return translated;
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = () => {
  return SUPPORTED_LANGUAGES;
};

export default {
  translateText,
  translateBatch,
  translateObject,
  getPreferredLanguage,
  setPreferredLanguage,
  getSupportedLanguages,
};
