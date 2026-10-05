import React from 'react';
import Image from 'next/image';
import { Star, Quote, Sparkles } from 'lucide-react';

interface TestimonialItem {
  id: number;
  clientName: string;
  position: string;
  company: string;
  avatarUrl?: string | null;
  testimonial: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  title?: string;
  subtitle?: string;
}

export default function TestimonialsSection({
  testimonials,
  title = 'Client Endorsements & Reviews',
  subtitle = 'Here is what founders, product leads, and executives say about partnering with Aqsa Zone.',
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Reputation & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between p-7 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl relative hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Top rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic relative z-10">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  {t.avatarUrl ? (
                    <Image
                      src={t.avatarUrl}
                      alt={t.clientName}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-sm">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                  <p className="text-xs text-slate-400">
                    {t.position} • <span className="text-purple-300">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
