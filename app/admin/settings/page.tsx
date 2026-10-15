'use client';


import { apiUrl } from '@/lib/api-client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Settings, Save, CheckCircle2, Loader2, Sparkles, Globe, User, MessageSquare, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'collab' | 'contact' | 'seo'>('hero');

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch(apiUrl('/api/settings'), { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || `Settings request failed (HTTP ${res.status})`);
        }
        if (!data || typeof data.settings !== 'object' || data.settings === null || Array.isArray(data.settings)) {
          throw new Error('The settings API returned an invalid response.');
        }

        if (!cancelled) {
          setSettings(
            Object.fromEntries(
              Object.entries(data.settings).map(([key, value]) => [key, String(value ?? '')])
            )
          );
          setLoadError(false);
          setFeedback(
            Object.keys(data.settings).length === 0
              ? 'No saved CMS settings were found in the database. Enter the values you want and save to initialize these settings.'
              : ''
          );
        }
      } catch (err) {
        console.error('Failed to load website settings:', err);
        if (!cancelled) {
          setLoadError(true);
          setFeedback(
            err instanceof Error
              ? `Could not load website settings: ${err.message}`
              : 'Could not load website settings. Please check the API and database connection.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const [initializing, setInitializing] = useState(false);

  const handleInitializeCms = async () => {
    setInitializing(true);
    setFeedback('');
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/admin/initialize-cms'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `CMS initialization failed (HTTP ${res.status})`);

      const settingsRes = await fetch(apiUrl('/api/settings'), { cache: 'no-store' });
      const settingsData = await settingsRes.json().catch(() => ({}));
      if (!settingsRes.ok || !settingsData?.settings) {
        throw new Error('CMS initialized, but website settings could not be reloaded.');
      }
      setSettings(Object.fromEntries(
        Object.entries(settingsData.settings).map(([key, value]) => [key, String(value ?? '')])
      ));
      setLoadError(false);
      setFeedback(`CMS initialized: ${data.categoriesAdded} categories added (${data.categoriesTotal} total), ${data.servicesAdded ?? 0} services added (${data.servicesTotal ?? 0} total), and ${data.settingsAdded} settings added. Existing saved values were preserved.`);
    } catch (err) {
      setFeedback(err instanceof Error ? `Could not initialize CMS: ${err.message}` : 'Could not initialize CMS. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch(apiUrl('/api/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Failed to update settings (HTTP ${res.status})`);
      }

      setSettings(
        Object.fromEntries(
          Object.entries(data.settings || settings).map(([key, value]) => [key, String(value ?? '')])
        )
      );
      setFeedback('Settings updated and published successfully.');
    } catch (err) {
      console.error('Save settings error:', err);
      setFeedback(
        err instanceof Error
          ? `Could not save settings: ${err.message}`
          : 'Could not save settings. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Website Settings & CMS Configuration"
      subtitle="Modify brand taglines, hero headers, profile imagery, collaboration notices, contact channels, and SEO metadata without touching code."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInitializeCms}
            disabled={initializing || loading}
            className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {initializing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{initializing ? 'Initializing…' : 'Initialize CMS Data'}</span>
          </button>
          <button
            type="button"
            onClick={() => void handleSave({ preventDefault: () => {} } as React.FormEvent)}
            disabled={saving || loading || loadError}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-4xl">
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.startsWith('Could not') || feedback.startsWith('No saved')
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {loading && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading website settings from the database…
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {[
            { id: 'hero', label: 'Hero & Visuals', icon: Sparkles },
            { id: 'about', label: 'About & Bio', icon: User },
            { id: 'collab', label: 'DSH Collaboration', icon: ShieldCheck },
            { id: 'contact', label: 'Contact & Socials', icon: MessageSquare },
            { id: 'seo', label: 'SEO & Metadata', icon: Globe },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === t.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Homepage Hero Section
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title || ''}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hero Tagline Badge
                  </label>
                  <input
                    type="text"
                    value={settings.hero_tagline || ''}
                    onChange={(e) => handleChange('hero_tagline', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Supporting Paragraph Text
                </label>
                <textarea
                  rows={2}
                  value={settings.hero_description || ''}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={settings.hero_primary_cta || ''}
                    onChange={(e) => handleChange('hero_primary_cta', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={settings.hero_secondary_cta || ''}
                    onChange={(e) => handleChange('hero_secondary_cta', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={settings.profile_image || ''}
                  onChange={(e) => handleChange('profile_image', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                About Aqsa Section
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={settings.about_name || ''}
                    onChange={(e) => handleChange('about_name', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Experience</label>
                  <input
                    type="text"
                    value={settings.about_experience || ''}
                    onChange={(e) => handleChange('about_experience', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Education</label>
                <input
                  type="text"
                  value={settings.about_education || ''}
                  onChange={(e) => handleChange('about_education', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Intro</label>
                <input
                  type="text"
                  value={settings.about_intro || ''}
                  onChange={(e) => handleChange('about_intro', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Biography</label>
                <textarea
                  rows={4}
                  value={settings.about_bio || ''}
                  onChange={(e) => handleChange('about_bio', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Career Focus</label>
                <input
                  type="text"
                  value={settings.about_career_focus || ''}
                  onChange={(e) => handleChange('about_career_focus', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: COLLABORATION */}
          {activeTab === 'collab' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Digital Solutions Hub (DSH) Professional Collaboration
              </h3>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="collab-toggle"
                  checked={settings.collaboration_enabled !== 'false'}
                  onChange={(e) =>
                    handleChange('collaboration_enabled', e.target.checked ? 'true' : 'false')
                  }
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <label htmlFor="collab-toggle" className="text-xs text-white font-medium cursor-pointer">
                  Display Professional Collaboration Section on Public Website
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settings.collaboration_title || 'Professional Collaboration'}
                  onChange={(e) => handleChange('collaboration_title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Collaboration Statement
                </label>
                <textarea
                  rows={3}
                  value={
                    settings.collaboration_text ||
                    'Aqsa also collaborates with Digital Solutions Hub on selected digital projects and services.'
                  }
                  onChange={(e) => handleChange('collaboration_text', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Contact Details & Social Media Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={settings.contact_whatsapp || ''}
                    onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.social_instagram || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={settings.social_tiktok || ''}
                    onChange={(e) => handleChange('social_tiktok', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">X / Twitter URL</label>
                  <input
                    type="url"
                    value={settings.social_x || ''}
                    onChange={(e) => handleChange('social_x', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                SEO & Open Graph Meta
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Default Meta Title</label>
                <input
                  type="text"
                  value={settings.seo_title || ''}
                  onChange={(e) => handleChange('seo_title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.seo_description || ''}
                  onChange={(e) => handleChange('seo_description', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving || loading || loadError}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing Updates...' : 'Save & Publish Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
