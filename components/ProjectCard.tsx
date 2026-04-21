"use client";

import React from "react";
import ScrollAnimation from "./ScrollAnimation";

export interface Project {
    title: string;
    desc: string;
    tags: string[];
    gradient: string;
    image?: string;
    images?: string[];
    liveLink: string;
    githubLink: string;
}

interface ProjectCardProps {
    project: Project;
    idx: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, idx }) => {
    return (
        <ScrollAnimation delay={idx * 100} className="h-full">
            <div className="group h-full flex flex-col glass rounded-3xl overflow-hidden hover:border-accent-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_var(--color-glow)]">
                {/* Image Placeholder or Real Image */}
                <div className={`h-56 w-full flex-shrink-0 bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute top-4 right-4 text-white/50 font-heading text-2xl font-bold">
                            0{idx + 1}
                        </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-bg-primary/80 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-40">
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-accent-primary text-bg-primary rounded-full hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </a>
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/10 text-white rounded-full hover:scale-110 transition-transform border border-white/20"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-heading font-bold mb-4">{project.title}</h3>
                    <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                        {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8 flex-grow content-start">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] uppercase font-bold px-2 py-1 bg-accent-primary/10 border-l-2 border-accent-primary text-accent-primary rounded-r-md h-fit"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/20">
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-primary text-xs font-bold hover:underline"
                        >
                            Live Demo →
                        </a>
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-secondary text-xs font-bold hover:underline"
                        >
                            GitHub ↗
                        </a>
                    </div>
                </div>
            </div>
        </ScrollAnimation>
    );
};

export default ProjectCard;
