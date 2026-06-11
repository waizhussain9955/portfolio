"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface MediaItem {
  id: number;
  filename: string;
  mime_type: string;
  url: string;
  size_bytes: number;
  created_at: string;
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMediaItems(data.media || []);
    } catch (_) {
      showToast("Failed to load media files", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      showToast("File uploaded successfully!");
      fetchMedia();
    } catch (_) {
      showToast("Failed to upload file", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this asset? This will delete the physical file and cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Asset deleted successfully");
      fetchMedia();
    } catch (_) {
      showToast("Failed to delete asset", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyLink = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (mime: string) => {
    return mime.startsWith("image/");
  };

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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Media Library</h1>
          <p className="text-text-secondary text-sm mt-1">{mediaItems.length} assets uploaded</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*,application/pdf,application/zip"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-bg-primary font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload New File"}
          </button>
        </div>
      </div>

      {/* Grid of assets */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-border/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="border border-dashed border-border/30 rounded-2xl p-12 text-center text-text-secondary">
          <p className="text-sm">No media files found. Upload your first asset to use it across the CMS.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="group relative bg-bg-secondary border border-border/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md hover:border-accent-primary/40 transition-all">
              
              {/* Asset Preview */}
              <div className="aspect-video bg-bg-primary/50 relative overflow-hidden flex items-center justify-center border-b border-border/20">
                {isImage(item.mime_type) ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-3xl">📄</div>
                )}
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="p-2 bg-bg-secondary rounded-xl hover:bg-accent-primary hover:text-bg-primary transition-all text-xs font-bold text-text-primary"
                    title="Copy Image URL"
                  >
                    {copiedId === item.id ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-bg-primary rounded-xl transition-all text-xs font-bold"
                  >
                    {deleting === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {/* Asset Meta */}
              <div className="p-3 space-y-1">
                <p className="font-semibold text-xs text-text-primary truncate" title={item.filename}>
                  {item.filename}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyLink(item)}
                  className="block w-full text-left text-[10px] text-accent-primary/80 font-mono truncate hover:text-accent-primary"
                  title={item.url}
                >
                  {item.url}
                </button>
                <div className="flex justify-between text-[10px] text-text-secondary/60 font-mono">
                  <span>{formatSize(item.size_bytes)}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
