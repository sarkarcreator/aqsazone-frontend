import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesGrid from '@/components/ServicesGrid';
import { getServices, getSiteSettings, getCategories } from '@/lib/db-queries';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 30;

export default async function ServicesPage() {
  const [servicesList, settings, categories] = await Promise.all([
    getServices({ publishedOnly: true }),
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Full Service Catalogue</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Specialized Digital & Creative Services.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              From advanced autonomous AI agent workflows to custom cloud web applications and authoritative personal branding, browse our complete suite of client services.
            </p>
          </div>

          {/* Quick Categories Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-12 flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold self-center mr-2">
              Explore Disciplines:
            </span>
            {categories.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300"
              >
                {c.name}
              </span>
            ))}
          </div>

          {/* Services List */}
          <ServicesGrid
            services={servicesList}
            categories={categories}
            showCategoryFilters={true}
            title="All Services"
            subtitle="Click on any service card below to view detailed deliverables, technical process breakdowns, and FAQs."
          />

          {/* Bottom custom inquiry banner */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Need a Tailored or Multi-Discipline Solution?</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Many engagements blend custom web development, brand identity design, and AI automation into a unified roadmap.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all"
            >
              <span>Request a Custom Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
