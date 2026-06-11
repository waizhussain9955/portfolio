"use client";

import React, { useState, useEffect } from "react";

interface Milestone {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
  date?: string;
}

interface ProjectFile {
  id: number;
  name: string;
  url: string;
}

interface ClientProject {
  id: number;
  title: string;
  status: string;
  contract_status: string;
  milestones: Milestone[];
  files: ProjectFile[];
}

export default function ClientPortalDashboard() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const res = await fetch("/api/portal/projects");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (_) {
        showToast("Failed to sync workspace details");
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-accent-primary bg-accent-primary/10 border-accent-primary/20";
      case "in progress":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-text-secondary bg-border/20 border-border/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium bg-accent-primary/10 border border-accent-primary/30 text-accent-primary animate-slideUp">
          {toast}
        </div>
      )}

      {/* Greeting card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/30 p-8 md:p-10 bg-gradient-to-r from-bg-secondary via-bg-secondary to-accent-primary/5">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight">
            Client Workspace
          </h1>
          <p className="text-text-secondary text-sm max-w-xl">
            Track active contract milestones, review architecture blueprints, and access shared project documents.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12 animate-pulse" />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-48 bg-border/20 rounded-2xl animate-pulse" />
          <div className="h-48 bg-border/20 rounded-2xl animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl border border-border/30 p-12 text-center text-text-secondary space-y-2">
          <p className="text-sm font-semibold">No active workspaces linked to your account.</p>
          <p className="text-xs text-text-secondary/60">Please contact Waiz Hussain to sync your contract details.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((proj) => (
            <div key={proj.id} className="glass rounded-3xl border border-border/30 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/20 shadow-xl">
              
              {/* Left Column: Project Meta */}
              <div className="p-6 md:p-8 md:w-1/3 space-y-6 flex flex-col justify-between bg-bg-secondary/40">
                <div className="space-y-3">
                  <span className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-border/20 border border-border/30 rounded-full text-text-secondary">
                    Project File
                  </span>
                  <h2 className="text-xl font-heading font-extrabold text-text-primary leading-tight">
                    {proj.title}
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Current stage: <span className="font-semibold text-text-primary">{proj.status}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs p-3 bg-bg-primary/50 border border-border/20 rounded-2xl">
                    <span className="text-text-secondary">Contract Status</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      proj.contract_status?.toLowerCase() === "signed" 
                        ? "text-accent-primary border-accent-primary/20 bg-accent-primary/10"
                        : "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                    }`}>
                      {proj.contract_status || "Pending"}
                    </span>
                  </div>

                  {/* Document downloads */}
                  {proj.files && proj.files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Shared Documents</p>
                      <div className="space-y-1.5">
                        {proj.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 bg-bg-primary/30 border border-border/20 hover:border-accent-primary/35 rounded-xl text-xs text-text-primary transition-all group"
                          >
                            <span className="truncate pr-4">{file.name}</span>
                            <span className="text-accent-primary group-hover:translate-x-0.5 transition-transform">Download ↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Milestones Progress */}
              <div className="p-6 md:p-8 flex-1 space-y-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Project Milestones</h3>
                
                {/* Milestone Timeline */}
                <div className="relative border-l border-border/30 ml-3 space-y-6 py-2">
                  {proj.milestones.map((m, idx) => {
                    const isCompleted = m.status === "Completed";
                    const isInProgress = m.status === "In Progress";
                    return (
                      <div key={m.id} className="relative pl-6">
                        
                        {/* Dot indicator */}
                        <span className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all ${
                          isCompleted
                            ? "bg-accent-primary border-accent-primary text-bg-primary"
                            : isInProgress
                            ? "bg-yellow-400 border-yellow-400 text-bg-primary animate-pulse"
                            : "bg-bg-primary border-border/40 text-text-secondary"
                        }`}>
                          {isCompleted ? "✓" : idx + 1}
                        </span>

                        {/* Card details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-bg-secondary/40 border border-border/25 rounded-2xl">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{m.title}</p>
                            {m.date && <p className="text-[10px] text-text-secondary mt-0.5">{m.date}</p>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border self-start sm:self-center ${getStatusColor(m.status)}`}>
                            {m.status}
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
