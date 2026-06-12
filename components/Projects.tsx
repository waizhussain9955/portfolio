"use client";

import Link from "next/link";
import ProjectCard from "./ProjectCard";
import ScrollAnimation from "./ScrollAnimation";
import { projects as fallbackProjects, Project } from "@/lib/data/projects";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

const projectTranslations: Record<string, Record<string, any>> = {
  ur: {
    "TIKTOK DOWNLOADER - FLAGSHIP SAAS": {
      title: "ٹک ٹاک ڈاؤنلوڈر - فلیگ شپ ساس",
      desc: "ٹک ٹاک ویڈیوز کو واٹر مارک کے بغیر ڈاؤن لوڈ کرنے کے لیے ایک مکمل SaaS ماحولیاتی نظام۔ اس میں بلک ڈاؤن لوڈنگ، فاسٹ پروسیسنگ، اور صاف ستھرا یوزر انٹرفیس شامل ہے۔"
    },
    "MODERN WATCH STORE": {
      title: "جدید گھڑیوں کا اسٹور",
      desc: "پریمیم گھڑیوں کے مجموعہ کو پیش کرنے والا ایک جدید ای کامرس فرنٹ اینڈ جس میں ریسپونسیو UI اور نیویگیشن سسٹم شامل ہے۔"
    },
    "T DOWNLOADER ANDROID APP": {
      title: "ٹی ڈاؤنلوڈر اینڈرائیڈ ایپ",
      desc: "سوشل میڈیا ویڈیوز کے لیے ایک تیز اور واٹر مارک سے پاک اینڈرائیڈ ڈاؤنلوڈر ایپلی کیشن۔"
    },
    "WORD BLAZE GAME": {
      title: "ورڈ بلیز گیم",
      desc: "انٹرایکٹو براؤزر پر مبنی الفاظ کا اندازہ لگانے والی گیم جس میں جدید گیم لاجک اور بہترین یوزر ایکسپیرینس شامل ہے۔"
    },
    "JEWELRY STORE WEBSITE": {
      title: "جیولری اسٹور ویب سائٹ",
      desc: "خوبصورت جیولری شوکیس ویب سائٹ جو پریمیم پروڈکٹس کو بہترین طریقے سے پیش کرتی ہے۔"
    }
  },
  de: {
    "TIKTOK DOWNLOADER - FLAGSHIP SAAS": {
      title: "TIKTOK DOWNLOADER - FLAGSHIP SAAS",
      desc: "Ein komplettes SaaS-Ökosystem, das von Grund auf für das effiziente Herunterladen von TikTok-Videos entwickelt wurde. Ermöglicht Downloads ohne Wasserzeichen."
    },
    "MODERN WATCH STORE": {
      title: "MODERN WATCH STORE",
      desc: "Ein modernes E-Commerce-Frontend, das Premium-Uhrenkollektionen mit responsivem UI und sauberer Navigation präsentiert."
    },
    "T DOWNLOADER ANDROID APP": {
      title: "T DOWNLOADER ANDROID APP",
      desc: "Android-basierte Video-Downloader-App für schnelle, wasserzeichenfreie Social-Media-Videodownloads."
    },
    "WORD BLAZE GAME": {
      title: "WORD BLAZE SPIEL",
      desc: "Ein interaktives browserbasiertes Wortratespiel mit dynamischer Wortlogik und ansprechendem Benutzererlebnis."
    },
    "JEWELRY STORE WEBSITE": {
      title: "SCHMUCKGESCHÄFT-WEBSITE",
      desc: "Schmuck-Showcase-Website, die Premium-Produkte in ansprechendem Design präsentiert."
    }
  }
};

const Projects: React.FC = () => {
    const { t, language } = useLanguage();
    const [projects, setProjects] = useState(fallbackProjects);

    useEffect(() => {
        let mounted = true;

        fetch("/api/public/projects?homepage=true", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                if (mounted && data.projects?.length) setProjects(data.projects);
            })
            .catch(() => {
                if (mounted) setProjects(fallbackProjects);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const translateProject = (project: Project) => {
        const langData = projectTranslations[language]?.[project.title];
        if (langData) {
            return {
                ...project,
                title: langData.title,
                desc: langData.desc
            };
        }
        return project;
    };

    return (
        <section id="projects" className="py-16 sm:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                <ScrollAnimation className="mb-16">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-accent-primary mb-4">
                        <span className="w-8 h-[1px] bg-accent-primary"></span>
                        <span className="text-sm font-bold tracking-widest uppercase">{t.navProjects}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">{t.projectsSubtitle}</h2>
                </ScrollAnimation>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
                    {projects.slice(0, 6).map((p, idx) => {
                        const project = translateProject(p);
                        return (
                            <ProjectCard key={p.title} project={project} idx={idx} />
                        );
                    })}
                </div>

                <ScrollAnimation className="flex justify-center">
                    <Link
                        href="/projects"
                        className="group relative px-8 py-4 bg-transparent border border-accent-primary/50 text-accent-primary font-bold rounded-full overflow-hidden transition-all duration-300 hover:border-accent-primary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {t.viewAllProjects}
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
