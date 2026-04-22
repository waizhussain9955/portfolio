"use client";

import React from "react";
import ScrollAnimation from "./ScrollAnimation";

const About: React.FC = () => {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:w-7/12">
                        <ScrollAnimation>
                            <div className="flex items-center space-x-2 text-accent-primary mb-4">
                                <span className="w-8 h-[1px] bg-accent-primary"></span>
                                <span className="text-sm font-bold tracking-widest uppercase">About Me</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">
                                A Few Words About Me
                            </h2>
                            <p className="text-text-secondary text-lg mb-10 leading-relaxed">
                                I am a Full Stack Developer and AI Builder based in Pakistan. With
                                hands-on experience in HTML5, CSS3, Tailwind CSS, React.js, Next.js,
                                Node.js, Flutter, and Python, I specialize in building real-world
                                applications across web, mobile, and AI domains. My deep focus on
                                Autonomous Systems, SaaS products, and AI-assisted workflows drives
                                me to create scalable, production-ready digital products.
                            </p>


                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = '/resume/Waiz_Resume_Full_Stack_Dev.pdf';
                                    link.download = 'Waiz_Resume_Full_Stack_Dev.pdf';
                                    document.body.appendChild(link);

                                    const btn = document.getElementById('resume-btn');
                                    if (btn) {
                                        const originalText = btn.innerHTML;
                                        btn.innerHTML = 'Downloading...';
                                        setTimeout(() => {
                                            btn.innerHTML = originalText;
                                        }, 1000);
                                    }

                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                id="resume-btn"
                                className="inline-flex items-center space-x-2 px-8 py-3 bg-transparent border border-accent-primary text-accent-primary font-bold rounded-full hover:bg-accent-primary/10 transition-all group"
                            >
                                <span>Download Resume</span>
                                <svg
                                    className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </ScrollAnimation>
                    </div>

                    {/* Right Column: Visual */}
                    <div className="lg:w-5/12 flex justify-center items-center">
                        <ScrollAnimation delay={500}>
                            <div className="relative">
                                {/* Rotating Border Aura */}
                                <div className="absolute inset-0 -m-4 rounded-full bg-gradient-primary animate-spin-slow blur-md opacity-30" />

                                {/* Avatar Placeholder */}
                                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-bg-secondary flex items-center justify-center bg-bg-secondary overflow-hidden">
                                    <span className="text-7xl md:text-8xl font-heading font-extrabold text-gradient pointer-events-none">
                                        WH
                                    </span>
                                </div>

                                {/* Floating Badges */}
                                <div className="absolute top-0 -left-12 p-3 glass rounded-xl text-xs font-bold animate-float flex items-center space-x-2">
                                    <span>🏢</span>
                                    <span>Full Stack Developer</span>
                                </div>
                                <div className="absolute bottom-10 -right-16 p-3 glass rounded-xl text-xs font-bold animate-float-delayed flex items-center space-x-2">
                                    <span>🤖</span>
                                    <span>AI Builder</span>
                                </div>
                                <div className="absolute -bottom-8 left-4 p-3 glass rounded-xl text-xs font-bold animate-float flex items-center space-x-2">
                                    <span>📍</span>
                                    <span>Pakistan</span>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
        </section>
    );
};

export default About;
