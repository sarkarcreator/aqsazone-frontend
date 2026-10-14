'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Check,
  Star,
} from 'lucide-react';

interface Service {
  id: number;
  categoryId?: number | null;
  categoryName?: string | null;
  name: string;
  slug: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  process: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  sourceType: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    icon: 'Sparkles',
    shortDescription: '',
    fullDescription: '',
    features: [''],
    process: [{ title: '', description: '' }],
    faqs: [{ question: '', answer: '' }],
    sourceType: 'aqsa',
    isFeatured: false,
    isPublished: true,
    sortOrder: 0,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/services?admin=true'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Could not load services and categories (HTTP ${res.status}). Please sign in again if access was denied.`);
      const data = await res.json();
      setServices(Array.isArray(data.services) ? data.services : []);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (err) {
      console.error('Failed to load services:', err);
      setFeedback(err instanceof Error ? err.message : 'Failed to load services and categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      categoryId: categories[0]?.id?.toString() || '',
      icon: 'Sparkles',
      shortDescription: '',
      fullDescription: '',
      features: [''],
      process: [{ title: '', description: '' }],
      faqs: [{ question: '', answer: '' }],
      sourceType: 'aqsa',
      isFeatured: false,
      isPublished: true,
      sortOrder: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      categoryId: service.categoryId ? service.categoryId.toString() : '',
      icon: service.icon || 'Sparkles',
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      features: service.features?.length > 0 ? service.features : [''],
      process:
        service.process?.length > 0 ? service.process : [{ title: '', description: '' }],
      faqs: service.faqs?.length > 0 ? service.faqs : [{ question: '', answer: '' }],
      sourceType: service.sourceType || 'aqsa',
      isFeatured: service.isFeatured,
      isPublished: service.isPublished,
      sortOrder: service.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (service: Service) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/services/${service.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !service.isPublished }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isPublished: !s.isPublished } : s))
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/services/${service.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: !service.isFeatured }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isFeatured: !s.isFeatured } : s))
        );
      }
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/services/${serviceId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
        setFeedback('Service deleted successfully.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const payload = {
        ...formData,
        features: formData.features.filter((f) => f.trim().length > 0),
        process: formData.process.filter((p) => p.title.trim().length > 0),
        faqs: formData.faqs.filter((faq) => faq.question.trim().length > 0),
      };

      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(apiUrl(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save service');

      setIsModalOpen(false);
      fetchServices();
      setFeedback('Service saved successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Save service error:', err);
      alert('Error saving service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Services Catalogue CMS"
      subtitle="Manage public service offerings, feature checklists, process roadmaps, and category links."
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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

        {/* Database categories overview: include categories even when they currently have no services */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div><h2 className="text-sm font-bold text-white">Service Categories</h2><p className="mt-1 text-xs text-slate-400">All categories stored in the database, including categories with no assigned services.</p></div>
            <span className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300">{categories.length} categories · {services.length} services</span>
          </div>
          {categories.length > 0 ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => {
            const count = services.filter((service) => Number(service.categoryId) === Number(category.id)).length;
            return <div key={category.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-sm font-semibold text-white">{category.name}</h3><p className="mt-1 break-all text-[11px] text-slate-500">{category.slug || 'No slug set'}</p></div><span className="shrink-0 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">{count} {count === 1 ? 'service' : 'services'}</span></div></div>;
          })}</div> : <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">No categories were returned by the API. Check the backend category records and admin API response.</p>}
        </section>

        {/* Services Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{svc.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">/services/{svc.slug}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {svc.categoryName || 'Unassigned'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] uppercase font-mono text-purple-300">
                        {svc.sourceType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(svc)}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          svc.isFeatured
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${svc.isFeatured ? 'fill-amber-400' : ''}`} />
                        <span>{svc.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(svc)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                          svc.isPublished
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {svc.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Service"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(svc.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create / Edit Service */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingService ? `Edit Service: ${editingService.name}` : 'Add New Digital Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({
                          ...formData,
                          name,
                          slug: editingService
                            ? formData.slug
                            : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Icon Name
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Bot">Bot (AI)</option>
                      <option value="Code2">Code2 (Web)</option>
                      <option value="Palette">Palette (Design)</option>
                      <option value="TrendingUp">TrendingUp (SEO)</option>
                      <option value="Megaphone">Megaphone (Ads)</option>
                      <option value="Share2">Share2 (LinkedIn/Social)</option>
                      <option value="ShoppingCart">ShoppingCart (E-Com)</option>
                      <option value="GraduationCap">GraduationCap (Training)</option>
                      <option value="Sparkles">Sparkles (General)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Fulfillment Source
                    </label>
                    <select
                      value={formData.sourceType}
                      onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="aqsa">Aqsa (Direct)</option>
                      <option value="dsh">Digital Solutions Hub (DSH)</option>
                      <option value="collaboration">Collaborative (Aqsa + DSH)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Features rows */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Features Checklist</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                      className="text-[11px] text-purple-400 hover:text-purple-300"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const updated = [...formData.features];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, features: updated });
                          }}
                          placeholder={`Feature ${idx + 1}`}
                          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                features: formData.features.filter((_, i) => i !== idx),
                              })
                            }
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Published to Website</span>
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
                    {submitting ? 'Saving...' : 'Save Service'}
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
