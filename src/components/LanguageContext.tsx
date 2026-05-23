import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import en from "../locales/en/translation.json";
import rw from "../locales/rw/translation.json";
import fr from "../locales/fr/translation.json";
import sw from "../locales/sw/translation.json";

export type Language = "en" | "rw" | "fr" | "sw";

const resources: Record<Language, any> = { en, rw, fr, sw };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [language]);

  const t = (key: string) => {
    // Support nested keys like "home.hero.title"
    const keys = key.split('.');
    let value: any = resources[language];
    
    for (const k of keys) {
      value = value?.[k];
    }

    if (value) return value;

    // Fallback to English
    value = resources["en"];
    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
