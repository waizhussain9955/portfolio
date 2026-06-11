"use client";

import React, { useEffect, useState, useCallback } from "react";

interface ResumeData {
  name: string;
  title: string;
  about: string;
  contact: {
    email: string;
    phone: string;
    WhatsApp: string;
    github: string;
    linkedin: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    "live project"?: string;
    duration: string;
    details: string[];
  }>;
  education: string[];
  current_focus: string[];
  strengths: string[];
  final_statement: string;
}

type ResumeTab = "overview" | "skills" | "experience" | "education";

export default function AdminResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<ResumeTab>("overview");
  const [newSkill, setNewSkill] = useState("");
  const [newFocus, setNewFocus] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newEducation, setNewEducation] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("/api/admin/resume");
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchResume();
  }, []);

  const handleSave = useCallback(async () => {
    if (!resume) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (_) {}
    setSaving(false);
  }, [resume]);

  const updateField = (field: keyof ResumeData, value: any) => {
    setResume((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateContact = (field: keyof ResumeData["contact"], value: string) => {
    setResume((prev) =>
      prev ? { ...prev, contact: { ...prev.contact, [field]: value } } : prev
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-border/20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="glass rounded-2xl border border-border/30 p-12 text-center">
        <p className="text-text-secondary">Failed to load resume data.</p>
      </div>
    );
  }

  const tabs: { id: ResumeTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "skills", label: "Skills & Focus", icon: "🛠️" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Resume CMS</h1>
          <p className="text-text-secondary text-sm mt-1">
            Edit your live resume content — changes reflect on the chatbot and portfolio instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-accent-primary text-bg-primary hover:bg-accent-primary/90 hover:shadow-[0_0_20px_var(--color-glow)]"
          }`}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>✓ Saved!</>
          ) : (
            <>💾 Save Changes</>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 border border-border/30 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-accent-primary text-bg-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
              Personal Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  value={resume.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                  Professional Title
                </label>
                <input
                  value={resume.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                About / Bio
              </label>
              <textarea
                value={resume.about}
                onChange={(e) => updateField("about", e.target.value)}
                rows={4}
                className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                Final Statement
              </label>
              <textarea
                value={resume.final_statement}
                onChange={(e) => updateField("final_statement", e.target.value)}
                rows={2}
                className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
              Contact Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(resume.contact) as Array<keyof ResumeData["contact"]>).map((key) => (
                <div key={key}>
                  <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                    {key}
                  </label>
                  <input
                    value={resume.contact[key]}
                    onChange={(e) => updateContact(key, e.target.value)}
                    className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Skills Tab ── */}
      {activeTab === "skills" && (
        <div className="space-y-4">
          {/* Skills */}
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
              Technical Skills ({resume.skills.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-sm text-accent-primary"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() =>
                      updateField(
                        "skills",
                        resume.skills.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-accent-primary/60 hover:text-red-400 transition-colors text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSkill.trim()) {
                    updateField("skills", [...resume.skills, newSkill.trim()]);
                    setNewSkill("");
                  }
                }}
                placeholder="Add skill (press Enter)"
                className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
              />
              <button
                onClick={() => {
                  if (newSkill.trim()) {
                    updateField("skills", [...resume.skills, newSkill.trim()]);
                    setNewSkill("");
                  }
                }}
                className="px-4 py-2.5 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Current Focus */}
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
              Current Focus
            </h2>
            <div className="space-y-2">
              {resume.current_focus.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent-primary text-sm">→</span>
                  <span className="flex-1 text-sm text-text-primary">{item}</span>
                  <button
                    onClick={() =>
                      updateField(
                        "current_focus",
                        resume.current_focus.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-text-secondary hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newFocus}
                onChange={(e) => setNewFocus(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newFocus.trim()) {
                    updateField("current_focus", [...resume.current_focus, newFocus.trim()]);
                    setNewFocus("");
                  }
                }}
                placeholder="Add current focus area"
                className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newFocus.trim()) {
                    updateField("current_focus", [...resume.current_focus, newFocus.trim()]);
                    setNewFocus("");
                  }
                }}
                className="px-4 py-2.5 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Strengths */}
          <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
              Core Strengths
            </h2>
            <div className="space-y-2">
              {resume.strengths.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent-primary text-sm">⚡</span>
                  <span className="flex-1 text-sm text-text-primary">{item}</span>
                  <button
                    onClick={() =>
                      updateField(
                        "strengths",
                        resume.strengths.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-text-secondary hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newStrength.trim()) {
                    updateField("strengths", [...resume.strengths, newStrength.trim()]);
                    setNewStrength("");
                  }
                }}
                placeholder="Add strength"
                className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newStrength.trim()) {
                    updateField("strengths", [...resume.strengths, newStrength.trim()]);
                    setNewStrength("");
                  }
                }}
                className="px-4 py-2.5 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Experience Tab ── */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="glass rounded-2xl border border-border/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-primary">
                  {exp.role} — {exp.company}
                </h3>
                <span className="text-xs font-mono text-text-secondary bg-bg-primary px-3 py-1 rounded-full border border-border/30">
                  {exp.duration}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                    Role
                  </label>
                  <input
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], role: e.target.value };
                      updateField("experience", updated);
                    }}
                    className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                    Company
                  </label>
                  <input
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], company: e.target.value };
                      updateField("experience", updated);
                    }}
                    className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                    Duration
                  </label>
                  <input
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], duration: e.target.value };
                      updateField("experience", updated);
                    }}
                    className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                    Live Project URL
                  </label>
                  <input
                    value={exp["live project"] || ""}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], "live project": e.target.value };
                      updateField("experience", updated);
                    }}
                    className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary font-semibold mb-2 uppercase tracking-wider">
                  Details / Responsibilities
                </label>
                {exp.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex gap-2 mb-2">
                    <input
                      value={detail}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        const updatedDetails = [...updated[idx].details];
                        updatedDetails[dIdx] = e.target.value;
                        updated[idx] = { ...updated[idx], details: updatedDetails };
                        updateField("experience", updated);
                      }}
                      className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const updated = [...resume.experience];
                        updated[idx] = {
                          ...updated[idx],
                          details: updated[idx].details.filter((_, i) => i !== dIdx),
                        };
                        updateField("experience", updated);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-3 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updated = [...resume.experience];
                    updated[idx] = {
                      ...updated[idx],
                      details: [...updated[idx].details, ""],
                    };
                    updateField("experience", updated);
                  }}
                  className="text-xs text-accent-primary hover:underline mt-1"
                >
                  + Add detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Education Tab ── */}
      {activeTab === "education" && (
        <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
            Education ({resume.education.length})
          </h2>
          <div className="space-y-2">
            {resume.education.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const updated = [...resume.education];
                    updated[idx] = e.target.value;
                    updateField("education", updated);
                  }}
                  className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
                />
                <button
                  onClick={() =>
                    updateField(
                      "education",
                      resume.education.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-red-400 hover:text-red-300 text-xs px-3 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newEducation}
              onChange={(e) => setNewEducation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newEducation.trim()) {
                  updateField("education", [...resume.education, newEducation.trim()]);
                  setNewEducation("");
                }
              }}
              placeholder="Add education entry"
              className="flex-1 bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            />
            <button
              onClick={() => {
                if (newEducation.trim()) {
                  updateField("education", [...resume.education, newEducation.trim()]);
                  setNewEducation("");
                }
              }}
              className="px-4 py-2.5 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold"
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
