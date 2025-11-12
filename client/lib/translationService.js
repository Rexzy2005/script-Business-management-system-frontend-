import { STATIC_TRANSLATIONS } from "./uiText.js";

const SUPPORTED_LANGUAGES = { en: "English", ha: "Hausa" };

export const getSupportedLanguages = () => SUPPORTED_LANGUAGES;
export const getPreferredLanguage = () => {
  const saved = localStorage.getItem("preferred_language");
  return saved && SUPPORTED_LANGUAGES[saved] ? saved : "en";
};
export const setPreferredLanguage = (lang) => {
  if (SUPPORTED_LANGUAGES[lang]) localStorage.setItem("preferred_language", lang);
};
export const translateText = (text, targetLanguage = "en") => {
  const lang = targetLanguage || getPreferredLanguage();
  const translations = STATIC_TRANSLATIONS[lang] || STATIC_TRANSLATIONS.en;
  return translations[text] || text;
};
