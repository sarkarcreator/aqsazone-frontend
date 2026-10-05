import { apiUrl } from '@/lib/api-client';
'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  X,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: number;
  filename: string;
  fileType: string;
  url: string;
  size: number;
  altText?: string | null;
  caption?: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const [newItem, setNewItem] = useState({
    filename: '',
    fileType: 'image',
    url: '',
    altText: '',
    caption: '',
  });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/media'));
      if (res.ok) {
        const d = await res.json();
        setMediaList(d.media || []);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/media'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewItem({ filename: '', fileType: 'image', url: '', altText: '', caption: '' });
        fetchMedia();
        setFeedback('Media item added!');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Failed to add media:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this media asset record?')) return;
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/media?id=${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      }
    } catch (err) {
      console.error('Delete media error:', err);
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.caption?.toLowerCase().includes(search.toLowerCase()) ||
      m.altText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Centralized Media Library"
      subtitle="Store, organize, copy URLs, and preview photography, vectors, and digital assets."
      actions={
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      }
    >
      <div className="space-y-6">
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Search */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media assets by filename, alt text, or caption..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div
                className="relative aspect-square w-full bg-slate-950 cursor-pointer overflow-hidden"
                onClick={() => setPreviewItem(item)}
              >
                <Image
                  src={item.url}
                  alt={item.altText || item.filename}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3">
                <p className="text-xs font-bold text-white truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item)}
                    className="p-1 rounded text-slate-400 hover:text-purple-300 text-[11px] flex items-center gap-1"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <h3 className="text-base font-semibold text-white">No media assets found</h3>
              <p className="text-xs text-slate-400 mt-1">Upload or attach new media to use in CMS.</p>
            </div>
          )}
        </div>

        {/* Modal: Add Media */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <h3 className="text-lg font-bold text-white">Add Media Item</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Filename / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.filename}
                    onChange={(e) => setNewItem({ ...newItem, filename: e.target.value })}
                    placeholder="hero_banner.jpg"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Asset URL *</label>
                  <input
                    type="text"
                    required
                    value={newItem.url}
                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                    placeholder="/images/project_dashboard.jpg or https://..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={newItem.altText}
                    onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                    placeholder="Description of visual"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Caption</label>
                  <input
                    type="text"
                    value={newItem.caption}
                    onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                    placeholder="Optional caption"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox Preview */}
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-white">{previewItem.filename}</span>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
                <Image
                  src={previewItem.url}
                  alt={previewItem.altText || previewItem.filename}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{previewItem.url}</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewItem)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset URL</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
