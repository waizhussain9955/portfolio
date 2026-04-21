"use client";

import React, { useEffect, useState, useRef } from "react";
import ScrollAnimation from "./ScrollAnimation";

interface Skill {
    name: string;
    icon: string;
    level: string;
    percentage: number;
}

const skills: Skill[] = [
    { name: "HTML5", icon: "</>", level: "Expert", percentage: 95 },
    { name: "CSS / CSS3", icon: "🎨", level: "Expert", percentage: 92 },
    { name: "Tailwind CSS", icon: "💨", level: "Expert", percentage: 90 },
    { name: "JavaScript", icon: "⚡", level: "Advanced", percentage: 85 },
    { name: "React.js", icon: "⚛️", level: "Advanced", percentage: 88 },
    { name: "TypeScript", icon: "🔷", level: "Advanced", percentage: 82 },
    { name: "Next.js", icon: "🚀", level: "Advanced", percentage: 80 },
    { name: "Python", icon: "🐍", level: "Intermediate", percentage: 72 },
    { name: "Agentic AI", icon: "🤖", level: "Expert", percentage: 99 },
    { name: "Automation", icon: "⚙️", level: "Expert", percentage: 100 },
    { name: "OpenAI SDK", icon: "🧠", level: "Advanced", percentage: 80 },
    { name: "AI-Driven Dev", icon: "🔮", level: "Expert", percentage: 90 },
    // --- Waiz's Additional Skills (from resume) ---
    { name: "Dart / Flutter", icon: "📱", level: "Advanced", percentage: 85 },
    { name: "Node.js", icon: "🟢", level: "Advanced", percentage: 83 },
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
    { name: "Flutter Mobile", icon: "📲", level: "Advanced", percentage: 83 },
];

const Skills: React.FC = () => {
    const [inView, setInView] = useState(false);
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

    return (
        <section id="skills" className="py-24 bg-bg-secondary/30 relative" ref={sectionRef}>
            <div className="container mx-auto px-6">
                <ScrollAnimation className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-2 text-accent-primary mb-4">
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                        <span className="text-sm font-bold tracking-widest uppercase">My Expertise</span>
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                        Technologies I Work With
                    </h2>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skills.map((skill, idx) => (
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
                                        {skill.level}
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
            </div>
        </section>
    );
};

export default Skills;
