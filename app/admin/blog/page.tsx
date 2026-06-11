"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Post {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  banner_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  show_on_homepage?: boolean;
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  tags: "",
  banner_image: "",
  is_published: false,
  show_on_homepage: true,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [fetchingSingle, setFetchingSingle] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (_) {
      showToast("Failed to load posts", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    setForm((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug if not currently editing an existing post or if slug was empty
      slug: editingId ? prev.slug : slug,
    }));
  };

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPreviewMode(false);
    setShowForm(true);
  };

  const openEdit = async (post: Post) => {
    setEditingId(post.id);
    setFetchingSingle(true);
    setPreviewMode(false);
    setShowForm(true);

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const p = data.post;
      setForm({
        title: p.title || "",
        slug: p.slug || "",
        summary: p.summary || "",
        content: p.content || "",
        tags: p.tags?.join(", ") || "",
        banner_image: p.banner_image || "",
        is_published: !!p.is_published,
        show_on_homepage: p.show_on_homepage !== false,
      });
    } catch (_) {
      showToast("Failed to load blog post content", "error");
      setShowForm(false);
    } finally {
      setFetchingSingle(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      showToast("Title, slug, and content are required", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        showToast("Slug already exists", "error");
        setSaving(false);
        return;
      }
      if (!res.ok) throw new Error();
      showToast(editingId ? "Post updated!" : "Post created!");
      setShowForm(false);
      fetchPosts();
    } catch (_) {
      showToast("Failed to save post", "error");
    }
    setSaving(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.item?.url) throw new Error();
      setForm((prev) => ({ ...prev, banner_image: data.item.url }));
      showToast("Banner uploaded and path added");
    } catch (_) {
      showToast("Failed to upload banner", "error");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Post deleted");
      fetchPosts();
    } catch (_) {
      showToast("Failed to delete post", "error");
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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Blog CMS</h1>
          <p className="text-text-secondary text-sm mt-1">{posts.length} total posts</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all"
        >
          + Create Post
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setShowForm(false)} />
          <div className="relative w-full max-w-4xl bg-bg-secondary border border-border/30 rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-text-primary">
                {editingId ? "Edit Blog Post" : "New Blog Post"}
              </h2>
              <button 
                onClick={() => !saving && setShowForm(false)} 
                className="text-text-secondary hover:text-text-primary"
                disabled={saving}
              >
                ✕
              </button>
            </div>

            {fetchingSingle ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
                <p className="text-text-secondary text-sm">Fetching post content...</p>
              </div>
            ) : (
              <>
                {/* Modal Body */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                  
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="My Awesome Engineering Article"
                        className={inputCls}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Slug (URL Path) *</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="my-awesome-engineering-article"
                        className={inputCls}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        placeholder="DevOps, AWS, Terraform"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Banner Image Path</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.banner_image}
                          onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                          placeholder="/uploads/my-banner.jpg"
                          className={inputCls}
                        />
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={uploadingBanner}
                          className="px-4 py-3 text-sm font-bold bg-accent-primary text-bg-primary rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 whitespace-nowrap"
                        >
                          {uploadingBanner ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {form.banner_image && (
                    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-bg-primary/40 p-3">
                      <img src={form.banner_image} alt="Banner preview" className="h-16 w-28 rounded-lg object-cover border border-border/30" />
                      <code className="text-xs text-text-secondary break-all">{form.banner_image}</code>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Summary / Excerpt *</label>
                    <textarea
                      rows={2}
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      placeholder="A short snippet shown on listing grids..."
                      className={`${inputCls} resize-none`}
                      required
                    />
                  </div>

                  {/* Content Editor with Preview Mode */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-border/20 pb-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Article Body (Markdown Supported) *</label>
                      <div className="flex bg-bg-primary border border-border/30 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => setPreviewMode(false)}
                          className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                            !previewMode ? "bg-accent-primary text-bg-primary" : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(true)}
                          className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                            previewMode ? "bg-accent-primary text-bg-primary" : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    {previewMode ? (
                      <div className="w-full min-h-[300px] max-h-[400px] bg-bg-primary border border-border/30 rounded-xl p-4 overflow-y-auto prose prose-invert text-sm text-text-primary">
                        {form.content ? (
                          <div className="space-y-4">
                            {form.content.split("\n\n").map((para, i) => {
                              if (para.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold font-heading">{para.replace("# ", "")}</h1>;
                              if (para.startsWith("## ")) return <h2 key={i} className="text-xl font-bold font-heading mt-4">{para.replace("## ", "")}</h2>;
                              if (para.startsWith("### ")) return <h3 key={i} className="text-lg font-bold font-heading mt-3">{para.replace("### ", "")}</h3>;
                              if (para.startsWith("- ") || para.startsWith("* ")) {
                                return (
                                  <ul key={i} className="list-disc list-inside pl-4 space-y-1">
                                    {para.split("\n").map((li, j) => <li key={j}>{li.replace(/^[-*]\s+/, "")}</li>)}
                                  </ul>
                                );
                              }
                              if (para.startsWith("```")) {
                                return (
                                  <pre key={i} className="bg-bg-secondary p-3 rounded-lg border border-border/20 font-mono text-xs overflow-x-auto my-2">
                                    <code>{para.replace(/```[a-zA-Z]*\n?|```/g, "")}</code>
                                  </pre>
                                );
                              }
                              return <p key={i} className="leading-relaxed whitespace-pre-wrap">{para}</p>;
                            })}
                          </div>
                        ) : (
                          <span className="text-text-secondary italic">Nothing to preview. Start writing below!</span>
                        )}
                      </div>
                    ) : (
                      <textarea
                        rows={12}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="# Introducing My Project&#10;&#10;Here is the introduction...&#10;&#10;## Technical Stack&#10;- Next.js&#10;- Neon PostgreSQL"
                        className={`${inputCls} font-mono text-xs leading-relaxed`}
                        required
                      />
                    )}
                  </div>

                  {/* Toggle switches */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-bg-primary/50 border border-border/20 rounded-xl">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={form.is_published}
                        onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                        className="w-4 h-4 accent-accent-primary rounded cursor-pointer"
                      />
                      <label htmlFor="is_published" className="text-xs font-bold text-text-primary uppercase tracking-widest cursor-pointer">
                        Publish Immediately
                      </label>
                    </div>

                    <div className="flex-1 flex items-center gap-3 p-3 bg-bg-primary/50 border border-border/20 rounded-xl">
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

                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-border/30 flex justify-end gap-3 bg-bg-secondary">
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="px-5 py-2.5 text-sm text-text-secondary border border-border/30 rounded-xl hover:text-text-primary transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 text-sm font-bold bg-gradient-primary text-bg-primary rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Blog Listing Table */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-text-secondary text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-4">Title / Excerpt</th>
                <th className="text-left px-4 py-4 hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-4 hidden sm:table-cell">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-3 bg-border/30 rounded w-64" /><div className="h-2.5 bg-border/20 rounded w-48 mt-2" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-3 bg-border/20 rounded w-24" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-3 bg-border/20 rounded w-16" /></td>
                    <td className="px-6 py-4" />
                  </tr>
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-secondary">
                    No articles found. Add your first engineering writeup!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-bg-primary/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary truncate max-w-sm">{post.title}</p>
                      <p className="text-xs text-text-secondary truncate max-w-sm mt-1">{post.summary}</p>
                      <p className="text-[10px] text-text-secondary/50 mt-1 font-mono">
                        Slug: {post.slug} | Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      {post.banner_image && (
                        <p className="text-[10px] text-text-secondary/50 mt-1 font-mono truncate max-w-sm">
                          Image: {post.banner_image}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(post.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(post.tags || []).length > 3 && (
                          <span className="text-[10px] text-text-secondary">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {post.is_published ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-secondary bg-border/20 border border-border/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(post)} 
                          className="text-xs px-3 py-1.5 border border-border/30 hover:border-accent-primary/40 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="text-xs px-3 py-1.5 border border-red-500/20 hover:border-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                        >
                          {deleting === post.id ? "..." : "Delete"}
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
