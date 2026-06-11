"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Setting {
  id: number;
  config_key: string;
  config_val: any;
  updated_at: string;
}

const DEFAULT_CHATBOT_CONFIG = {
  system_prompt: `⚠️ GOLDEN RULE: ONLY speak about projects explicitly listed in the "Relevant Projects Data" section below. 
- If a project is not in that list, IT DOES NOT EXIST.
- NEVER invent, hallucinate, or assume he has other projects.
- Speak in the third person.
- Keep answers SHORT and snappy.
- Use [PROJECT_CARD: Title | Description | ImagePath | LiveLink | GithubLink] for any project mentioned.
- Use [RESUME_BUTTON] if asked for a resume.`,
  temperature: 0.7,
  min_relevance_score: 0.1,
  offline_fallback_message: "I'm sorry, I'm currently in 'offline mode' because my AI brain (Cerebras API Key) hasn't been connected yet. Please add the CEREBRAS_API_KEY to the .env.local file to enable my full capabilities!",
};

const DEFAULT_SITE_INFO = {
  hero_title: "Waiz Hussain",
  hero_subtitle: "Full Stack Developer & AI Builder",
  about_bio: "Building real-world applications across web, mobile, and AI domains using Next.js, Flutter & Node.js. Specialized in Autonomous Systems, SaaS products, and AI-powered workflows.",
  resume_url: "/resume/Waiz_Resume_Full_Stack_Dev.pdf",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // States for the two configuration buckets
  const [chatbotConfig, setChatbotConfig] = useState(DEFAULT_CHATBOT_CONFIG);
  const [siteInfo, setSiteInfo] = useState(DEFAULT_SITE_INFO);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      const settingsList: Setting[] = data.settings || [];

      // Find and set chatbot config
      const chatRow = settingsList.find((s) => s.config_key === "chatbot_config");
      if (chatRow) {
        setChatbotConfig({
          ...DEFAULT_CHATBOT_CONFIG,
          ...chatRow.config_val,
        });
      }

      // Find and set site info
      const siteRow = settingsList.find((s) => s.config_key === "site_info");
      if (siteRow) {
        setSiteInfo({
          ...DEFAULT_SITE_INFO,
          ...siteRow.config_val,
        });
      }
    } catch (_) {
      showToast("Failed to load settings", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_key: key,
          config_val: value,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Settings updated successfully!");
    } catch (_) {
      showToast("Failed to save settings", "error");
    }
    setSaving(false);
  };

  const handleSaveChatbot = () => {
    saveSetting("chatbot_config", chatbotConfig);
  };

  const handleSaveSiteInfo = () => {
    saveSetting("site_info", siteInfo);
  };

  const inputCls = "w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-border/30 rounded w-1/4" />
          <div className="h-4 bg-border/20 rounded w-1/3" />
          <div className="h-32 bg-border/20 rounded-2xl" />
          <div className="h-32 bg-border/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border animate-slideUp ${
          toast.type === "success"
            ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Global Configuration</h1>
        <p className="text-text-secondary text-sm mt-1">Manage AI parameters and dynamic site text definitions</p>
      </div>

      {/* Chatbot Config panel */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border/20 pb-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Chatbot & RAG Settings</h2>
            <p className="text-xs text-text-secondary">Modify context system instruction rules, response weights, and fallback responses</p>
          </div>
          <button
            onClick={handleSaveChatbot}
            disabled={saving}
            className="px-4 py-2 bg-gradient-primary text-bg-primary font-bold text-xs rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Bot Config"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">System Instructions (System Prompt) *</label>
            <textarea
              rows={5}
              value={chatbotConfig.system_prompt}
              onChange={(e) => setChatbotConfig({ ...chatbotConfig, system_prompt: e.target.value })}
              placeholder="System prompt rules for LLM..."
              className={`${inputCls} font-mono text-xs`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center justify-between">
                <span>Model Temperature</span>
                <span className="font-mono text-accent-primary">{chatbotConfig.temperature}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.1"
                  value={chatbotConfig.temperature}
                  onChange={(e) => setChatbotConfig({ ...chatbotConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-border/50 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center justify-between">
                <span>Min RAG Relevance Threshold</span>
                <span className="font-mono text-accent-primary">{chatbotConfig.min_relevance_score}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.0"
                  max="0.9"
                  step="0.05"
                  value={chatbotConfig.min_relevance_score}
                  onChange={(e) => setChatbotConfig({ ...chatbotConfig, min_relevance_score: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-border/50 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Offline Fallback Response *</label>
            <textarea
              rows={3}
              value={chatbotConfig.offline_fallback_message}
              onChange={(e) => setChatbotConfig({ ...chatbotConfig, offline_fallback_message: e.target.value })}
              placeholder="Response displayed when Cerebras API is unavailable..."
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Site Info panel */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border/20 pb-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Landing Page Content</h2>
            <p className="text-xs text-text-secondary">Modify hero title, subtitles, and about biography tags</p>
          </div>
          <button
            onClick={handleSaveSiteInfo}
            disabled={saving}
            className="px-4 py-2 bg-gradient-primary text-bg-primary font-bold text-xs rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Site Info"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Hero Title *</label>
              <input
                type="text"
                value={siteInfo.hero_title}
                onChange={(e) => setSiteInfo({ ...siteInfo, hero_title: e.target.value })}
                placeholder="Waiz Hussain"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Hero Subtitle *</label>
              <input
                type="text"
                value={siteInfo.hero_subtitle}
                onChange={(e) => setSiteInfo({ ...siteInfo, hero_subtitle: e.target.value })}
                placeholder="Full Stack Developer & AI Builder"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">About Biography Summary *</label>
            <textarea
              rows={4}
              value={siteInfo.about_bio}
              onChange={(e) => setSiteInfo({ ...siteInfo, about_bio: e.target.value })}
              placeholder="About section biography copy..."
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Resume Download Link (PDF Path) *</label>
            <input
              type="text"
              value={siteInfo.resume_url}
              onChange={(e) => setSiteInfo({ ...siteInfo, resume_url: e.target.value })}
              placeholder="/resume/my-resume.pdf"
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
