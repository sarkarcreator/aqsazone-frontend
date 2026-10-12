import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getProjects, getSiteSettings } from '@/lib/db-queries';
import { FolderKanban, ArrowRight, BriefcaseBusiness, FileText } from 'lucide-react';
import { parseAqsaJuttProfile } from '@/lib/aqsa-profile';

export const revalidate = 30;

export default async function PortfolioPage() {
 const [projectsList, settings] = await Promise.all([getProjects({ publishedOnly: true }), getSiteSettings()]);
 const profile = parseAqsaJuttProfile(settings.aqsa_jutt_profile);
 return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
   <Navbar/>
   <main className="flex-1 pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <section className="max-w-3xl mb-12 space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider"><FolderKanban className="w-4 h-4"/> Portfolio & Professional Experience</div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Content that tells a story.</h1>
      <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Explore {profile.name}'s writing, script-writing, SEO article and video-content experience. Portfolio items and profile details are managed from the admin panel.</p>
     </section>
     {profile.published && <section className="mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-purple-300">Professional profile</p><h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{profile.name} <span className="text-purple-300">— {profile.title}</span></h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{profile.intro}</p></div><Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-white">About Me <ArrowRight className="w-4 h-4"/></Link></div>
      <div className="grid md:grid-cols-2 gap-5">{profile.experience.filter(e=>e.published).map(e=><article key={e.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-white">{e.company}</h3><p className="mt-1 text-sm font-semibold text-purple-300">{e.role}</p></div><BriefcaseBusiness className="w-5 h-5 text-purple-400 shrink-0"/></div><p className="mt-3 text-sm leading-relaxed text-slate-400">{e.description}</p><p className="mt-4 text-xs font-semibold text-slate-300">{e.duration}</p></article>)}</div>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"><h3 className="flex items-center gap-2 font-bold text-white"><FileText className="w-4 h-4 text-indigo-400"/> Core skills</h3><div className="mt-4 flex flex-wrap gap-2">{profile.skills.map((s,i)=><span key={s+i} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300">{s}</span>)}</div></div>
     </section>}
     <PortfolioGrid projects={projectsList} showFilters={true} title="Published Work & Projects" subtitle="Browse published work samples and project records."/>
    </div>
   </main>
   <Footer settings={settings}/>
  </div>
 );
}
