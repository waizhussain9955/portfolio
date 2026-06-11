"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  href: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [dailyTraffic, setDailyTraffic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || {});
          setRecentContacts(data.recentContacts || []);
          setDailyTraffic(data.dailyTraffic || []);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    { label: "Projects", value: stats.projects ?? "—", icon: "🗂️", color: "accent-primary", href: "/admin/projects" },
    { label: "Blog Posts", value: stats.posts ?? "—", icon: "✍️", color: "accent-secondary", href: "/admin/blog" },
    { label: "Services", value: stats.services ?? "—", icon: "💼", color: "accent-light", href: "/admin/services" },
    { label: "Contacts", value: stats.contacts ?? "—", icon: "📬", color: "accent-primary", href: "/admin/contacts" },
    { label: "Leads", value: stats.leads ?? "—", icon: "🎯", color: "accent-secondary", href: "/admin/leads" },
    { label: "Knowledge Base", value: stats.knowledge ?? "—", icon: "🧠", color: "accent-light", href: "/admin/knowledge" },
  ];

  const trafficCards = [
    { label: "Page Views", value: stats.pageviews ?? "0", icon: "👀", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    { label: "Chat Queries", value: stats.chatQueries ?? "0", icon: "💬", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    { label: "Visitor Sessions", value: stats.sessions ?? "0", icon: "👥", color: "text-accent-primary bg-accent-primary/10 border-accent-primary/20" },
  ];

  // Find max value in traffic for scaling chart
  const maxTraffic = dailyTraffic.length > 0 ? Math.max(...dailyTraffic.map(t => t.count)) : 10;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm">Manage your portfolio content and client interactions.</p>
      </div>

      {/* Traffic Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trafficCards.map((card) => (
          <div key={card.label} className={`glass rounded-2xl p-5 border flex items-center justify-between ${card.color}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">{card.label}</p>
              <p className="text-2xl font-bold font-heading text-text-primary mt-1.5">
                {loading ? <span className="inline-block w-8 h-5 bg-border/30 rounded animate-pulse" /> : card.value}
              </p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Grid of Main Sections and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Stat Cards list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">CMS Collections</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className="glass rounded-2xl p-5 border border-border/30 hover:border-accent-primary/30 hover:-translate-y-1 transition-all group"
                >
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <p className="text-2xl font-bold font-heading text-text-primary">
                    {loading ? <span className="inline-block w-6 h-4 bg-border/30 rounded animate-pulse" /> : card.value}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 uppercase tracking-widest">{card.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Traffic Activity Chart */}
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">7-Day Traffic Activity</h2>
            {loading ? (
              <div className="h-48 bg-border/20 rounded-xl animate-pulse" />
            ) : dailyTraffic.length === 0 ? (
              <div className="h-48 border border-dashed border-border/30 rounded-xl flex items-center justify-center text-text-secondary text-sm">
                No traffic recorded yet. Visits will plot here automatically.
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2 pt-8 h-40">
                {dailyTraffic.map((t) => {
                  const pct = Math.max(8, (t.count / maxTraffic) * 100);
                  const formattedDay = new Date(t.day).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
                  return (
                    <div key={t.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full relative flex flex-col justify-end h-32">
                        {/* Hover Tooltip */}
                        <span className="absolute left-1/2 -translate-x-1/2 -top-7 z-10 px-2 py-0.5 rounded bg-bg-secondary border border-border/30 text-[10px] text-text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          {t.count} views
                        </span>
                        {/* CSS Bar */}
                        <div
                          style={{ height: `${pct}%` }}
                          className="w-full bg-gradient-to-t from-accent-primary/20 via-accent-primary/60 to-accent-primary rounded-t-lg transition-all group-hover:brightness-110"
                        />
                      </div>
                      <span className="text-[10px] text-text-secondary font-mono tracking-tighter truncate max-w-full">
                        {formattedDay}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recent Contacts */}
        <div className="glass rounded-2xl border border-border/30 overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-bg-secondary/20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Recent Contacts</h2>
            <Link href="/admin/contacts" className="text-xs text-accent-primary hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-border/20 flex-1 overflow-y-auto max-h-[360px]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-border/30 rounded w-1/3" />
                    <div className="h-3 bg-border/20 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : recentContacts.length === 0 ? (
              <p className="px-6 py-8 text-center text-text-secondary text-sm">No contact submissions yet.</p>
            ) : (
              recentContacts.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-start gap-3 hover:bg-bg-primary/25 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary text-xs font-bold flex-shrink-0">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-text-primary truncate">{c.name}</span>
                      {!c.is_processed && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-1.5 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5">{c.email}</p>
                    <p className="text-xs text-text-secondary truncate mt-1">{c.subject}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Project", href: "/admin/projects?action=new", icon: "➕" },
            { label: "Write Blog Post", href: "/admin/blog?action=new", icon: "✏️" },
            { label: "Add Service", href: "/admin/services?action=new", icon: "💼" },
            { label: "Edit Resume", href: "/admin/resume", icon: "📄" },
            { label: "Upload Asset", href: "/admin/media", icon: "🖼️" },
            { label: "Train Chatbot", href: "/admin/knowledge?action=new", icon: "🤖" },
            { label: "View Analytics", href: "/admin/analytics", icon: "📈" },
            { label: "Manage Users", href: "/admin/users", icon: "👥" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2.5 glass border border-border/30 hover:border-accent-primary/40 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-all"
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
