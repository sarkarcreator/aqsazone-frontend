import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getSiteSettings } from '@/lib/db-queries';
import {
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Linkedin,
  Instagram,
  Twitter,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 30;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; project?: string }>;
}) {
  const { service, project } = await searchParams;
  const settings = await getSiteSettings();

  const email = settings.contact_email || 'hello@aqsazone.com';
  const phone = settings.contact_phone || '+1 (555) 019-2834';
  const whatsapp = settings.contact_whatsapp || '+15550192834';

  const linkedin = settings.social_linkedin || 'https://linkedin.com';
  const instagram = settings.social_instagram || 'https://instagram.com';
  const xUrl = settings.social_x || 'https://x.com';
  const tiktok = settings.social_tiktok || 'https://tiktok.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Initiate Inquiries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Let&apos;s Build Something Meaningful Together.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Have an upcoming product launch, AI automation need, brand identity refresh, or growth initiative? Tell us about your goals below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Cols: Contact Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Project Inquiry & Scope</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                All submissions enter our private CRM and receive direct personal review by Aqsa within 24 hours.
              </p>
              <ContactForm
                initialService={service}
                initialProject={project}
                source="contact_page"
              />
            </div>

            {/* Right 5 Cols: Direct Contact Channels & Availability */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Info Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white">Direct Communication</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block">Email</span>
                      <a href={`mailto:${email}`} className="text-white hover:text-purple-300 font-medium">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block">Telephone</span>
                      <a href={`tel:${phone}`} className="text-white hover:text-purple-300 font-medium">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold block">WhatsApp Direct</span>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <span>Chat via WhatsApp Business</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social media connections */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400 block mb-3 font-medium">Official Social Presence</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-purple-950/40 hover:border-purple-500/40 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-pink-950/40 hover:border-pink-500/40 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Promise Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 border border-purple-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span>Prompt Turnaround</span>
                </div>
                <h4 className="text-sm font-bold text-white">24-Hour Response Guarantee</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every inquiry is prioritized and reviewed personally. You will receive an initial feasibility assessment, questionnaire, or proposal call invite promptly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
