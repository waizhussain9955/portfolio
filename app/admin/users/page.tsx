"use client";

import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string | null;
  created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: "text-red-400 bg-red-400/10 border-red-400/20",
  admin: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  editor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  client: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  user: "text-text-secondary bg-border/10 border-border/20",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-400 bg-green-400/10 border-green-400/20",
  inactive: "text-text-secondary bg-border/10 border-border/20",
  suspended: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editingUser.role, status: editingUser.status }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...editingUser } : u))
        );
        setEditingUser(null);
      }
    } catch (_) {}
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setDeleteConfirm(null);
      }
    } catch (_) {}
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">User Management</h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage roles, statuses, and access for all registered users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: "👥" },
          { label: "Admins", value: users.filter((u) => u.role.includes("admin")).length, icon: "🛡️" },
          { label: "Clients", value: users.filter((u) => u.role === "client").length, icon: "💼" },
          { label: "Active", value: users.filter((u) => u.status === "active").length, icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl border border-border/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                {s.label}
              </p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold font-heading text-text-primary mt-2">
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 bg-bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none transition-colors"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="client">Client</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-bg-secondary/40">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Last Login
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Joined
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-border/30" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 bg-border/30 rounded" />
                          <div className="h-2.5 w-32 bg-border/20 rounded" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 w-16 bg-border/20 rounded" />
                      </td>
                    ))}
                    <td className="px-6 py-4" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-bg-primary/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-sm flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-secondary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          ROLE_COLORS[user.role] || ROLE_COLORS.user
                        }`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          STATUS_COLORS[user.status] || STATUS_COLORS.inactive
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-mono">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-mono">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="text-xs text-accent-primary hover:underline px-3 py-1.5 rounded-lg border border-accent-primary/20 hover:bg-accent-primary/10 transition-colors"
                        >
                          Edit
                        </button>
                        {deleteConfirm === user.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-xs text-red-400 px-3 py-1.5 rounded-lg border border-red-400/20 hover:bg-red-400/10 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs text-text-secondary px-3 py-1.5 rounded-lg border border-border/30 hover:bg-bg-primary/30 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-400/20 hover:bg-red-400/10 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-border/50 p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Edit User</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">{editingUser.name}</p>
              <p className="text-xs text-text-secondary">{editingUser.email}</p>
            </div>
            <div>
              <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                Role
              </label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="client">Client</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary font-semibold mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                className="w-full bg-bg-primary border border-border/50 rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 border border-border/30 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold hover:bg-accent-primary/90 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
