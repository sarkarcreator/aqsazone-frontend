import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import PortfolioGrid from '@/components/PortfolioGrid';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  getSiteSettings,
  getServices,
  getProjects,
  getCaseStudies,
  getTestimonials,
} from '@/lib/db-queries';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Bot,
  Zap,
  Award,
} from 'lucide-react';

export const revalidate = 30;

export default async function HomePage() {
  const [settings, servicesList, projectsList, caseStudiesList, testimonialsList] =
    await Promise.all([
      getSiteSettings(),
      getServices({ publishedOnly: true }),
      getProjects({ publishedOnly: true }),
      getCaseStudies({ publishedOnly: true, featuredOnly: true }),
      getTestimonials({ publishedOnly: true }),
    ]);

  const collaborationEnabled = settings.collaboration_enabled !== 'false';
  const collaborationTitle = settings.collaboration_title || 'Professional Collaboration';
  const collaborationText =
    settings.collaboration_text ||
    'Aqsa also collaborates with Digital Solutions Hub on selected digital projects and services.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600/30 selection:text-purple-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection settings={settings} />

        {/* Professional Collaboration Notice (Admin controllable) */}
        {collaborationEnabled && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-10">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40 border border-purple-500/20 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white text-xs sm:text-sm font-semibold mr-2">
                    {collaborationTitle}:
                  </span>
                  <span className="text-slate-300 text-xs sm:text-sm">{collaborationText}</span>
                </div>
              </div>
              <Link
                href="/about"
                className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 shrink-0"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Featured Services Section */}
        <ServicesGrid
          services={servicesList}
          title="Digital Services Built for Growth"
          subtitle="Explore our specialized digital capabilities spanning modern web engineering, AI automation workflows, high-impact design systems, and SEO."
          limit={6}
        />

        {/* Why Choose Aqsa Zone / Core Pillars */}
        <section className="py-20 bg-slate-900/40 border-y border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>The Aqsa Zone Standard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Engineering Precision Meets Creative Vision
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether deploying custom AI agents or architecting modern web platforms, every project is executed with disciplined craft and rigorous attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Modern Technical Stacks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean, maintainable architectures built on Next.js, TypeScript, PostgreSQL, and scalable cloud runtimes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">AI & Automation First</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cutting-edge GenAI workflows that eliminate human latency, automate repetitive CRM tasks, and scale 24/7.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Premium Brand Craft</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bespoke typography, balanced palettes, and sophisticated visual hierarchies tailored to global international clientele.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Collaborative Ecosystem</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Flexible fulfillment: independent personal brand agility paired with Digital Solutions Hub network capacity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Portfolio Section */}
        <PortfolioGrid
          projects={projectsList}
          title="Selected Client Deliverables & Work"
          subtitle="Explore multi-format digital projects including live web platforms, AI agents, brand identities, and executive thought-leadership."
          showFilters={true}
        />

        {/* Case Studies Section */}
        {caseStudiesList.length > 0 && (
          <CaseStudiesSection
            caseStudies={caseStudiesList}
            title="In-Depth Case Studies"
            subtitle="Verified transformations with real business objectives, transparent strategies, and measurable outcomes."
          />
        )}

        {/* Testimonials */}
        {testimonialsList.length > 0 && (
          <TestimonialsSection testimonials={testimonialsList} />
        )}

        {/* Bottom High-Converting CTA Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-pink-900/40 border border-purple-500/30 shadow-2xl text-center space-y-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Ready to Elevate Your Digital Presence?</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
                Let&apos;s Turn Your Ideas Into High-Performing Digital Realities.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Whether you need an autonomous AI assistant, a modern web portal, or a complete brand overhaul, let&apos;s start a conversation today.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Start Your Project Inquiry</span>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 font-semibold text-sm transition-all"
                >
                  <span>Browse Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
