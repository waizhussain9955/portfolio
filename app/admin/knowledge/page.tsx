"use client";
import React, { useState, useEffect, useCallback } from "react";

interface KBEntry { id: number; title: string; content: string; category: string; updated_at: string; }
const EMPTY = { title: "", content: "", category: "general" };
const CATEGORIES = ["general", "skills", "experience", "projects", "contact", "services", "faq"];

export default function AdminKnowledgePage() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/knowledge");
    const data = await res.json();
    setEntries(data.entries || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openNew = () => { setEditingId(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (e: KBEntry) => { setEditingId(e.id); setForm({ title: e.title, content: e.content, category: e.category }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    const url = editingId ? `/api/admin/knowledge/${editingId}` : "/api/admin/knowledge";
    await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    showToast(editingId ? "Entry updated" : "Entry created");
    setShowForm(false);
    fetch_();
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this knowledge entry?")) return;
    await fetch(`/api/admin/knowledge/${id}`, { method: "DELETE" });
    showToast("Entry deleted");
    fetch_();
  };

  const inputCls = "w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-all";

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium bg-accent-primary/10 border border-accent-primary/30 text-accent-primary animate-slideUp">{toast}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Knowledge Base</h1>
          <p className="text-text-secondary text-sm mt-1">Train the AI chatbot with custom context — {entries.length} entries</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all">
          + Add Entry
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-bg-secondary border border-border/30 rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">{editingId ? "Edit Entry" : "New Knowledge Entry"}</h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Flutter experience" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Content *</label>
                <textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="This context will be injected into the chatbot's knowledge base..." className={`${inputCls} resize-none`} />
              </div>
            </div>
            <div className="p-6 border-t border-border/30 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm border border-border/30 rounded-xl text-text-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-bold bg-gradient-primary text-bg-primary rounded-xl">{saving ? "Saving..." : editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass rounded-2xl p-5 border border-border/30 animate-pulse h-20" />) :
          entries.length === 0 ? <div className="glass rounded-2xl p-12 border border-border/30 text-center text-text-secondary">No knowledge entries yet. Add content to improve the chatbot's responses.</div> :
          entries.map(e => (
            <div key={e.id} className="glass rounded-2xl p-5 border border-border/30 hover:border-accent-primary/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-text-primary">{e.title}</span>
                    <span className="text-xs bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2 py-0.5 rounded-full font-mono">{e.category}</span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">{e.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(e)} className="text-xs px-3 py-1.5 border border-border/30 hover:border-accent-primary/40 rounded-lg text-text-secondary hover:text-text-primary transition-colors">Edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-xs px-3 py-1.5 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
