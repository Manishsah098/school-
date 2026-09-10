import React, { createContext, useContext, useState, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const t = useCallback((key, fallback = '') => {
    if (!key) return fallback;
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  }, [language]);

  const currentLanguageObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const openLanguageModal = useCallback(() => setIsLanguageModalOpen(true), []);
  const closeLanguageModal = useCallback(() => setIsLanguageModalOpen(false), []);

  const selectLanguage = useCallback((langCode) => {
    setLanguage(langCode);
    setIsLanguageModalOpen(false);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: selectLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageObj,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
