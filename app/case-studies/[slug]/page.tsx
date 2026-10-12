import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getCaseStudyBySlug, getSiteSettings } from '@/lib/db-queries';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
  FileCheck,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 30;

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [caseStudy, settings] = await Promise.all([
    getCaseStudyBySlug(slug),
    getSiteSettings(),
  ]);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-purple-300">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/case-studies" className="hover:text-purple-300">
              Case Studies
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium">{caseStudy.title}</span>
          </nav>

          {/* Header Banner */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Client Case</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {caseStudy.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Client / Business</span>
                  <span className="font-semibold text-white">{caseStudy.clientBusiness}</span>
                </div>
                {caseStudy.serviceName && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Service Discipline</span>
                    <span className="font-semibold text-purple-400">{caseStudy.serviceName}</span>
                  </div>
                )}
                {caseStudy.projectTitle && caseStudy.projectSlug && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Associated Portfolio Work</span>
                    <Link
                      href={`/portfolio/${caseStudy.projectSlug}`}
                      className="font-semibold text-indigo-400 hover:underline"
                    >
                      {caseStudy.projectTitle}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 mb-16 shadow-2xl">
            <Image
              src={caseStudy.coverImage || '/images/project_dashboard.jpg'}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Deep-dive sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-12">
              {/* Problem / Objective */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                    <Target className="w-4 h-4" />
                    <span>The Problem</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {caseStudy.problem}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Objectives</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {caseStudy.objectives}
                  </p>
                </div>
              </div>

              {/* Strategy & Implementation */}
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Strategic Blueprint</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{caseStudy.strategy}</p>
                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Implementation Phases
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{caseStudy.implementation}</p>
                </div>
              </div>

              {/* Work Performed */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-purple-400" />
                  <span>Work Performed</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {caseStudy.workPerformed}
                </p>
              </div>

              {/* Verified Results */}
              <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>Documented Business Results</span>
                </h3>
                <p className="text-sm sm:text-base text-emerald-200 leading-relaxed font-medium">
                  {caseStudy.results}
                </p>
              </div>
            </div>

            {/* Right 4 Cols: Inquiry Form */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                    Partner With Us
                  </span>
                  <h3 className="text-xl font-bold text-white">Achieve Similar Impact</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Discuss how we can replicate these metrics for your organization.
                  </p>
                </div>

                <ContactForm
                  initialService={caseStudy.serviceName || ''}
                  initialProject={caseStudy.title}
                  source={`case_study_${caseStudy.slug}`}
                />
              </div>

              {caseStudy.tools && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Tools & Technologies
                  </h4>
                  <p className="text-xs font-mono text-slate-300">{caseStudy.tools}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
