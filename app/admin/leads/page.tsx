"use client";
import React, { useState, useEffect, useCallback } from "react";

interface Lead { id: number; name: string; email: string; subject: string; pipeline_stage: string; notes: string; updated_at: string; }

const STAGES = ["New", "Contacted", "In Discussion", "Proposal Sent", "Hired", "Closed"];
const STAGE_COLORS: Record<string, string> = {
  "New": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Contacted": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "In Discussion": "text-orange-400 border-orange-400/30 bg-orange-400/10",
  "Proposal Sent": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Hired": "text-accent-primary border-accent-primary/30 bg-accent-primary/10",
  "Closed": "text-text-secondary border-border/30 bg-bg-secondary",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateStage = async (id: number, pipeline_stage: string, notes: string) => {
    await fetch(`/api/admin/leads?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipeline_stage, notes }),
    });
    showToast("Lead updated");
    setEditing(null);
    fetch_();
  };

  // Group leads by stage
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter(l => l.pipeline_stage === stage);
    return acc;
  }, {} as Record<string, Lead[]>);

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium bg-accent-primary/10 border border-accent-primary/30 text-accent-primary animate-slideUp">{toast}</div>}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md bg-bg-secondary border border-border/30 rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-border/30">
              <h2 className="font-bold text-lg text-text-primary">{editing.name}</h2>
              <p className="text-xs text-text-secondary break-all">{editing.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Pipeline Stage</label>
                <select
                  value={editing.pipeline_stage}
                  onChange={e => setEditing({ ...editing, pipeline_stage: e.target.value })}
                  className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-all"
                >
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Notes</label>
                <textarea
                  rows={4}
                  value={editing.notes || ""}
                  onChange={e => setEditing({ ...editing, notes: e.target.value })}
                  placeholder="Add internal notes..."
                  className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-3 text-sm text-text-primary resize-none focus:outline-none focus:border-accent-primary transition-all"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border/30 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-sm border border-border/30 rounded-xl text-text-secondary">Cancel</button>
              <button onClick={() => updateStage(editing.id, editing.pipeline_stage, editing.notes)} className="px-5 py-2.5 text-sm font-bold bg-gradient-primary text-bg-primary rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Leads CRM</h1>
        <p className="text-text-secondary text-sm mt-1">{leads.length} total leads across pipeline</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map(s => <div key={s} className="glass rounded-2xl border border-border/30 p-4 h-40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map(stage => (
            <div key={stage} className="glass rounded-2xl border border-border/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">{stage}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STAGE_COLORS[stage]}`}>{grouped[stage].length}</span>
                </div>
              </div>
              <div className="p-3 space-y-2 min-h-[80px]">
                {grouped[stage].length === 0 ? (
                  <p className="text-xs text-text-secondary/50 text-center py-4">Empty</p>
                ) : (
                  grouped[stage].map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => setEditing(lead)}
                      className="w-full text-left p-3 bg-bg-primary/40 hover:bg-bg-primary/70 rounded-xl border border-border/20 hover:border-accent-primary/20 transition-all"
                    >
                      <p className="text-xs font-semibold text-text-primary truncate">{lead.name}</p>
                      <p className="text-xs text-text-secondary truncate">{lead.subject}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
