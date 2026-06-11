"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  price_range: string;
  delivery_time: string;
  features: string[];
  is_active: boolean;
  image_url?: string | null;
  show_on_homepage?: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  price_range: "",
  delivery_time: "",
  features: "",
  is_active: true,
  image_url: "",
  show_on_homepage: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (_) {
      showToast("Failed to load services", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      price_range: s.price_range,
      delivery_time: s.delivery_time,
      features: s.features?.join(", ") || "",
      is_active: !!s.is_active,
      image_url: s.image_url || "",
      show_on_homepage: s.show_on_homepage !== false,
    });
    setShowForm(true);
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
      setForm((prev) => ({ ...prev, image_url: data.item.url }));
      showToast("Image uploaded and path added");
    } catch (_) {
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.price_range.trim()) {
      showToast("Title, description, and price range are required", "error");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editingId ? "Service tier updated!" : "Service tier created!");
      setShowForm(false);
      fetchServices();
    } catch (_) {
      showToast("Failed to save service tier", "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service tier? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Service tier deleted");
      fetchServices();
    } catch (_) {
      showToast("Failed to delete service tier", "error");
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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Services & Pricing CMS</h1>
          <p className="text-text-secondary text-sm mt-1">{services.length} total tiers</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all"
        >
          + Create Tier
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-bg-secondary border border-border/30 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-text-primary">
                {editingId ? "Edit Pricing Tier" : "New Pricing Tier"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <div className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Full-Stack Web App Development"
                    className={inputCls}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Price Range *</label>
                  <input
                    type="text"
                    value={form.price_range}
                    onChange={(e) => setForm({ ...form, price_range: e.target.value })}
                    placeholder="$3,000 - $6,000"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Delivery Time</label>
                  <input
                    type="text"
                    value={form.delivery_time}
                    onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                    placeholder="4-6 weeks"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder="SEO friendly, responsive UI, 3-month support"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Description *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what's included in this tier..."
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Service Image</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="/uploads/service-image.png"
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
                {form.image_url && (
                  <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-bg-primary/40 p-3">
                    <img src={form.image_url} alt="Service preview" className="h-14 w-20 rounded-lg object-cover border border-border/30" />
                    <code className="text-xs text-text-secondary break-all">{form.image_url}</code>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-bg-primary/50 border border-border/20 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-xs font-bold text-text-primary uppercase tracking-widest cursor-pointer">
                    Activate Tier
                  </label>
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

      {/* Services Table */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-text-secondary text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-4">Service Tier</th>
                <th className="text-left px-4 py-4 hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-4 hidden lg:table-cell">Timeframe</th>
                <th className="text-left px-4 py-4 hidden sm:table-cell">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-3 bg-border/30 rounded w-48" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-3 bg-border/20 rounded w-24" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-3 bg-border/20 rounded w-20" /></td>
                    <td className="px-4 py-4 hidden sm:table-cell"><div className="h-3 bg-border/20 rounded w-16" /></td>
                    <td className="px-6 py-4" />
                  </tr>
                ))
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    No services configured yet. Add your first service tier!
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-bg-primary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {s.image_url && (
                          <img
                            src={s.image_url}
                            alt={s.title}
                            className="w-12 h-12 rounded-xl object-cover border border-border/30 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate max-w-xs">{s.title}</p>
                          <p className="text-xs text-text-secondary truncate max-w-xs mt-0.5">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="font-mono text-xs text-text-primary">{s.price_range}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-text-secondary">{s.delivery_time || "N/A"}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {s.is_active ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-text-secondary bg-border/20 border border-border/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(s)} 
                          className="text-xs px-3 py-1.5 border border-border/30 hover:border-accent-primary/40 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                          className="text-xs px-3 py-1.5 border border-red-500/20 hover:border-red-500/40 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                        >
                          {deleting === s.id ? "..." : "Delete"}
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
