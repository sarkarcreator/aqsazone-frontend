'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  ExternalLink,
  Layers,
  X,
  Star,
  Globe,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  slug: string;
  clientName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  serviceId?: number | null;
  serviceName?: string | null;
  shortDescription: string;
  description: string;
  challenge?: string | null;
  solution?: string | null;
  workCompleted?: string | null;
  tools?: string[] | null;
  results?: string | null;
  projectDate?: string | null;
  sourceType: string;
  isSourceVisible: boolean;
  format: string;
  status: string;
  isFeatured: boolean;
  thumbnailUrl?: string | null;
  liveUrl?: string | null;
  externalUrl?: string | null;
  viewsCount?: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientName: '',
    categoryId: '',
    serviceId: '',
    shortDescription: '',
    description: '',
    challenge: '',
    solution: '',
    workCompleted: '',
    toolsStr: '',
    results: '',
    projectDate: new Date().getFullYear().toString(),
    sourceType: 'aqsa',
    isSourceVisible: false,
    format: 'website',
    status: 'published',
    isFeatured: false,
    thumbnailUrl: '/images/project_dashboard.jpg',
    liveUrl: '',
    externalUrl: '',
    media: [{ url: '/images/project_dashboard.jpg', title: 'Main View', caption: '' }],
  });

  const fetchProjectsAndOptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const [resProj, resSvc] = await Promise.all([
        fetch(apiUrl('/api/projects?admin=true'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/services?admin=true'), { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!resProj.ok) throw new Error(`Could not load projects (HTTP ${resProj.status}).`);
      const projectData = await resProj.json();
      setProjects(Array.isArray(projectData.projects) ? projectData.projects : []);
      if (!resSvc.ok) throw new Error(`Could not load categories and services (HTTP ${resSvc.status}).`);
      const serviceData = await resSvc.json();
      setServices(Array.isArray(serviceData.services) ? serviceData.services : []);
      setCategories(Array.isArray(serviceData.categories) ? serviceData.categories : []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setFeedback(err instanceof Error ? err.message : 'Failed to load projects, categories, or services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndOptions();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setWizardStep(1);
    setFormData({
      title: '',
      slug: '',
      clientName: '',
      categoryId: categories[0]?.id?.toString() || '',
      serviceId: services[0]?.id?.toString() || '',
      shortDescription: '',
      description: '',
      challenge: '',
      solution: '',
      workCompleted: '',
      toolsStr: 'Next.js, TypeScript, Tailwind CSS',
      results: '',
      projectDate: '2026',
      sourceType: 'aqsa',
      isSourceVisible: false,
      format: 'website',
      status: 'published',
      isFeatured: false,
      thumbnailUrl: '/images/project_dashboard.jpg',
      liveUrl: '',
      externalUrl: '',
      media: [{ url: '/images/project_dashboard.jpg', title: 'Main View', caption: '' }],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setWizardStep(1);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      clientName: proj.clientName || '',
      categoryId: proj.categoryId?.toString() || '',
      serviceId: proj.serviceId?.toString() || '',
      shortDescription: proj.shortDescription,
      description: proj.description,
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      workCompleted: proj.workCompleted || '',
      toolsStr: Array.isArray(proj.tools) ? proj.tools.join(', ') : '',
      results: proj.results || '',
      projectDate: proj.projectDate || '',
      sourceType: proj.sourceType || 'aqsa',
      isSourceVisible: proj.isSourceVisible,
      format: proj.format || 'website',
      status: proj.status || 'published',
      isFeatured: proj.isFeatured,
      thumbnailUrl: proj.thumbnailUrl || '/images/project_dashboard.jpg',
      liveUrl: proj.liveUrl || '',
      externalUrl: proj.externalUrl || '',
      media: [{ url: proj.thumbnailUrl || '/images/project_dashboard.jpg', title: 'Showcase', caption: '' }],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl(`/api/projects/${projectId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setFeedback('Project deleted.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token') || '';
      const tools = formData.toolsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tools,
      };

      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(apiUrl(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save project');

      setIsModalOpen(false);
      fetchProjectsAndOptions();
      setFeedback('Project saved successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Save project error:', err);
      alert('Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Portfolio & Projects CMS"
      subtitle="Curate client deliverables, screenshots, media assets, results, and publication status."
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-950">
                  <Image
                    src={proj.thumbnailUrl || '/images/project_dashboard.jpg'}
                    alt={proj.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 uppercase">
                      {proj.format}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        proj.status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-purple-400">
                    <span>{proj.categoryName || 'General'}</span>
                    <span className="text-slate-500">{proj.projectDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{proj.shortDescription}</p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                      Source: {proj.sourceType}
                    </span>
                    {proj.isFeatured && (
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 fill-purple-300" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Edit project"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <a
                  href={`/portfolio/${proj.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Project Creation & Editing Wizard */}
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
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
                  </h3>
                  <p className="text-xs text-slate-400">Step {wizardStep} of 4</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wizard Step Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { step: 1, label: '1. Basic Info' },
                  { step: 2, label: '2. Media & Links' },
                  { step: 3, label: '3. Narrative & Results' },
                  { step: 4, label: '4. Status & Review' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setWizardStep(s.step)}
                    className={`py-2 text-center rounded-xl text-xs font-semibold transition-colors ${
                      wizardStep === s.step
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* STEP 1: Basic Information */}
                {wizardStep === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setFormData({
                              ...formData,
                              title,
                              slug: editingProject
                                ? formData.slug
                                : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            });
                          }}
                          placeholder="E.g. NextGen FinTech Portal"
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
                          Client / Brand Name
                        </label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          placeholder="Aura Luxe Atelier"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

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
                          Related Service
                        </label>
                        <select
                          value={formData.serviceId}
                          onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="">Select Service...</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Timeline / Year
                        </label>
                        <input
                          type="text"
                          value={formData.projectDate}
                          onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                          placeholder="2026 / Q2 2026"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Project Source
                        </label>
                        <select
                          value={formData.sourceType}
                          onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="aqsa">Aqsa (Direct)</option>
                          <option value="dsh">Digital Solutions Hub (DSH)</option>
                          <option value="collaboration">Collaboration (Aqsa + DSH)</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isSourceVisible}
                            onChange={(e) =>
                              setFormData({ ...formData, isSourceVisible: e.target.checked })
                            }
                            className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                          />
                          <span>Show Source on Website</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Media & URLs */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Primary Thumbnail URL *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.thumbnailUrl}
                          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                          placeholder="/images/project_dashboard.jpg"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Work Format
                        </label>
                        <select
                          value={formData.format}
                          onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="website">Website / Web App</option>
                          <option value="image">Image / Graphic Design</option>
                          <option value="video">Video / Demo</option>
                          <option value="social_post">Social Media Post</option>
                          <option value="written_work">Written Work / Article</option>
                          <option value="case_study">Case Study</option>
                          <option value="multiple">Multiple Formats</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Live Demonstration URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.liveUrl}
                          onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                          placeholder="https://client-demo.com"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          External Repository / Case Link
                        </label>
                        <input
                          type="url"
                          value={formData.externalUrl}
                          onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Narrative, Challenge, Solution, Results */}
                {wizardStep === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData({ ...formData, shortDescription: e.target.value })
                        }
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Detailed Overview
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          The Challenge
                        </label>
                        <textarea
                          rows={2}
                          value={formData.challenge}
                          onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          The Solution
                        </label>
                        <textarea
                          rows={2}
                          value={formData.solution}
                          onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Tools & Stacks (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.toolsStr}
                          onChange={(e) => setFormData({ ...formData, toolsStr: e.target.value })}
                          placeholder="Next.js, TypeScript, Tailwind, Figma"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Measurable Results
                        </label>
                        <input
                          type="text"
                          value={formData.results}
                          onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                          placeholder="42% increase in checkout conversions"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Status & Final Review */}
                {wizardStep === 4 && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Publish Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                        >
                          <option value="draft">Draft (Private)</option>
                          <option value="review">Under Review</option>
                          <option value="published">Published (Live)</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                          />
                          <span>Show in Featured Homepage Section</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-400">
                      <div className="text-white font-bold">Review Submission:</div>
                      <div>
                        Title: <span className="text-slate-200">{formData.title || 'Untitled'}</span>
                      </div>
                      <div>
                        Format: <span className="text-purple-300">{formData.format}</span>
                      </div>
                      <div>
                        Status: <span className="text-emerald-400 uppercase">{formData.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard Navigation Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    {wizardStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setWizardStep(wizardStep - 1)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        ← Back
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Cancel
                    </button>

                    {wizardStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setWizardStep(wizardStep + 1)}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Save & Publish Project'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
