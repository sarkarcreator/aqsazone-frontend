import { apiUrl } from '@/lib/api-client';
'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  initialService?: string;
  initialProject?: string;
  source?: string;
  onSuccess?: () => void;
}

export default function ContactForm({
  initialService = '',
  initialProject = '',
  source = 'contact_page',
  onSuccess,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    interestedService: initialService,
    relatedProject: initialProject,
    budget: '',
    message: '',
  });

  const [servicesList, setServicesList] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch available services for the dropdown
    async function fetchServices() {
      try {
        const res = await fetch(apiUrl('/api/services'));
        const data = await res.json();
        if (data.services && Array.isArray(data.services)) {
          setServicesList(data.services.map((s: { name: string }) => s.name));
        }
      } catch (e) {
        console.error('Failed to load services for form', e);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, interestedService: initialService }));
    }
    if (initialProject) {
      setFormData((prev) => ({ ...prev, relatedProject: initialProject }));
    }
  }, [initialService, initialProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setStatus('success');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while submitting.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 text-center bg-slate-900/90 border border-emerald-500/30 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Inquiry Received!</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
          Thank you for reaching out. Your project details have been recorded in our CRM, and Aqsa will review and get in touch within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                email: '',
                phone: '',
                whatsapp: '',
                company: '',
                interestedService: '',
                relatedProject: '',
                budget: '',
                message: '',
              });
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            Submit Another Message
          </button>
          <a
            href="https://wa.me/15550192834"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat via WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {initialProject && (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Referencing project: <strong className="text-white">{initialProject}</strong>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Your Full Name <span className="text-pink-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email Address <span className="text-pink-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@company.com"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone or WhatsApp</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Company or Brand Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Aura Luxe / Self-employed"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Interested Service</label>
          <select
            value={formData.interestedService}
            onChange={(e) => setFormData({ ...formData, interestedService: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">Select a service category...</option>
            {servicesList.length > 0 ? (
              servicesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))
            ) : (
              <>
                <option value="AI Agents & Automation Systems">AI Agents & Automation</option>
                <option value="Full-Stack Web & App Development">Web & App Development</option>
                <option value="Brand Identity & Visual Design Systems">Brand Identity & Design</option>
                <option value="SEO & Search Engine Dominance">SEO & Google Ranking</option>
                <option value="Digital Marketing & Paid Advertising">Digital Marketing & Ads</option>
                <option value="LinkedIn Executive Optimization">LinkedIn Services</option>
                <option value="E-Commerce & Online Store Solutions">E-Commerce Solutions</option>
                <option value="Digital Skills & Modern Tech Workshops">Digital Skills Training</option>
              </>
            )}
            <option value="Custom Consultation / Other">Custom Consultation / Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Estimated Budget (Optional)</label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="">Select a range...</option>
            <option value="Under $2,000">Under $2,000</option>
            <option value="$2,000 - $5,000">$2,000 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000 - $25,000">$10,000 - $25,000</option>
            <option value="$25,000+">$25,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Project Details / Message <span className="text-pink-400">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about your goals, timeline, and current challenges..."
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Project Inquiry</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-slate-400">
        Privacy assured. Your details are confidential and used solely to discuss your project requirements.
      </p>
    </form>
  );
}
