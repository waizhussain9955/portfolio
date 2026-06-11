"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "📊", exact: true },
  { href: "/admin/projects", label: "Projects", icon: "🗂️" },
  { href: "/admin/blog", label: "Blog", icon: "✍️" },
  { href: "/admin/services", label: "Services", icon: "💼" },
  { href: "/admin/resume", label: "Resume", icon: "📄" },
  { href: "/admin/media", label: "Media Library", icon: "🖼️" },
  { href: "/admin/knowledge", label: "Knowledge Base", icon: "🧠" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/contacts", label: "Contacts", icon: "📬" },
  { href: "/admin/leads", label: "Leads", icon: "🎯" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("current_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!["super_admin", "admin", "editor"].includes(parsed.role)) {
        router.push("/?error=unauthorized");
      } else {
        setUser(parsed);
      }
    } else {
      router.push("/login?redirect=/admin");
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("current_user");
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/");
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-secondary border-r border-border/30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/30">
          <Link href="/" className="text-2xl font-heading font-extrabold tracking-tighter">
            <span className="text-gradient">WH</span>
            <span className="text-xs text-text-secondary ml-2 font-mono font-normal">/ admin</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href, item.exact)
                  ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-primary/50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold text-sm">
              {user.name?.charAt(0).toUpperCase() || "W"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-accent-primary uppercase tracking-widest font-mono">
                {user.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 text-center py-2 text-xs text-text-secondary hover:text-text-primary border border-border/30 rounded-lg transition-colors"
            >
              ← Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border/30 bg-bg-secondary/50 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 text-sm text-text-secondary font-mono">
            {pathname.split("/").filter(Boolean).join(" / ")}
          </div>
          <div className="text-xs text-accent-primary font-mono bg-accent-primary/10 px-3 py-1 rounded-full border border-accent-primary/20">
            CMS v1.0
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
