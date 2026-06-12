"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "./LanguageContext";

interface Skill {
    name: string;
    icon: string;
    level: "Expert" | "Advanced" | "Intermediate";
    percentage: number;
}

const skills: Skill[] = [
    { name: "Agentic AI", icon: "🤖", level: "Expert", percentage: 99 },
    { name: "Next.js", icon: "🚀", level: "Advanced", percentage: 80 },
    { name: "React.js", icon: "⚛️", level: "Advanced", percentage: 88 },
    { name: "Tailwind CSS", icon: "💨", level: "Expert", percentage: 90 },
    { name: "TypeScript", icon: "🔷", level: "Advanced", percentage: 82 },
    { name: "Node.js", icon: "🟢", level: "Advanced", percentage: 83 },
    { name: "Dart / Flutter", icon: "📱", level: "Advanced", percentage: 85 },
    { name: "AI-Driven Dev", icon: "🔮", level: "Expert", percentage: 90 },
    // — hidden until "View All" clicked —
    { name: "HTML5", icon: "</>" , level: "Expert", percentage: 95 },
    { name: "CSS / CSS3", icon: "🎨", level: "Expert", percentage: 92 },
    { name: "JavaScript", icon: "⚡", level: "Advanced", percentage: 85 },
    { name: "Python", icon: "🐍", level: "Intermediate", percentage: 72 },
    { name: "Automation", icon: "⚙️", level: "Expert", percentage: 100 },
    { name: "OpenAI SDK", icon: "🧠", level: "Advanced", percentage: 80 },
    { name: "Express.js", icon: "🛤️", level: "Advanced", percentage: 80 },
    { name: "MongoDB", icon: "🍃", level: "Advanced", percentage: 78 },
    { name: "PHP", icon: "🐘", level: "Intermediate", percentage: 70 },
    { name: "SQL / MySQL", icon: "🗄️", level: "Advanced", percentage: 78 },
    { name: "Bootstrap", icon: "🅱️", level: "Expert", percentage: 90 },
    { name: "Prompt Engineering", icon: "✍️", level: "Expert", percentage: 95 },
    { name: "Gemini API", icon: "💎", level: "Advanced", percentage: 82 },
    { name: "Supabase", icon: "⚡", level: "Advanced", percentage: 80 },
    { name: "Firebase", icon: "🔥", level: "Advanced", percentage: 82 },
    { name: "SaaS Development", icon: "☁️", level: "Advanced", percentage: 85 },
];

const INITIAL_COUNT = 8;

const Skills: React.FC = () => {
    const { t } = useLanguage();
    const [inView, setInView] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const getLevelTranslation = (level: "Expert" | "Advanced" | "Intermediate") => {
        if (level === "Expert") return t.skillExpert;
        if (level === "Advanced") return t.skillAdvanced;
        return t.skillIntermediate;
    };

    const visibleSkills = showAll ? skills : skills.slice(0, INITIAL_COUNT);
    const hiddenCount = skills.length - INITIAL_COUNT;

    return (
        <section id="skills" className="py-16 sm:py-24 bg-bg-secondary/30 relative overflow-hidden" ref={sectionRef}>
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <ScrollAnimation className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-accent-primary mb-4">
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                        <span className="text-sm font-bold tracking-widest uppercase">{t.skillsBadge}</span>
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                        {t.skillsTitle}
                    </h2>
                    <p className="text-text-secondary mt-3">{t.skillsSubtitle}</p>
                </ScrollAnimation>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleSkills.map((skill, idx) => (
                        <ScrollAnimation key={skill.name} delay={idx * 50}>
                            <div className="group p-7 glass rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:border-accent-primary/40 hover:shadow-[0_10px_30px_var(--color-glow)] relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-primary text-2xl group-hover:scale-110 transition-transform">
                                        {skill.icon}
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${skill.level === "Expert"
                                            ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary"
                                            : skill.level === "Advanced"
                                                ? "bg-accent-secondary/20 border-accent-secondary/50 text-accent-secondary"
                                                : "bg-accent-light/20 border-accent-light/50 text-accent-light"
                                            }`}
                                    >
                                        {getLevelTranslation(skill.level)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold mb-4 font-heading">{skill.name}</h3>

                                <div className="relative h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-1000 ease-out"
                                        style={{ width: inView ? `${skill.percentage}%` : "0%" }}
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <span className="text-[10px] font-mono text-text-secondary">{skill.percentage}%</span>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* Show More / Show Less */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                    <button
                        onClick={() => setShowAll((prev) => !prev)}
                        className="group flex items-center gap-2 px-8 py-3 rounded-full border border-accent-primary/40 text-accent-primary font-bold text-sm hover:bg-accent-primary/10 hover:border-accent-primary transition-all duration-300 hover:-translate-y-0.5"
                    >
                        {showAll ? (
                            <>
                                {t.showLessSkills}
                                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                {t.viewAllSkills}
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-[10px] font-mono text-accent-primary">
                                    +{hiddenCount}
                                </span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>

                    <Link
                        href="/projects"
                        className="group flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-primary text-bg-primary font-bold text-sm hover:shadow-[0_0_25px_var(--color-glow)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                        {t.viewAllProjects}
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Skills;
