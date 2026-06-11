"use client";

import React, { useState, useEffect } from "react";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";

const Typewriter: React.FC<{ words: string[] }> = ({ words }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [blink, setBlink] = useState(true);
    const [reverse, setReverse] = useState(false);

    // Reset typewriter state if the words list changes (e.g. language changes)
    useEffect(() => {
        setIndex(0);
        setSubIndex(0);
        setReverse(false);
    }, [words]);

    // Blinking cursor
    useEffect(() => {
        const timeout = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout);
    }, [blink]);

    // Typing logic
    useEffect(() => {
        if (words.length === 0) return;

        const currentWord = words[index];

        // If finished typing, hold for 2.5s and then start deleting
        if (subIndex === currentWord.length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 2500);
            return () => clearTimeout(timeout);
        }

        // If finished deleting, move to next word
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 30 : 80);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="inline-block relative">
            {words[index].substring(0, subIndex)}
            <span
                className={`inline-block w-[3px] h-6 md:h-8 bg-accent-primary ml-1.5 ${blink ? "opacity-100" : "opacity-0"}`}
                style={{ verticalAlign: "middle" }}
            />
        </span>
    );
};

const Hero: React.FC = () => {
    const { t, language } = useLanguage();

    const greetingWords = t.heroGreeting.split(" ");
    const nameWords = t.heroTitle.split(" ");
    const typewriterWords = [t.heroSubtitle, t.heroSubtitle2];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            }
        }
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
        >
            {/* Background Mesh Gradient Blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/20 blur-[120px] rounded-full animate-pulse-glow -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-secondary/20 blur-[150px] rounded-full animate-float -z-10" />

            <div className="container mx-auto px-6 text-center z-10">
                <ScrollAnimation delay={200}>
                    <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full glass border border-border mb-8 animate-fadeIn">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium tracking-wider uppercase text-text-secondary">
                            ✦ {t.availableForWork}
                        </span>
                    </div>
                </ScrollAnimation>

                <div className="mb-6">
                    <motion.h1 
                        key={language}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-2"
                    >
                        {greetingWords.map((word, i) => (
                            <motion.span
                                key={`greet-${i}`}
                                variants={wordVariants}
                                className="inline-block text-text-primary"
                            >
                                {word}
                            </motion.span>
                        ))}
                        {nameWords.map((word, i) => (
                            <motion.span
                                key={`name-${i}`}
                                variants={wordVariants}
                                className="inline-block text-gradient"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                </div>

                <div className="min-h-[40px] md:min-h-[48px] flex items-center justify-center mb-8">
                    <h2 className="text-xl md:text-3xl font-body text-text-primary/90 max-w-2xl mx-auto leading-relaxed">
                        <Typewriter words={typewriterWords} />
                    </h2>
                </div>

                <ScrollAnimation delay={800}>
                    <p className="text-text-secondary md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t.heroDescription}
                    </p>
                </ScrollAnimation>

                <ScrollAnimation delay={1000}>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse">
                        <a
                            href="#projects"
                            className="px-6 sm:px-10 py-3.5 sm:py-4 bg-accent-primary text-bg-primary font-bold rounded-full hover:shadow-[0_0_30px_var(--color-glow)] transition-all transform hover:-translate-y-1 text-center w-full sm:w-auto"
                        >
                            {t.viewWork}
                        </a>
                        <a
                            href="/resume/Waiz_Resume_Full_Stack_Dev.pdf"
                            download="Waiz_Resume_Full_Stack_Dev.pdf"
                            className="px-6 sm:px-10 py-3.5 sm:py-4 border border-accent-primary text-accent-primary font-bold rounded-full hover:bg-accent-primary/10 transition-all transform hover:-translate-y-1 text-center w-full sm:w-auto"
                        >
                            {t.downloadResume}
                        </a>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default Hero;
