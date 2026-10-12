import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/db-queries';
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Linkedin,
  Instagram,
  Twitter,
  MessageSquare,
  Compass,
  Cpu,
  Target,
} from 'lucide-react';

export const revalidate = 30;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const name = settings.about_name || 'Aqsa';
  const intro =
    settings.about_intro ||
    'A creative and results-driven digital specialist blending engineering discipline with design intuition.';
  const bio =
    settings.about_bio ||
    'I am a digital professional with a strong passion for helping entrepreneurs, growing brands, and modern enterprises translate ambitious ideas into tangible digital realities. With hands-on proficiency across modern web engineering, AI automation, high-impact brand aesthetics, and strategic growth campaigns, I deliver end-to-end solutions that look stunning and perform reliably.';
  const experience = settings.about_experience || '5+ Years of Industry Experience';
  const education =
    settings.about_education || 'B.S. in Computer Science & Interactive Multimedia';
  const careerFocus =
    settings.about_career_focus ||
    'Architecting resilient digital platforms, unlocking operational efficiency through AI automation, and crafting memorable brand identities.';
  const profileImage = settings.profile_image || '/images/aqsa_profile.jpg';

  let skills: string[] = [
    'Full-Stack Web Development',
    'AI Agents & Automation Workflows',
    'UI/UX & Brand Identity Systems',
    'Advanced SEO & Search Engine Dominance',
    'Social Media Architecture & Growth',
    'E-Commerce & Digital Merchandising',
    'Performance Ads & Conversion Funnels',
    'Executive & Team Digital Skills Training',
  ];

  try {
    if (settings.about_skills) {
      skills = JSON.parse(settings.about_skills);
    }
  } catch {
    // fallback
  }

  const collaborationEnabled = settings.collaboration_enabled !== 'false';
  const collaborationTitle = settings.collaboration_title || 'Professional Collaboration';
  const collaborationText =
    settings.collaboration_text ||
    'Aqsa also collaborates with Digital Solutions Hub on selected digital projects and services.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>About Aqsa Zone</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Designing & Engineering Meaningful Digital Experiences.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">{intro}</p>
          </div>

          {/* Profile & Biography Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            {/* Left Column: Portrait & Quick Stats */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
                <Image
                  src={profileImage}
                  alt={`Portrait of ${name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {name}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-purple-300">Independent Brand & Partner</p>
                  </div>
                  <Link
                    href="/contact"
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Quick credential cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <Briefcase className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Experience
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{experience}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <GraduationCap className="w-5 h-5 text-indigo-400 mb-2" />
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Education
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{education}</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Connect with Aqsa:</span>
                <div className="flex items-center gap-2">
                  {settings.social_linkedin && (
                    <a
                      href={settings.social_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {settings.social_instagram && (
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-pink-600/30 text-slate-300 hover:text-white transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.social_x && (
                    <a
                      href={settings.social_x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {settings.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Full Narrative & Core Philosophy */}
            <div className="lg:col-span-7 space-y-8">
              {/* Detailed Bio */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <span>The Background & Journey</span>
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 text-base">
                  <p>{bio}</p>
                  <p>
                    I operate with a simple conviction: technology should feel effortless, and design should inspire action. In an era where generic templates and disjointed agency handoffs cause friction, I bring an integrated approach that connects technical architecture directly with brand resonance.
                  </p>
                </div>
              </div>

              {/* Career Focus */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 border border-purple-500/20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">
                  <Target className="w-4 h-4" />
                  <span>Primary Career Focus</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {careerFocus}
                </p>
              </div>

              {/* Skills Arsenal */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Core Technical & Creative Competencies</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 hover:border-purple-500/40 hover:bg-slate-800 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Collaboration Note Section */}
              {collaborationEnabled && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    <span>{collaborationTitle}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Strategic Collaboration with Digital Solutions Hub (DSH)
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {collaborationText} While Aqsa Zone is my independent personal professional identity, I frequently partner with Digital Solutions Hub on complex enterprise initiatives, distributed web platforms, and large-scale digital transformations. This synergy gives clients the agility and personal dedication of a focused principal specialist, backed by collaborative enterprise depth when scale demands it.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Let&apos;s Work Together</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all"
                >
                  <span>View Completed Work</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
