import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import { getCaseStudies, getSiteSettings } from '@/lib/db-queries';
import { TrendingUp, Sparkles } from 'lucide-react';

export const revalidate = 30;

export default async function CaseStudiesPage() {
  const [caseStudiesList, settings] = await Promise.all([
    getCaseStudies({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Transformations</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Documented Client Case Studies.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Real business challenges, architectural strategies, and verified results. We focus on measurable outcomes rather than speculative claims.
            </p>
          </div>

          <CaseStudiesSection
            caseStudies={caseStudiesList}
            title=""
            subtitle=""
          />
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
