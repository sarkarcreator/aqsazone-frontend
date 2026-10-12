'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { TrendingUp, Plus, Trash2, Edit, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  clientBusiness: string;
  problem: string;
  objectives: string;
  strategy: string;
  workPerformed: string;
  tools?: string | null;
  implementation: string;
  results: string;
  coverImage?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientBusiness: '',
    problem: '',
    objectives: '',
    strategy: '',
    workPerformed: '',
    tools: '',
    implementation: '',
    results: '',
    coverImage: '/images/project_dashboard.jpg',
    isFeatured: false,
    isPublished: true,
  });

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/case-studies?admin=true'), { credentials: 'include', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCaseStudies(data.caseStudies || []);
      }
    } catch (err) {
      console.error('Failed to load case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      clientBusiness: '',
      problem: '',
      objectives: '',
      strategy: '',
      workPerformed: '',
      tools: 'Next.js, PostgreSQL, Tailwind CSS',
      implementation: '',
      results: '',
      coverImage: '/images/project_dashboard.jpg',
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cs: CaseStudy) => {
    setEditingId(cs.id);
    setFormData({
      title: cs.title,
      slug: cs.slug,
      clientBusiness: cs.clientBusiness,
      problem: cs.problem,
      objectives: cs.objectives,
      strategy: cs.strategy,
      workPerformed: cs.workPerformed,
      tools: cs.tools || '',
      implementation: cs.implementation,
      results: cs.results,
      coverImage: cs.coverImage || '/images/project_dashboard.jpg',
      isFeatured: cs.isFeatured,
      isPublished: cs.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/case-studies/${id}`), { credentials: 'include',
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCaseStudies((prev) => prev.filter((c) => c.id !== id));
        setFeedback('Case study deleted.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Delete case study error:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const url = editingId ? `/api/case-studies/${editingId}` : '/api/case-studies';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save case study');

      setIsModalOpen(false);
      fetchCaseStudies();
      setFeedback('Case study saved successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Save case study error:', err);
      alert('Error saving case study');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Case Studies CMS"
      subtitle="Document client problems, architectural strategies, execution, and verified results."
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Study</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-400 font-semibold">{cs.clientBusiness}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cs.isPublished
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cs.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{cs.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{cs.problem}</p>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-semibold block text-[10px] uppercase mb-0.5">Results:</span>
                  <span className="line-clamp-2">{cs.results}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(cs)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cs.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <a
                  href={`/case-studies/${cs.slug}`}
                  target="_blank"
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Preview →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full max-w-2xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingId ? 'Edit Case Study' : 'Create New Case Study'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: editingId
                            ? formData.slug
                            : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Client / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientBusiness}
                    onChange={(e) => setFormData({ ...formData, clientBusiness: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Problem *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Objectives</label>
                    <textarea
                      rows={2}
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Strategy</label>
                  <textarea
                    rows={2}
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Verified Results *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Featured Case Study</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Published</span>
                  </label>
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
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Case Study'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
