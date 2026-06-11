"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("current_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Admin users are allowed in the portal too
      if (!["super_admin", "admin", "client"].includes(parsed.role)) {
        router.push("/?error=unauthorized");
      } else {
        setUser(parsed);
      }
    } else {
      router.push("/login?redirect=/portal");
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("current_user");
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border/30 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-heading font-extrabold tracking-tighter">
            <span className="text-gradient">WH</span>
            <span className="text-xs text-text-secondary ml-2 font-mono font-normal">/ client portal</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest font-mono">
              Secure Session
            </span>
          </div>

          <div className="flex items-center gap-3 border-l border-border/30 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-text-primary leading-none">{user.name}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-all font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
