"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageContext";

const LanguageToggle = dynamic(() => import("./LanguageToggle"), { ssr: false });

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        if (pathname === "/projects") {
            setActiveSection("projects");
        } else if (pathname === "/services") {
            setActiveSection("services");
        } else if (pathname.startsWith("/blog")) {
            setActiveSection("blog");
        } else {
            setActiveSection("home");
        }
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (pathname === "/") {
                const sections = ["home", "about", "skills", "projects", "services", "blog", "contact"];
                let current = "home";
                
                for (const section of sections) {
                    const element = document.getElementById(section);
                    if (element) {
                        const offsetTop = element.offsetTop;
                        if (window.scrollY >= offsetTop - 160) {
                            current = section;
                        }
                    }
                }

                // Force to contact if scrolled to bottom
                if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
                    current = "contact";
                }

                setActiveSection(current);
            }
        };

        const handleOpenAuth = () => setIsAuthModalOpen(true);

        // Check for logged in user
        const storedUser = localStorage.getItem("current_user");
        if (storedUser) setUser(JSON.parse(storedUser));

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("open-auth-modal", handleOpenAuth);

        // Run once initially
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("open-auth-modal", handleOpenAuth);
        };
    }, [pathname]);

    // Accessibility & responsiveness event listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        setUser(null);
        setShowUserMenu(false);
        window.dispatchEvent(new CustomEvent("auth-change"));
    };

    const handleAuthSuccess = (userData: any) => {
        setUser(userData);
        window.dispatchEvent(new CustomEvent("auth-change"));
    };

    const isLinkActive = (id: string) => {
        if (id === "services") {
            return pathname === "/services" || (pathname === "/" && activeSection === "services");
        }
        if (id === "blog") {
            return pathname.startsWith("/blog") || (pathname === "/" && activeSection === "blog");
        }
        if (id === "projects") {
            return pathname === "/projects" || (pathname === "/" && activeSection === "projects");
        }
        if (id === "home") {
            return pathname === "/" && (activeSection === "home" || activeSection === "");
        }
        return pathname === "/" && activeSection === id;
    };

    const navLinks = [
        { name: t.navHome, href: "/#home", id: "home" },
        { name: t.navAbout, href: "/#about", id: "about" },
        { name: t.navSkills, href: "/#skills", id: "skills" },
        { name: t.navServices, href: "/#services", id: "services" },
        { name: t.navProjects, href: pathname === "/projects" ? "#" : "/#projects", id: "projects" },
        { name: t.navBlog, href: "/blog", id: "blog" },
        { name: t.navContact, href: "/#contact", id: "contact" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "py-4 bg-bg-primary/80 backdrop-blur-xl border-b border-accent-primary/20 shadow-lg"
                    : "py-6 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-3 sm:px-4 md:px-6 flex items-center">
                    {/* Logo - Left */}
                    <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter shrink-0">
                        <span className="text-gradient">WH</span>
                    </Link>

                    {/* Desktop Nav Links - Centered (flex-1) */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-7 xl:gap-8 rtl:gap-reverse">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`group relative text-sm font-medium transition-colors whitespace-nowrap ${isLinkActive(link.id) ? "text-accent-primary" : "text-text-secondary hover:text-accent-primary"
                                    }`}
                            >
                                {link.name}
                                {isLinkActive(link.id) && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full animate-pulse" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0 ml-2">
                        <LanguageToggle />
                        <ThemeToggle />
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="w-10 h-10 rounded-full bg-accent-primary/20 border border-accent-primary flex items-center justify-center text-accent-primary font-bold hover:shadow-[0_0_15px_var(--color-glow)] transition-all"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-3 w-48 glass rounded-2xl border border-accent-primary/20 py-2 shadow-xl animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-border/30 mb-1">
                                            <p className="text-xs text-text-secondary font-bold truncate">{user.name}</p>
                                            <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                                        </div>
                                        {(user.role === 'admin' || user.role === 'super_admin') && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setShowUserMenu(false)}
                                                className="w-full text-left px-4 py-2 text-sm text-accent-primary hover:bg-accent-primary/10 transition-colors flex items-center gap-2"
                                            >
                                                ⚙️ Admin Panel
                                            </Link>
                                        )}
                                        <Link
                                            href="/portal"
                                            onClick={() => setShowUserMenu(false)}
                                            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-accent-primary/10 transition-colors flex items-center gap-2"
                                        >
                                            💼 Client Portal
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            {t.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors"
                            >
                                {t.signIn}
                            </button>
                        )}

                        <Link
                            href="#contact"
                            className="px-5 py-2 text-sm font-bold bg-gradient-primary text-bg-primary rounded-full hover:shadow-[0_0_20px_var(--color-glow)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            {t.letsTalk}
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse md:hidden ml-auto">
                        {user && (
                            <button
                                className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary flex items-center justify-center text-accent-primary text-xs font-bold"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </button>
                        )}
                        <button
                            className="flex flex-col space-y-1.5 z-50 p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <span
                                className={`w-6 h-0.5 bg-accent-primary transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-accent-primary transition-all ${mobileMenuOpen ? "opacity-0" : ""
                                    }`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-accent-primary transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                            ></span>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setMobileMenuOpen(false);
                            }
                        }}
                        className={`fixed inset-0 bg-bg-primary transition-transform duration-500 ease-in-out flex flex-col items-center justify-start py-20 space-y-6 sm:space-y-8 text-xl sm:text-2xl font-heading overflow-y-auto overflow-x-hidden ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                            }`}
                    >
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative text-text-primary hover:text-accent-primary transition-colors transition-opacity delay-[${idx * 100}ms] ${mobileMenuOpen ? "opacity-100" : "opacity-0"
                                    } ${isLinkActive(link.id) ? "text-accent-primary" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                                {isLinkActive(link.id) && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-primary rounded-full" />
                                )}
                            </Link>
                        ))}

                        {!user ? (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setIsAuthModalOpen(true);
                                }}
                                className={`text-text-primary hover:text-accent-primary transition-opacity delay-[${navLinks.length * 100}ms] ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                            >
                                {t.signIn}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className={`text-red-400 hover:text-red-500 transition-opacity delay-[${navLinks.length * 100}ms] ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                            >
                                {t.logout}
                            </button>
                        )}

                        <div className={`flex items-center gap-3 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}>
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>

                        <Link
                            href="#contact"
                            className={`px-8 py-3 text-lg font-bold bg-gradient-primary text-bg-primary rounded-full ${mobileMenuOpen ? "opacity-100" : "opacity-0"
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t.letsTalk}
                        </Link>
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
            />
        </>
    );
};

export default Navbar;
