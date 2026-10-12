import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/db-queries';
import { parseAqsaJuttProfile } from '@/lib/aqsa-profile';
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPin, Languages, Sparkles, MessageCircle, PenLine, Search, Video } from 'lucide-react';

export const metadata = {
 title: "About Aqsa Jutt | Content Writer & Script Writer",
 description: "Meet Aqsa Jutt, a content writer, script writer, SEO tech article writer and video editor based in Faisalabad. Explore skills, experience and education."
};

export const revalidate = 30;

export default async function AboutPage() {
 const settings = await getSiteSettings();
 const profile = parseAqsaJuttProfile(settings.aqsa_jutt_profile);
 const skills = profile.skills.filter(skill => skill.published && skill.name.trim());
 const experience = profile.experience.filter(item => item.published);
 const education = profile.education.filter(item => item.published);
 const languages = profile.languages.filter(item => item.published);
 return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
   <Navbar />
   <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     {!profile.published ? (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center"><h1 className="text-3xl font-bold">Profile temporarily unavailable</h1></section>
     ) : <>
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/50 p-7 sm:p-12 lg:p-16 mb-8">
       <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"/>
       <div className="relative max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider"><Sparkles className="w-4 h-4"/> About Me · Professional Profile</div>
        <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-white">{profile.name}</h1>
        <p className="mt-3 text-xl sm:text-2xl font-semibold text-purple-300">{profile.title} <span className="text-slate-500">|</span> Script Writer <span className="text-slate-500">|</span> Video Editor</p>
        <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-slate-300">{profile.intro}</p>
        {profile.location && <p className="mt-5 flex items-center gap-2 text-sm text-slate-400"><MapPin className="w-4 h-4 text-purple-400"/>{profile.location}</p>}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
         <Link href="/contact?service=Content%20Writing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3.5 text-sm font-semibold text-white transition-colors">Discuss a Project <MessageCircle className="w-4 h-4"/></Link>
         <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 hover:bg-slate-800 px-5 py-3.5 text-sm font-semibold text-white transition-colors">Explore Portfolio <ArrowRight className="w-4 h-4"/></Link>
        </div>
       </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mb-10">
       <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><PenLine className="w-5 h-5 text-purple-300"/><h2 className="mt-3 font-bold text-white">Content & Copywriting</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">Clear, audience-focused writing for articles, blogs and marketing content.</p></div>
       <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><Search className="w-5 h-5 text-indigo-300"/><h2 className="mt-3 font-bold text-white">SEO Tech Articles</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">Research-led technology content structured with search intent in mind.</p></div>
       <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><Video className="w-5 h-5 text-pink-300"/><h2 className="mt-3 font-bold text-white">Scripts & Video Editing</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">Short-form scripts and edited videos shaped for digital audiences.</p></div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
       <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><BriefcaseBusiness className="w-5 h-5 text-purple-400"/> Experience</h2>
        <div className="mt-6 space-y-6">{experience.map(e=><article key={e.id} className="border-l-2 border-purple-500/60 pl-4"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-bold text-white">{e.company}</h3><span className="text-xs rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-200">{e.duration}</span></div><p className="mt-1 text-sm font-medium text-purple-300">{e.role}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{e.description}</p></article>)}</div>
       </div>
       <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Sparkles className="w-5 h-5 text-indigo-400"/> Skills</h2><div className="mt-5 flex flex-wrap gap-2">{skills.map(skill=><span key={skill.id} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">{skill.name}</span>)}</div></div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Languages className="w-5 h-5 text-indigo-400"/> Languages</h2><div className="mt-5 grid sm:grid-cols-2 gap-3">{languages.map(l=><div key={l.id} className="rounded-xl bg-slate-950 border border-slate-800 p-4"><p className="font-semibold text-white">{l.name}</p><p className="mt-1 text-sm text-slate-400">{l.level}</p></div>)}</div></div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><GraduationCap className="w-5 h-5 text-indigo-400"/> Education</h2><div className="mt-5 space-y-4">{education.map(e=><div key={e.id} className="flex gap-3 border-b border-slate-800 pb-4 last:border-0"><div className="min-w-16 text-sm font-bold text-purple-300">{e.year}</div><div><p className="font-semibold text-white">{e.degree}</p><p className="mt-1 text-sm text-slate-400">{e.institution}</p></div></div>)}</div></div>
       </div>
      </section>
      <section className="mt-10 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-slate-900 p-7 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
       <div><h2 className="text-2xl sm:text-3xl font-bold text-white">Have a content project in mind?</h2><p className="mt-2 text-sm sm:text-base text-slate-300">Share your brief, audience and goals to discuss the right content approach.</p></div>
       <Link href="/contact?service=Content%20Writing" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-purple-100 transition-colors">Start a Conversation <ArrowRight className="w-4 h-4"/></Link>
      </section>
     </>}
    </div>
   </main>
   <Footer settings={settings}/>
  </div>
 );
}
