"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data/projects";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollAnimation from "@/components/ScrollAnimation";

const ProjectsPage = () => {
    return (
        <main className="relative min-h-screen selection:bg-accent-primary selection:text-bg-primary">
            <ParticleBackground />
            <Navbar />

            <section className="pt-32 pb-24 relative">
                <div className="container mx-auto px-6">
                    <ScrollAnimation className="mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-accent-primary font-bold group mb-12 hover:translate-x-[-4px] transition-all duration-300"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>

                        <div className="flex items-center space-x-2 text-accent-primary mb-4">
                            <span className="w-8 h-[1px] bg-accent-primary"></span>
                            <span className="text-sm font-bold tracking-widest uppercase">Portfolio</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Complete Project Archive</h1>
                        <p className="text-text-secondary max-w-2xl text-lg">
                            A showcase of my journey in Full Stack Development, Mobile Apps, and AI-powered systems. Each project represents a real-world problem solved with modern technology.
                        </p>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {projects.map((project, idx) => (
                            <ProjectCard key={project.title} project={project} idx={idx} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ProjectsPage;
