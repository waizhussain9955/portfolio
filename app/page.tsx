"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Highlights from "@/components/Highlights";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import { useEffect, useState } from "react";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative selection:bg-accent-primary selection:text-bg-primary">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <About />
      <Highlights />
      <Skills />
      <Projects />
      <Contact />
      <Footer />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-2xl glass border-border/50 hover:border-accent-primary/50 hover:shadow-[0_0_20px_var(--color-glow)] transition-all duration-500 transform ${showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        aria-label="Back to Top"
      >
        <svg
          className="w-6 h-6 text-accent-primary animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </main>
  );
}
