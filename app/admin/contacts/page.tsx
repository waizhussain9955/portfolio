"use client";
import React, { useState, useEffect, useCallback } from "react";

interface Contact { id: number; name: string; email: string; subject: string; message: string; is_processed: boolean; created_at: string; }

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "processed">("all");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setContacts(data.contacts || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const markProcessed = async (id: number) => {
    await fetch(`/api/admin/contacts?id=${id}`, { method: "PATCH" });
    showToast("Marked as processed");
    fetch_();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contact message?")) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
    showToast("Contact deleted");
    fetch_();
  };

  const filtered = contacts.filter(c =>
    filter === "all" ? true : filter === "new" ? !c.is_processed : c.is_processed
  );

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium bg-accent-primary/10 border border-accent-primary/30 text-accent-primary animate-slideUp">{toast}</div>}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Contacts</h1>
          <p className="text-text-secondary text-sm mt-1">{contacts.filter(c => !c.is_processed).length} unread messages</p>
        </div>
        <div className="flex gap-2">
          {(["all", "new", "processed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold rounded-lg border capitalize transition-all ${filter === f ? "bg-accent-primary/10 text-accent-primary border-accent-primary/30" : "text-text-secondary border-border/30 hover:text-text-primary"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass rounded-2xl p-5 border border-border/30 h-20 animate-pulse" />) :
          filtered.length === 0 ? <div className="glass rounded-2xl p-12 border border-border/30 text-center text-text-secondary">No {filter === "all" ? "" : filter} messages.</div> :
          filtered.map(c => (
            <div key={c.id} className={`glass rounded-2xl border transition-all ${!c.is_processed ? "border-accent-primary/20" : "border-border/30"}`}>
              <div className="p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary text-sm font-bold flex-shrink-0">{c.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-text-primary">{c.name}</span>
                      <span className="text-xs text-text-secondary break-all">{c.email}</span>
                      {!c.is_processed && <span className="text-xs bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-2 py-0.5 rounded-full">New</span>}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{c.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</span>
                  <span className="text-text-secondary">{expanded === c.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {expanded === c.id && (
                <div className="px-5 pb-5 border-t border-border/20 pt-4">
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{c.message}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="px-4 py-2 text-xs font-bold bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-lg hover:bg-accent-primary/20 transition-colors">Reply via Email</a>
                    {!c.is_processed && <button onClick={() => markProcessed(c.id)} className="px-4 py-2 text-xs border border-border/30 rounded-lg text-text-secondary hover:text-text-primary transition-colors">Mark Processed</button>}
                    <button onClick={() => handleDelete(c.id)} className="px-4 py-2 text-xs border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
