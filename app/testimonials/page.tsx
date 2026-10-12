import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import { getTestimonials, getSiteSettings } from '@/lib/db-queries';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 30;

export default async function TestimonialsPage() {
  const [testimonialsList, settings] = await Promise.all([
    getTestimonials({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Verified Testimonials</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              What Our Partners & Clients Say.
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              We take pride in building lasting professional relationships through proactive communication, engineering rigor, and pristine visual delivery.
            </p>
          </div>

          <TestimonialsSection
            testimonials={testimonialsList}
            title=""
            subtitle=""
          />

          {/* Bottom Call to Action */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-white">Experience the Aqsa Zone Standard</h3>
            <p className="text-slate-400 text-sm">
              Let&apos;s turn your digital project into our next featured success story.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
