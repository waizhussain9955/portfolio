"use client";

import Link from "next/link";
import ProjectCard from "./ProjectCard";
import ScrollAnimation from "./ScrollAnimation";
import { projects } from "@/lib/data/projects";

const Projects: React.FC = () => {
    return (
        <section id="projects" className="py-24 relative">
            <div className="container mx-auto px-6">
                <ScrollAnimation className="mb-16">
                    <div className="flex items-center space-x-2 text-accent-primary mb-4">
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                        <span className="text-sm font-bold tracking-widest uppercase">Projects</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">What I&apos;ve Built</h2>
                </ScrollAnimation>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
                    {projects.slice(0, 6).map((project, idx) => (
                        <ProjectCard key={project.title} project={project} idx={idx} />
                    ))}
                </div>

                <ScrollAnimation className="flex justify-center">
                    <Link
                        href="/projects"
                        className="group relative px-8 py-4 bg-transparent border border-accent-primary/50 text-accent-primary font-bold rounded-full overflow-hidden transition-all duration-300 hover:border-accent-primary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            View All Projects
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </ScrollAnimation>
            </div>
        </section>
    );
};

export default Projects;
