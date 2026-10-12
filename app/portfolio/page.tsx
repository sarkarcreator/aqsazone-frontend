import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getProjects, getSiteSettings } from '@/lib/db-queries';
import { FolderKanban, ArrowRight, BriefcaseBusiness, FileText, MessageCircle, PenLine, Search, Video } from 'lucide-react';
import { parseAqsaJuttProfile } from '@/lib/aqsa-profile';

export const metadata = {
 title: "Portfolio | Aqsa Jutt Content Writing & Video",
 description: "Explore Aqsa Jutt's professional experience in content writing, short-form scripts, SEO technology articles and video editing."
};

// Fetch profile settings and published projects at request time, not during Vercel's build.
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
 const [projectsList, settings] = await Promise.all([getProjects({ publishedOnly: true }), getSiteSettings()]);
 const profile = parseAqsaJuttProfile(settings.aqsa_jutt_profile);
 const experience = profile.experience.filter(item => item.published);
 const skills = profile.skills.filter(skill => skill.published && skill.name.trim());
 return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
   <Navbar/>
   <main className="flex-1 pt-28 sm:pt-32 pb-20 sm:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 p-7 sm:p-12 lg:p-16 mb-12">
      <div className="absolute -right-12 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"/>
      <div className="relative max-w-4xl">
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider"><FolderKanban className="w-4 h-4"/> Portfolio & Professional Experience</div>
       <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold text-white tracking-tight">Content that tells a story.</h1>
       <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-slate-300">Writing, scripts, SEO-focused technology articles and video content designed around the audience, platform and purpose. Explore my professional experience and the published work available below.</p>
       <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/contact?service=Content%20Writing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3.5 text-sm font-semibold text-white transition-colors">Discuss Your Project <MessageCircle className="w-4 h-4"/></Link>
        <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 hover:bg-slate-800 px-5 py-3.5 text-sm font-semibold text-white transition-colors">About {profile.name} <ArrowRight className="w-4 h-4"/></Link>
       </div>
      </div>
     </section>

     {profile.published && <section className="mb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
       <div><p className="text-xs uppercase tracking-widest font-bold text-purple-300">Professional profile</p><h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{profile.name} <span className="text-purple-300">— {profile.title}</span></h2><p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-400">{profile.intro}</p></div>
       <Link href="/contact?service=Content%20Writing" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-purple-300 hover:text-white">Work with me <ArrowRight className="w-4 h-4"/></Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
       <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><PenLine className="w-5 h-5 text-purple-300"/><h3 className="mt-3 font-bold text-white">Content & Copywriting</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Blogs, marketing copy and clear written content for digital platforms.</p></article>
       <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><Search className="w-5 h-5 text-indigo-300"/><h3 className="mt-3 font-bold text-white">SEO Tech Articles</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Research-based technology articles organized for readability and search relevance.</p></article>
       <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><Video className="w-5 h-5 text-pink-300"/><h3 className="mt-3 font-bold text-white">Scripts & Video Editing</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Short-form storytelling, social video scripts and edited video content.</p></article>
      </div>
      <div className="grid md:grid-cols-2 gap-5">{experience.map(e=><article key={e.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-white">{e.company}</h3><p className="mt-1 text-sm font-semibold text-purple-300">{e.role}</p></div><BriefcaseBusiness className="w-5 h-5 text-purple-400 shrink-0"/></div><p className="mt-3 text-sm leading-relaxed text-slate-400">{e.description}</p><p className="mt-4 text-xs font-semibold text-slate-300">{e.duration}</p></article>)}</div>
      {skills.length>0 && <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"><h3 className="flex items-center gap-2 font-bold text-white"><FileText className="w-4 h-4 text-indigo-400"/> Core skills</h3><div className="mt-4 flex flex-wrap gap-2">{skills.map(skill=><span key={skill.id} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300">{skill.name}</span>)}</div></div>}
     </section>}

     <section className="mb-12"><PortfolioGrid projects={projectsList} showFilters={true} title="Published Work & Projects" subtitle="Browse the work samples and project records that have been published for viewing."/></section>
     <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-slate-900 p-7 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div><p className="text-xs font-bold uppercase tracking-widest text-purple-300">Let&apos;s collaborate</p><h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Need content for your next idea?</h2><p className="mt-2 text-sm sm:text-base text-slate-300">Send the brief and goals to start a conversation about your project.</p></div>
      <Link href="/contact?service=Content%20Writing" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-purple-100 transition-colors">Request a Discussion <ArrowRight className="w-4 h-4"/></Link>
     </section>
    </div>
   </main>
   <Footer settings={settings}/>
  </div>
 );
}
