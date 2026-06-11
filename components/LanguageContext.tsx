"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationBundle } from "@/lib/data/translations";

interface LanguageContextType {
  language: "en" | "ur" | "de";
  setLanguage: (lang: "en" | "ur" | "de") => void;
  t: TranslationBundle;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<"en" | "ur" | "de">("en");

  useEffect(() => {
    // Read from cookies or fallback to localStorage / browser settings
    const match = document.cookie.match(/(^| )lang=([^;]+)/);
    const stored = match ? match[2] : localStorage.getItem("visitor_language");
    
    if (stored === "en" || stored === "ur" || stored === "de") {
      setLanguageState(stored);
      // Set text direction
      document.documentElement.dir = stored === "ur" ? "rtl" : "ltr";
      document.documentElement.lang = stored;
    }
  }, []);

  const setLanguage = (lang: "en" | "ur" | "de") => {
    setLanguageState(lang);
    localStorage.setItem("visitor_language", lang);
    document.cookie = `lang=${lang};path=/;max-age=31536000;SameSite=Strict`;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
