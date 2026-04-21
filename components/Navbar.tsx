"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        if (pathname === "/projects") {
            setActiveSection("projects");
        }
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (pathname !== "/projects") {
                // Active section logic only for homepage
                const sections = ["home", "about", "skills", "projects", "contact"];
                const current = sections.find(section => {
                    const element = document.getElementById(section);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        return rect.top <= 100 && rect.bottom >= 100;
                    }
                    return false;
                });
                if (current) setActiveSection(current);
            }
        };

        const handleOpenAuth = () => setIsAuthModalOpen(true);
        // ... rest of effect

        // Check for logged in user
        const storedUser = localStorage.getItem("current_user");
        if (storedUser) setUser(JSON.parse(storedUser));

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("open-auth-modal", handleOpenAuth);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("open-auth-modal", handleOpenAuth);
        };
    }, []);

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

    const navLinks = [
        { name: "Home", href: "/#home", id: "home" },
        { name: "About", href: "/#about", id: "about" },
        { name: "Skills", href: "/#skills", id: "skills" },
        { name: "Projects", href: pathname === "/projects" ? "#" : "/#projects", id: "projects" },
        { name: "Contact", href: "/#contact", id: "contact" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "py-4 bg-bg-primary/80 backdrop-blur-xl border-b border-accent-primary/20 shadow-lg"
                    : "py-6 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter">
                        <span className="text-gradient">WH</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`group relative text-sm font-medium transition-colors ${activeSection === link.id ? "text-accent-primary" : "text-text-secondary hover:text-accent-primary"
                                    }`}
                            >
                                {link.name}
                                {activeSection === link.id && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full animate-pulse" />
                                )}
                            </Link>
                        ))}

                        <div className="flex items-center space-x-4 ml-4">
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
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="text-sm font-bold text-text-primary hover:text-accent-primary transition-colors"
                                >
                                    Sign In
                                </button>
                            )}

                            <Link
                                href="#contact"
                                className="px-6 py-2.5 text-sm font-bold bg-gradient-primary text-bg-primary rounded-full hover:shadow-[0_0_20px_var(--color-glow)] transition-all transform hover:-translate-y-0.5"
                            >
                                Let&apos;s Talk
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center space-x-4 md:hidden">
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
                        className={`fixed inset-0 bg-bg-primary transition-transform duration-500 ease-in-out flex flex-col items-center justify-center space-y-8 text-2xl font-heading ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                            }`}
                    >
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative text-text-primary hover:text-accent-primary transition-colors transition-opacity delay-[${idx * 100}ms] ${mobileMenuOpen ? "opacity-100" : "opacity-0"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                                {activeSection === link.id && (
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
                                Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className={`text-red-400 hover:text-red-500 transition-opacity delay-[${navLinks.length * 100}ms] ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                            >
                                Logout
                            </button>
                        )}

                        <Link
                            href="#contact"
                            className={`px-8 py-3 text-lg font-bold bg-gradient-primary text-bg-primary rounded-full ${mobileMenuOpen ? "opacity-100" : "opacity-0"
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Let&apos;s Talk
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
