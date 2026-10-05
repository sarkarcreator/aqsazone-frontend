import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface CaseStudyItem {
  id: number;
  title: string;
  slug: string;
  clientBusiness: string;
  problem: string;
  objectives: string;
  strategy: string;
  workPerformed: string;
  tools?: string | null;
  results: string;
  coverImage?: string | null;
  serviceName?: string | null;
}

interface CaseStudiesSectionProps {
  caseStudies: CaseStudyItem[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function CaseStudiesSection({
  caseStudies,
  title = 'Real Challenges. Verified Results.',
  subtitle = 'In-depth case studies detailing how we diagnose operational bottlenecks and deliver measurable digital outcomes.',
  limit,
}: CaseStudiesSectionProps) {
  const displayed = limit ? caseStudies.slice(0, limit) : caseStudies;

  return (
    <section className="py-20 relative bg-slate-950/60 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Documented Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{subtitle}</p>
        </div>

        <div className="space-y-10">
          {displayed.map((cs, idx) => (
            <div
              key={cs.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Metrics & Story */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-purple-400 font-semibold">{cs.clientBusiness}</span>
                  {cs.serviceName && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{cs.serviceName}</span>
                    </>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  <Link href={`/case-studies/${cs.slug}`} className="hover:text-purple-300 transition-colors">
                    {cs.title}
                  </Link>
                </h3>

                {/* Problem vs Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block mb-1">
                      The Challenge
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{cs.problem}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                      Verified Results
                    </span>
                    <p className="text-xs text-emerald-200 line-clamp-3 leading-relaxed">{cs.results}</p>
                  </div>
                </div>

                {cs.tools && (
                  <div className="text-xs text-slate-400 pt-1">
                    <span className="text-slate-500 font-medium">Stack utilized:</span>{' '}
                    <span className="font-mono text-slate-300">{cs.tools}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 group"
                  >
                    <span>Read Full Case Study Breakdown</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
                <Image
                  src={cs.coverImage || '/images/project_dashboard.jpg'}
                  alt={cs.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {limit && caseStudies.length > limit && (
          <div className="mt-12 text-center">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-medium text-sm transition-all"
            >
              <span>View All Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
