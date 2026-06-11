"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "./LanguageContext";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇺🇸", fullName: "English" },
  { code: "ur", label: "اردو", flag: "🇵🇰", fullName: "اردو" },
  { code: "de", label: "DE", flag: "🇩🇪", fullName: "Deutsch" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code as "en" | "ur" | "de");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left z-50">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 bg-bg-secondary/80 border border-accent-primary/30 text-text-primary hover:border-accent-primary/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer rounded-xl text-xs font-bold transition-all duration-300"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none flex items-center justify-center">
          {activeLang.flag}
        </span>
        <span className="font-mono tracking-wider">
          {activeLang.label}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-36 bg-bg-secondary/95 backdrop-blur-xl rounded-2xl border border-accent-primary/30 shadow-2xl py-1.5 focus:outline-none animate-fadeIn">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-colors font-medium hover:bg-accent-primary/10 ${
                language === lang.code ? "text-accent-primary bg-accent-primary/5 font-bold" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="text-base leading-none flex items-center justify-center">{lang.flag}</span>
              <span>{lang.fullName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
