"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  image: string;
  live_link: string;
  github_link: string;
  created_at: string;
  show_on_homepage?: boolean;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  tags: "",
  gradient: "from-emerald-950 via-teal-900 to-emerald-900",
  image: "",
  live_link: "",
  github_link: "",
  show_on_homepage: true,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (_) {
      showToast("Failed to load projects", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      tags: p.tags?.join(", ") || "",
      gradient: p.gradient,
      image: p.image,
      live_link: p.live_link,
      github_link: p.github_link,
      show_on_homepage: p.show_on_homepage !== false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showToast("Title and description are required", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Project updated!" : "Project created!");
      setShowForm(false);
      fetchProjects();
    } catch (_) {
      showToast("Failed to save project", "error");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.item?.url) throw new Error();
      setForm((prev) => ({ ...prev, image: data.item.url }));
      showToast("Image uploaded and path added");
    } catch (_) {
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Project deleted");
      fetchProjects();
    } catch (_) {
      showToast("Failed to delete project", "error");
    }
    setDeleting(null);
  };

  const inputCls = "w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 transition-all";

  return (
    <div className="space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Projects CMS</h1>
          <p className="text-text-secondary text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all"
        >
          + Add Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-bg-secondary border border-border/30 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-text-primary">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Title *", key: "title", placeholder: "TIKTOK DOWNLOADER - FLAGSHIP SAAS" },
                { label: "Description *", key: "description", placeholder: "Project description...", area: true },
                { label: "Tags (comma-separated)", key: "tags", placeholder: "Next.js, Node.js, API Integration" },
                { label: "Gradient Classes", key: "gradient", placeholder: "from-emerald-950 via-teal-900 to-emerald-900" },
                { label: "Live Link", key: "live_link", placeholder: "https://example.com" },
                { label: "GitHub Link", key: "github_link", placeholder: "https://github.com/..." },
              ].map(({ label, key, placeholder, area }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">{label}</label>
                  {area ? (
                    <textarea
                      rows={4}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={`${inputCls} resize-none`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Image Path</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/uploads/project-image.png"
                    className={inputCls}
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-3 text-sm font-bold bg-accent-primary text-bg-primary rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 whitespace-nowrap"
                  >
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
                {form.image && (
                  <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-bg-primary/40 p-3">
                    <img src={form.image} alt="Project preview" className="h-14 w-20 rounded-lg object-cover border border-border/30" />
                    <code className="text-xs text-text-secondary break-all">{form.image}</code>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-bg-primary/50 border border-border/20 rounded-xl">
                <input
                  type="checkbox"
                  id="show_on_homepage"
                  checked={form.show_on_homepage}
                  onChange={(e) => setForm({ ...form, show_on_homepage: e.target.checked })}
                  className="w-4 h-4 accent-accent-primary rounded cursor-pointer"
                />
                <label htmlFor="show_on_homepage" className="text-xs font-bold text-text-primary uppercase tracking-widest cursor-pointer">
                  Show on Homepage
                </label>
              </div>

            </div>
            <div className="p-6 border-t border-border/30 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-text-secondary border border-border/30 rounded-xl hover:text-text-primary transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-gradient-primary text-bg-primary rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-text-secondary text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-4">Project</th>
                <th className="text-left px-4 py-4 hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-4 hidden lg:table-cell">Links</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-3 bg-border/30 rounded w-48" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-3 bg-border/20 rounded w-32" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-3 bg-border/20 rounded w-24" /></td>
                    <td className="px-6 py-4" />
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-secondary">No projects yet. Add your first one!</td></tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-primary/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary truncate max-w-xs">{p.title}</p>
                      <p className="text-xs text-text-secondary truncate max-w-xs mt-0.5">{p.description}</p>
                      {p.image && <p className="text-[10px] text-text-secondary/60 truncate max-w-xs mt-1 font-mono">Image: {p.image}</p>}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(p.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="text-xs bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                        {(p.tags || []).length > 3 && (
                          <span className="text-xs text-text-secondary">+{p.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex gap-2">
                        {p.live_link && <a href={p.live_link} target="_blank" rel="noreferrer" className="text-xs text-accent-primary hover:underline">Live ↗</a>}
                        {p.github_link && <a href={p.github_link} target="_blank" rel="noreferrer" className="text-xs text-text-secondary hover:underline">GitHub ↗</a>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 border border-border/30 hover:border-accent-primary/40 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-xs px-3 py-1.5 border border-red-500/20 hover:border-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                        >
                          {deleting === p.id ? "..." : "Delete"}
                        </button>
                      </div>
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
