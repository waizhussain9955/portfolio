"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialise theme from document attribute (set by head script) or cookie
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    if (currentTheme) {
      setTheme(currentTheme);
    } else {
      const match = document.cookie.match(/(^| )theme=([^;]+)/);
      if (match && (match[2] === "dark" || match[2] === "light")) {
        setTheme(match[2]);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Set theme attribute on html tag
    document.documentElement.setAttribute("data-theme", newTheme);
    
    // Write cookie (expires in 1 year)
    document.cookie = `theme=${newTheme};path=/;max-age=31536000;SameSite=Strict`;
  };

  if (!mounted) {
    return (
      <button
        className="p-2.5 rounded-xl border border-border/30 bg-bg-secondary/40 text-text-primary/50 transition-all duration-200 opacity-60"
        aria-label="Toggle Theme"
        id="theme-toggle-btn"
        disabled
      >
        ☀️ Theme
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-border/30 hover:border-accent-primary/40 bg-bg-secondary/40 text-text-primary transition-all duration-200"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
