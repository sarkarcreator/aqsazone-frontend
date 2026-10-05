import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getServiceBySlug, getProjects, getCaseStudies, getSiteSettings } from '@/lib/db-queries';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FolderKanban,
  Check,
  ChevronRight,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const revalidate = 0;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  // Get related projects and case studies for this service
  const allProjects = await getProjects({ publishedOnly: true });
  const relatedProjects = allProjects.filter(
    (p) => p.serviceId === service.id || p.categoryId === service.categoryId
  );

  const allCaseStudies = await getCaseStudies({ publishedOnly: true });
  const relatedCaseStudies = allCaseStudies.filter(
    (cs) => cs.relatedServiceId === service.id
  );

  const features = Array.isArray(service.features) ? service.features : [];
  const processSteps = Array.isArray(service.process) ? service.process : [];
  const faqs = Array.isArray(service.faqs) ? service.faqs : [];

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
            <Link href="/services" className="hover:text-purple-300">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium">{service.name}</span>
          </nav>

          {/* Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-8 sm:p-12 mb-16 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{service.categoryName || 'Core Service'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {service.name}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {service.shortDescription}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#contact-inquiry"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#process"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all"
                >
                  <span>Execution Process</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Cols: Full Details, Process, FAQs, Related Work */}
            <div className="lg:col-span-8 space-y-16">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Scope & Overview</h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base">
                  <p>{service.fullDescription}</p>
                </div>
              </div>

              {/* What We Deliver (Features Checklist) */}
              {features.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight">What Is Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Process Timeline */}
              {processSteps.length > 0 && (
                <div id="process" className="space-y-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight">The Execution Roadmap</h2>
                  <div className="space-y-4">
                    {processSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-sm flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white mb-1">{step.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordion */}
              {faqs.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <span>Frequently Asked Questions</span>
                  </h2>
                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-slate-900">
                  <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-indigo-400" />
                    <span>Related Projects</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProjects.slice(0, 2).map((p) => (
                      <Link
                        key={p.id}
                        href={`/portfolio/${p.slug}`}
                        className="group block rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-4 transition-all"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                          <Image
                            src={p.thumbnailUrl || '/images/project_dashboard.jpg'}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Sticky Inquiry Card */}
            <div id="contact-inquiry" className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                    Book Service
                  </span>
                  <h3 className="text-xl font-bold text-white">Interested in {service.name}?</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Submit the form below and let&apos;s map out your project requirements.
                  </p>
                </div>

                <ContactForm
                  initialService={service.name}
                  source={`service_page_${service.slug}`}
                />
              </div>

              {/* Service Highlights Box */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Guaranteed Standards</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct principal engagement with Aqsa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clean handoff and thorough documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Complete IP ownership on final delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
