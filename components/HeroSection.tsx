'use client';


import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, Award, Briefcase, Zap, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  settings?: Record<string, string>;
  onOpenInquiry?: () => void;
}

export default function HeroSection({ settings = {}, onOpenInquiry }: HeroSectionProps) {
  const heroTitle = settings.hero_title || "Hi, I'm Aqsa";
  const heroSubtitle = settings.hero_subtitle || 'Digital Professional & Creative Problem Solver';
  const heroTagline = settings.hero_tagline || 'Turning Ideas Into Digital Experiences';
  const heroDescription =
    settings.hero_description ||
    'I help businesses, brands and individuals build their digital presence through creative, technical and digital solutions.';
  const primaryCta = settings.hero_primary_cta || 'View My Work';
  const secondaryCta = settings.hero_secondary_cta || "Let's Work Together";
  const profileImage = settings.profile_image || '/images/aqsa_profile.jpg';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/20 via-indigo-900/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{heroTagline}</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {heroTitle}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-300 bg-clip-text text-transparent">
                {heroSubtitle}
              </h2>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/portfolio"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {onOpenInquiry ? (
                <button
                  type="button"
                  onClick={onOpenInquiry}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{secondaryCta}</span>
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{secondaryCta}</span>
                </Link>
              )}
            </div>

            {/* Trust Metrics Pills */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="text-2xl font-extrabold text-white">5+</div>
                <div className="text-xs text-slate-400">Years Experience</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-purple-400">100%</div>
                <div className="text-xs text-slate-400">Client Delivery</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-indigo-400">11+</div>
                <div className="text-xs text-slate-400">Digital Disciplines</div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-84 md:w-96 aspect-square">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-pink-500/30 blur-xl opacity-75" />

              {/* Card Container */}
              <div className="relative w-full h-full rounded-3xl bg-slate-900 p-2.5 border border-slate-800 shadow-2xl overflow-hidden group">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                  <Image
                    src={profileImage}
                    alt="Aqsa - Digital Professional & Creative Problem Solver"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Bottom badge on photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        Aqsa
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-purple-300">Available for Select Projects</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Floating feature pills */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-white shadow-xl">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="font-medium">AI & Web Solutions</span>
              </div>

              <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-white shadow-xl">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">Direct & Strategic DSH Collabs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
