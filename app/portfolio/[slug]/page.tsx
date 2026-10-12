import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getProjectBySlug, getSiteSettings } from '@/lib/db-queries';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ChevronRight,
  ExternalLink,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Target,
  FileCheck,
  Globe,
  Share2,
} from 'lucide-react';

export const revalidate = 30;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

 const tools: string[] = Array.isArray(project.tools)
  ? (project.tools as unknown[]).filter(
      (tool): tool is string => typeof tool === 'string'
    )
  : [];

const mediaItems: Array<{
  id: string | number;
  url: string;
  type?: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
}> = Array.isArray(project.media) ? project.media : [];

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
            <Link href="/portfolio" className="hover:text-purple-300">
              Portfolio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium">{project.title}</span>
          </nav>

          {/* Project Header Banner */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {project.categoryName && (
                  <span className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                    {project.categoryName}
                  </span>
                )}
                {project.serviceName && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                    {project.serviceName}
                  </span>
                )}
                {project.isSourceVisible && (
                  <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs">
                    Source: {project.sourceType === 'dsh' ? 'Digital Solutions Hub' : project.sourceType === 'collaboration' ? 'Collaborative' : 'Aqsa'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Metadata strip */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800">
                {project.clientName && (
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Client / Brand</span>
                    <span className="font-semibold text-white">{project.clientName}</span>
                  </div>
                )}
                {project.projectDate && (
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Timeline / Date</span>
                    <span className="font-semibold text-white">{project.projectDate}</span>
                  </div>
                )}
                {project.liveUrl && (
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Live Demonstration</span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                    >
                      <span>Visit Live Platform</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Showcase Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 mb-16 shadow-2xl">
            <Image
              src={project.thumbnailUrl || '/images/project_dashboard.jpg'}
              alt={project.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Two-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Cols: Narrative, Challenge, Solution, Media, Results */}
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Project Summary</h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base">
                  <p>{project.description}</p>
                </div>
              </div>

              {/* Challenge vs Solution */}
              {(project.challenge || project.solution) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.challenge && (
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                        <Target className="w-4 h-4" />
                        <span>The Challenge</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>
                  )}

                  {project.solution && (
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                        <Cpu className="w-4 h-4" />
                        <span>The Solution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Work Completed */}
              {project.workCompleted && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-400" />
                    <span>Work Performed & Deliverables</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.workCompleted}
                  </p>
                </div>
              )}

              {/* Verified Results */}
              {project.results && (
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Measurable Results & Impact</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-medium">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Multi-Media Gallery */}
              {mediaItems.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <span>Project Media Gallery</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {mediaItems.map((media) => (
                      <div
                        key={media.id}
                        className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg"
                      >
                        <div className="relative aspect-video w-full bg-slate-950">
                          <Image
                            src={media.url}
                            alt={media.altText || project.title}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {(media.title || media.caption) && (
                          <div className="p-4 space-y-1">
                            {media.title && (
                              <h4 className="text-xs font-bold text-white">{media.title}</h4>
                            )}
                            {media.caption && (
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {media.caption}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Case Study */}
              {project.caseStudy && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold block mb-1">
                      Deep Dive
                    </span>
                    <h4 className="text-base font-bold text-white">{project.caseStudy.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Read the complete verified case study.</p>
                  </div>
                  <Link
                    href={`/case-studies/${project.caseStudy.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shrink-0"
                  >
                    View Case Study
                  </Link>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Sticky Inquiry Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                    Get Similar Results
                  </span>
                  <h3 className="text-xl font-bold text-white">Let&apos;s Build Your Solution</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Inquire directly regarding this project style or tech stack.
                  </p>
                </div>

                <ContactForm
                  initialService={project.serviceName || project.categoryName || ''}
                  initialProject={project.title}
                  source={`project_page_${project.slug}`}
                />
              </div>

              {/* Technologies Utilized */}
              {tools.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
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
