"use client";

import React, { useEffect, useState, useCallback } from "react";

interface AnalyticsSummary {
  totalPageviews: number;
  uniqueSessions: number;
  chatQueries: number;
  topPages: { page_url: string; count: number }[];
  dailyTraffic: { day: string; count: number }[];
  eventBreakdown: { event_type: string; count: number }[];
  recentEvents: {
    id: number;
    event_type: string;
    page_url: string;
    session_id: string;
    created_at: string;
  }[];
}

type Period = "7d" | "30d" | "90d";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

const EVENT_COLORS: Record<string, string> = {
  pageview: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  chat_query: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  contact_form: "text-green-400 bg-green-400/10 border-green-400/20",
  click: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("7d");
  const [clearing, setClearing] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (_) {}
    setLoading(false);
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClearOld = async () => {
    setClearing(true);
    try {
      await fetch("/api/admin/analytics?older_than=90d", { method: "DELETE" });
      setClearConfirm(false);
      fetchData();
    } catch (_) {}
    setClearing(false);
  };

  // Compute bar chart max
  const maxTraffic =
    data && data.dailyTraffic.length > 0
      ? Math.max(...data.dailyTraffic.map((d) => d.count), 1)
      : 1;

  const maxPage =
    data && data.topPages.length > 0
      ? Math.max(...data.topPages.map((p) => p.count), 1)
      : 1;

  const statCards = [
    {
      label: "Total Page Views",
      value: data?.totalPageviews ?? 0,
      icon: "👁️",
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
      label: "Unique Sessions",
      value: data?.uniqueSessions ?? 0,
      icon: "👥",
      color: "text-accent-primary",
      bg: "bg-accent-primary/10 border-accent-primary/20",
    },
    {
      label: "Chat Queries",
      value: data?.chatQueries ?? 0,
      icon: "💬",
      color: "text-purple-400",
      bg: "bg-purple-400/10 border-purple-400/20",
    },
    {
      label: "Avg Views/Session",
      value:
        data && data.uniqueSessions > 0
          ? (data.totalPageviews / data.uniqueSessions).toFixed(1)
          : "0",
      icon: "📈",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Analytics</h1>
          <p className="text-text-secondary text-sm mt-1">
            Live visitor insights, page views, and chatbot engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex gap-1 glass rounded-xl p-1 border border-border/30">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === p
                    ? "bg-accent-primary text-bg-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 glass border border-border/30 rounded-xl text-text-secondary hover:text-accent-primary transition-colors"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`glass rounded-2xl p-5 border flex items-center justify-between ${card.bg}`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary opacity-80">
                {card.label}
              </p>
              <p className={`text-2xl font-bold font-heading mt-1.5 ${card.color}`}>
                {loading ? (
                  <span className="inline-block w-12 h-6 bg-border/30 rounded animate-pulse" />
                ) : (
                  card.value.toLocaleString()
                )}
              </p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Traffic Bar Chart */}
        <div className="lg:col-span-2 glass rounded-2xl border border-border/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">
              Daily Page Views — {PERIOD_LABELS[period]}
            </h2>
          </div>
          {loading ? (
            <div className="h-48 bg-border/20 rounded-xl animate-pulse" />
          ) : !data || data.dailyTraffic.length === 0 ? (
            <div className="h-48 border border-dashed border-border/30 rounded-xl flex items-center justify-center text-text-secondary text-sm">
              No traffic recorded yet. Visits will plot here automatically.
            </div>
          ) : (
            <div className="flex items-end justify-between gap-1.5 pt-4 h-48 overflow-x-auto">
              {data.dailyTraffic.map((t) => {
                const pct = Math.max(6, (t.count / maxTraffic) * 100);
                const label = new Date(t.day).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={t.day}
                    className="flex-1 min-w-[28px] flex flex-col items-center gap-1.5 group cursor-default"
                  >
                    <div className="w-full relative flex flex-col justify-end h-36">
                      {/* Tooltip */}
                      <span className="absolute left-1/2 -translate-x-1/2 -top-7 z-10 px-2 py-0.5 rounded bg-bg-secondary border border-border/30 text-[10px] text-text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                        {t.count} views
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-gradient-to-t from-accent-primary/20 via-accent-primary/60 to-accent-primary rounded-t-lg transition-all group-hover:brightness-125"
                      />
                    </div>
                    <span className="text-[9px] text-text-secondary font-mono tracking-tighter truncate max-w-full">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Event Breakdown Donut-style */}
        <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">
            Event Breakdown
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-border/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !data || data.eventBreakdown.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-8">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {data.eventBreakdown.map((ev) => {
                const total = data.eventBreakdown.reduce((s, e) => s + e.count, 0);
                const pct = total > 0 ? Math.round((ev.count / total) * 100) : 0;
                const colorClass =
                  EVENT_COLORS[ev.event_type] || "text-text-secondary bg-border/10 border-border/20";
                return (
                  <div key={ev.event_type}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${colorClass}`}
                      >
                        {ev.event_type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-text-secondary font-mono">
                        {ev.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border/20 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-accent-primary rounded-full transition-all duration-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Pages */}
      <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">
          Top Pages
        </h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-border/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !data || data.topPages.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-6">No page data yet.</p>
        ) : (
          <div className="space-y-2">
            {data.topPages.map((page, idx) => {
              const pct = Math.max(4, (page.count / maxPage) * 100);
              return (
                <div key={page.page_url} className="flex items-center gap-4 group">
                  <span className="text-xs font-bold text-text-secondary w-5 text-right flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-primary font-mono truncate">
                        {page.page_url || "/"}
                      </span>
                      <span className="text-xs text-text-secondary font-bold ml-3 flex-shrink-0">
                        {page.count} views
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border/20 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-accent-primary/60 to-accent-primary rounded-full transition-all duration-700 group-hover:brightness-125"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Events Table */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-bg-secondary/20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">
            Recent Events
          </h2>
          {clearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">Delete events older than 90 days?</span>
              <button
                onClick={handleClearOld}
                disabled={clearing}
                className="text-xs text-red-400 px-3 py-1.5 rounded-lg border border-red-400/30 hover:bg-red-400/10 transition-colors"
              >
                {clearing ? "Clearing..." : "Confirm"}
              </button>
              <button
                onClick={() => setClearConfirm(false)}
                className="text-xs text-text-secondary px-3 py-1.5 rounded-lg border border-border/30 hover:bg-bg-primary/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setClearConfirm(true)}
              className="text-xs text-text-secondary hover:text-red-400 transition-colors"
            >
              🗑️ Clear Old Data
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20 bg-bg-secondary/10">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Event
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Page
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Session
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-3">
                        <div className="h-3 bg-border/20 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data || data.recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-secondary text-sm">
                    No events recorded yet.
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-bg-primary/20 transition-colors">
                    <td className="px-6 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          EVENT_COLORS[ev.event_type] ||
                          "text-text-secondary bg-border/10 border-border/20"
                        }`}
                      >
                        {ev.event_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-text-primary font-mono truncate max-w-[200px]">
                      {ev.page_url || "/"}
                    </td>
                    <td className="px-6 py-3 text-xs text-text-secondary font-mono truncate max-w-[120px]">
                      {ev.session_id?.slice(0, 16)}…
                    </td>
                    <td className="px-6 py-3 text-xs text-text-secondary whitespace-nowrap">
                      {new Date(ev.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
