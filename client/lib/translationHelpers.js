/**
 * Translation Configuration & Helper Utilities
 * Advanced features for the translation system
 */

import { translateText, translateBatch, getSupportedLanguages } from "@/lib/translationService";

/**
 * Translation Configuration
 * Customize these settings to match your needs
 */
export const TranslationConfig = {
  // Enable debug mode (logs to console)
  DEBUG: process.env.NODE_ENV === "development",

  // Cache strategy
  CACHE: {
    ENABLED: true,
    MAX_SIZE: 10000, // Maximum entries to keep in memory
    PERSIST_TO_STORAGE: true, // Save to localStorage
  },

  // API settings
  API: {
    TIMEOUT: 5000, // milliseconds
    RETRY_COUNT: 1, // number of retries on failure
    RETRY_DELAY: 1000, // milliseconds between retries
  },

  // Language settings
  LANGUAGES: {
    DEFAULT: "en",
    FALLBACK: "en",
    SUPPORTED: getSupportedLanguages(),
  },

  // Performance
  PERFORMANCE: {
    BATCH_SIZE: 10, // Max texts per batch request
    DEBOUNCE_TIME: 300, // milliseconds
  },
};

/**
 * Helper: Translate text with retries
 */
export const translateWithRetry = async (text, language, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (TranslationConfig.DEBUG) {
        console.log(`[Translation] Attempt ${i + 1}: "${text}" → ${language}`);
      }
      const result = await translateText(text, language);
      return result;
    } catch (error) {
      if (i === retries - 1) {
        console.error(`[Translation] Failed after ${retries} attempts:`, error);
        return text; // Fallback to original
      }
      await new Promise((resolve) =>
        setTimeout(resolve, TranslationConfig.API.RETRY_DELAY)
      );
    }
  }
};

/**
 * Helper: Translate React component props
 * Useful for translating dynamic component props
 */
export const translateProps = async (props, language, fieldsToTranslate) => {
  const translated = { ...props };

  for (const field of fieldsToTranslate) {
    if (props[field] && typeof props[field] === "string") {
      translated[field] = await translateText(props[field], language);
    }
  }

  return translated;
};

/**
 * Helper: Create a translated dropdown/select options array
 */
export const createTranslatedOptions = async (options, language) => {
  if (!Array.isArray(options)) {
    return options;
  }

  return Promise.all(
    options.map(async (option) => {
      if (typeof option === "string") {
        return {
          label: await translateText(option, language),
          value: option,
        };
      } else if (typeof option === "object" && option.label) {
        return {
          ...option,
          label: await translateText(option.label, language),
        };
      }
      return option;
    })
  );
};

/**
 * Helper: Debounced translation for text inputs
 * Prevents too many API calls during typing
 */
export const createDebouncedTranslator = (callback, delay = TranslationConfig.PERFORMANCE.DEBOUNCE_TIME) => {
  let timeoutId;

  return (text, language) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const translated = await translateText(text, language);
      callback(translated);
    }, delay);
  };
};

/**
 * Helper: Translate table data
 */
export const translateTableData = async (data, language, columns) => {
  return Promise.all(
    data.map(async (row) => {
      const translated = { ...row };

      for (const column of columns) {
        if (row[column] && typeof row[column] === "string") {
          translated[column] = await translateText(row[column], language);
        }
      }

      return translated;
    })
  );
};

/**
 * Helper: Get language-specific formatting
 */
export const getLanguageSpecificFormat = (language) => {
  const formats = {
    en: {
      dateFormat: "MM/DD/YYYY",
      currencySymbol: "$",
      numberFormat: "en-US",
    },
    ha: {
      dateFormat: "DD/MM/YYYY",
      currencySymbol: "₦",
      numberFormat: "ar-NG", // Hausa uses Arabic numerals
    },
    ig: {
      dateFormat: "DD/MM/YYYY",
      currencySymbol: "₦",
      numberFormat: "en-NG",
    },
    yo: {
      dateFormat: "DD/MM/YYYY",
      currencySymbol: "₦",
      numberFormat: "en-NG",
    },
  };

  return formats[language] || formats.en;
};

/**
 * Helper: Format currency for language
 */
export const formatCurrencyByLanguage = (amount, language) => {
  const format = getLanguageSpecificFormat(language);
  return new Intl.NumberFormat(format.numberFormat, {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

/**
 * Helper: Format date for language
 */
export const formatDateByLanguage = (date, language) => {
  const format = getLanguageSpecificFormat(language);
  return new Intl.DateTimeFormat(format.numberFormat).format(new Date(date));
};

/**
 * Helper: Create language-aware search filter
 */
export const createTranslatedSearchFilter = async (items, searchText, language, fieldsToSearch) => {
  if (!searchText) {
    return items;
  }

  const translatedSearch = await translateText(searchText.toLowerCase(), language);

  return items.filter((item) => {
    return fieldsToSearch.some((field) => {
      const value = item[field];
      if (!value) return false;

      const searchValue = typeof value === "string" ? value.toLowerCase() : String(value);
      return searchValue.includes(translatedSearch) || searchValue.includes(searchText.toLowerCase());
    });
  });
};

/**
 * Helper: Translate form validation messages
 */
export const getTranslatedValidationMessage = async (messageKey, language) => {
  const messages = {
    required: "This field is required",
    email: "Please enter a valid email",
    minLength: "Minimum length is",
    maxLength: "Maximum length is",
    pattern: "Invalid format",
    number: "Please enter a valid number",
  };

  const message = messages[messageKey] || messageKey;
  return translateText(message, language);
};

/**
 * Helper: Batch translate validation messages
 */
export const getTranslatedValidationMessages = async (messageKeys, language) => {
  const messages = {};

  for (const key of messageKeys) {
    messages[key] = await getTranslatedValidationMessage(key, language);
  }

  return messages;
};

/**
 * Helper: Create language switcher options
 */
export const getLanguageSwitcherOptions = () => {
  const languages = TranslationConfig.LANGUAGES.SUPPORTED;
  return Object.entries(languages).map(([code, name]) => ({
    code,
    name,
    flag: getLanguageFlag(code),
  }));
};

/**
 * Helper: Get flag emoji for language (optional decoration)
 */
export const getLanguageFlag = (languageCode) => {
  const flags = {
    en: "🇬🇧",
    ha: "🇳🇬",
    ig: "🇳🇬",
    yo: "🇳🇬",
  };
  return flags[languageCode] || "🌐";
};

/**
 * Helper: Get language color for UI (optional)
 */
export const getLanguageColor = (languageCode) => {
  const colors = {
    en: "bg-blue-100 text-blue-800",
    ha: "bg-green-100 text-green-800",
    ig: "bg-red-100 text-red-800",
    yo: "bg-yellow-100 text-yellow-800",
  };
  return colors[languageCode] || "bg-gray-100 text-gray-800";
};

/**
 * Helper: Debug translation status
 */
export const logTranslationDebug = (language) => {
  if (!TranslationConfig.DEBUG) return;

  console.group(`[Translation Debug] Language: ${language}`);
  console.log("Config:", TranslationConfig);
  console.log("Supported Languages:", TranslationConfig.LANGUAGES.SUPPORTED);
  console.log("Language-specific format:", getLanguageSpecificFormat(language));
  console.groupEnd();
};

/**
 * Helper: Validate language code
 */
export const isValidLanguage = (languageCode) => {
  return languageCode in TranslationConfig.LANGUAGES.SUPPORTED;
};

/**
 * Helper: Get nearest valid language (for fallback)
 */
export const getNearestValidLanguage = (requestedLanguage, fallback = "en") => {
  if (isValidLanguage(requestedLanguage)) {
    return requestedLanguage;
  }

  // Try to find a language that starts with the same code
  const langPrefix = requestedLanguage.split("-")[0];
  const supportedLangs = Object.keys(TranslationConfig.LANGUAGES.SUPPORTED);
  const nearest = supportedLangs.find((lang) => lang.startsWith(langPrefix));

  return nearest || fallback;
};

export default {
  TranslationConfig,
  translateWithRetry,
  translateProps,
  createTranslatedOptions,
  createDebouncedTranslator,
  translateTableData,
  getLanguageSpecificFormat,
  formatCurrencyByLanguage,
  formatDateByLanguage,
  createTranslatedSearchFilter,
  getTranslatedValidationMessage,
  getTranslatedValidationMessages,
  getLanguageSwitcherOptions,
  getLanguageFlag,
  getLanguageColor,
  logTranslationDebug,
  isValidLanguage,
  getNearestValidLanguage,
};
