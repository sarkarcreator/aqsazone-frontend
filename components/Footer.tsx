import React from 'react';
import { getServices } from '@/lib/db-queries';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MessageSquare,
  Linkedin,
  Instagram,
  Twitter,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  settings?: Record<string, string>;
}

export default async function Footer({ settings = {} }: FooterProps) {
  const services = await getServices({ publishedOnly: true });
  const collaborationEnabled = settings.collaboration_enabled !== 'false';
  const collaborationTitle = settings.collaboration_title || 'Professional Collaboration';
  const collaborationText =
    settings.collaboration_text ||
    'Aqsa also collaborates with Digital Solutions Hub on selected digital projects and services.';

  const email = settings.contact_email || 'hello@aqsazone.com';
  const phone = settings.contact_phone || '+1 (555) 019-2834';
  const whatsapp = settings.contact_whatsapp || '+15550192834';

  const linkedin = settings.social_linkedin || 'https://linkedin.com';
  const instagram = settings.social_instagram || 'https://instagram.com';
  const xUrl = settings.social_x || 'https://x.com';
  const tiktok = settings.social_tiktok || 'https://tiktok.com';

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collaboration Notice if enabled */}
        {collaborationEnabled && (
          <div className="mb-14 p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-indigo-950/30 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">{collaborationTitle}</h4>
                <p className="text-slate-400 text-xs sm:text-sm">{collaborationText}</p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-purple-300/80 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 shrink-0">
              Strategic Partnership
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <img
                src="/assets/aqsa-zone-logo.svg"
                alt="Aqsa Zone — Ideas | Design | Digital"
                width={240}
                height={60}
                loading="lazy"
                decoding="async"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Turning ideas into digital experiences. Dedicated to engineering high-performance web solutions, AI automation pipelines, and elevated brand identities for forward-looking clients worldwide.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-pink-600/20 border border-slate-800 hover:border-pink-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600/20 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-purple-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-300 transition-colors">
                  About Aqsa
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-purple-300 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-purple-300 transition-colors">
                  Portfolio & Work
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-purple-300 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-purple-300 transition-colors">
                  Client Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services from the published CMS catalogue */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((service: { id: number; name: string; slug: string }) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-purple-300 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              {services.length === 0 && (
                <li className="text-slate-500">No published services yet.</li>
              )}
            </ul>
          </div>

          {/* Col 5: Direct Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white truncate">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  WhatsApp Direct
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-purple-200"
                >
                  <span>Open Contact Form</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Aqsa Zone. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Privacy & Inquiries
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Panel / CRM</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
