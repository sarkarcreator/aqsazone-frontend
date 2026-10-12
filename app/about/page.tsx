import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/db-queries';
import { parseAqsaJuttProfile } from '@/lib/aqsa-profile';
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPin, Languages, Sparkles } from 'lucide-react';

export const revalidate = 30;

export default async function AboutPage() {
 const settings = await getSiteSettings();
 const profile = parseAqsaJuttProfile(settings.aqsa_jutt_profile);
 return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
   <Navbar />
   <main className="flex-1 pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     {!profile.published ? (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center"><h1 className="text-3xl font-bold">Profile temporarily unavailable</h1></section>
     ) : <>
      <section className="max-w-4xl mb-12">
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider"><Sparkles className="w-4 h-4"/> About Me</div>
       <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-white">{profile.name}</h1>
       <p className="mt-3 text-xl sm:text-2xl font-semibold text-purple-300">{profile.title}</p>
       <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">{profile.intro}</p>
       {profile.location && <p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><MapPin className="w-4 h-4 text-purple-400"/>{profile.location}</p>}
       <div className="mt-6"><Link href="/portfolio" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-sm font-semibold text-white">View Portfolio <ArrowRight className="w-4 h-4"/></Link></div>
      </section>
      <section className="grid lg:grid-cols-2 gap-6">
       <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><BriefcaseBusiness className="w-5 h-5 text-purple-400"/> Experience</h2>
        <div className="mt-6 space-y-5">{profile.experience.filter(e=>e.published).map(e=><article key={e.id} className="border-l-2 border-purple-500/60 pl-4"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-bold text-white">{e.company}</h3><span className="text-xs rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-200">{e.duration}</span></div><p className="mt-1 text-sm font-medium text-purple-300">{e.role}</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{e.description}</p></article>)}</div>
       </div>
       <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Sparkles className="w-5 h-5 text-indigo-400"/> Skills</h2><div className="mt-5 flex flex-wrap gap-2">{profile.skills.map((skill,i)=><span key={skill+i} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">{skill}</span>)}</div></div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Languages className="w-5 h-5 text-indigo-400"/> Languages</h2><div className="mt-5 grid sm:grid-cols-2 gap-3">{profile.languages.filter(l=>l.published).map(l=><div key={l.id} className="rounded-xl bg-slate-950 border border-slate-800 p-4"><p className="font-semibold text-white">{l.name}</p><p className="mt-1 text-sm text-slate-400">{l.level}</p></div>)}</div></div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><GraduationCap className="w-5 h-5 text-indigo-400"/> Education</h2><div className="mt-5 space-y-4">{profile.education.filter(e=>e.published).map(e=><div key={e.id} className="flex gap-3 border-b border-slate-800 pb-4 last:border-0"><div className="min-w-16 text-sm font-bold text-purple-300">{e.year}</div><div><p className="font-semibold text-white">{e.degree}</p><p className="mt-1 text-sm text-slate-400">{e.institution}</p></div></div>)}</div></div>
       </div>
      </section>
     </>}
    </div>
   </main>
   <Footer settings={settings}/>
  </div>
 );
}
