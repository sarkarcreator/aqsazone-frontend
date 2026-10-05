import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getProjects, getSiteSettings } from '@/lib/db-queries';
import { FolderKanban, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function PortfolioPage() {
  const [projectsList, settings] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project Deliverables</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our Work & Client Projects.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Explore dynamic multi-format work across web engineering, autonomous AI workflows, branding systems, and social authority campaigns.
            </p>
          </div>

          {/* Interactive Portfolio Grid */}
          <PortfolioGrid
            projects={projectsList}
            showFilters={true}
            title=""
            subtitle=""
          />
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
