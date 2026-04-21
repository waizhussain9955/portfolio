"use client";

import React from "react";
import ScrollAnimation from "./ScrollAnimation";

const highlights = [
    {
        icon: "💻",
        title: "Clean Code",
        description: "Focusing on maintainable, scalable architecture",
    },
    {
        icon: "🤖",
        title: "AI-Driven",
        description: "Building intelligent, autonomous workflows",
    },
    {
        icon: "🎨",
        title: "Creative",
        description: "Designing intuitive, fluid user experiences",
    },
];

const Highlights: React.FC = () => {
    return (
        <section className="py-12 border-y border-border/10 bg-bg-secondary/30">
            <div className="container mx-auto px-6">
                <ScrollAnimation delay={200}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {highlights.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="text-4xl mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 cursor-default">
                                    {item.icon}
                                </div>
                                <h4 className="font-heading font-bold text-sm text-text-primary mb-2 uppercase tracking-widest">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-text-secondary leading-relaxed max-w-[200px]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default Highlights;
