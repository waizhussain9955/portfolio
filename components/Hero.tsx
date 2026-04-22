"use client";

import React from "react";
import ScrollAnimation from "./ScrollAnimation";

const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Background Mesh Gradient Blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/20 blur-[120px] rounded-full animate-pulse-glow -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-secondary/20 blur-[150px] rounded-full animate-float -z-10" />

            <div className="container mx-auto px-6 text-center z-10">
                <ScrollAnimation delay={200}>
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass border border-border mb-8 animate-fadeIn">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium tracking-wider uppercase text-text-secondary">
                            ✦ Available for Freelance Work
                        </span>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation delay={400}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight mb-6">
                        Hi, I&apos;m <span className="text-gradient">Waiz Hussain</span>
                    </h1>
                </ScrollAnimation>

                <ScrollAnimation delay={600}>
                    <h2 className="text-xl md:text-3xl font-body text-text-primary/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Full Stack | AI Builder | Autonomous Systems
                    </h2>
                </ScrollAnimation>

                <ScrollAnimation delay={800}>
                    <p className="text-text-secondary md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        I build real-world applications across web, mobile, and AI domains using Next.js, Flutter & Node.js.
                        Specialized in Autonomous Systems, SaaS products, and AI-powered workflows.
                    </p>
                </ScrollAnimation>

                <ScrollAnimation delay={1000}>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <a
                            href="#projects"
                            className="px-10 py-4 bg-accent-primary text-bg-primary font-bold rounded-full hover:shadow-[0_0_30px_var(--color-glow)] transition-all transform hover:-translate-y-1"
                        >
                            View My Work
                        </a>
                        <a
                            href="/resume/waiz%20Resume%20Full-Stack-Dev.pdf"
                            download="waiz_Resume_Full-Stack-Dev.pdf"
                            className="px-10 py-4 border border-accent-primary text-accent-primary font-bold rounded-full hover:bg-accent-primary/10 transition-all transform hover:-translate-y-1"
                        >
                            Download Resume
                        </a>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default Hero;
