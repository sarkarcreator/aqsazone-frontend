'use client';


import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Code2,
  Palette,
  TrendingUp,
  Megaphone,
  Share2,
  ShoppingCart,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  shortDescription: string;
  categoryName?: string | null;
  categorySlug?: string | null;
  features: string[];
  sourceType: string;
  isFeatured: boolean;
}

interface ServicesGridProps {
  services: ServiceItem[];
  title?: string;
  subtitle?: string;
  showCategoryFilters?: boolean;
  limit?: number;
}

// Icon helper
const getServiceIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'bot':
      return <Bot className="w-6 h-6 text-purple-400" />;
    case 'code2':
    case 'code':
      return <Code2 className="w-6 h-6 text-indigo-400" />;
    case 'palette':
      return <Palette className="w-6 h-6 text-pink-400" />;
    case 'trendingup':
    case 'trending-up':
      return <TrendingUp className="w-6 h-6 text-emerald-400" />;
    case 'megaphone':
      return <Megaphone className="w-6 h-6 text-amber-400" />;
    case 'share2':
    case 'share':
      return <Share2 className="w-6 h-6 text-blue-400" />;
    case 'shoppingcart':
    case 'shopping-cart':
      return <ShoppingCart className="w-6 h-6 text-rose-400" />;
    case 'graduationcap':
    case 'graduation-cap':
      return <GraduationCap className="w-6 h-6 text-cyan-400" />;
    default:
      return <Sparkles className="w-6 h-6 text-purple-400" />;
  }
};

export default function ServicesGrid({
  services,
  title = 'Comprehensive Digital Solutions',
  subtitle = 'From autonomous AI agent pipelines to custom web platforms and brand identities, explore our core service offerings.',
  showCategoryFilters = true,
  limit,
}: ServicesGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Extract unique categories
  const categories = Array.from(
    new Set(services.map((s) => s.categoryName).filter(Boolean))
  ) as string[];

  const filteredServices = services
    .filter((s) => {
      if (activeCategory === 'all') return true;
      return s.categoryName === activeCategory;
    })
    .slice(0, limit || services.length);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Service Catalogue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        {showCategoryFilters && categories.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Services ({services.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-950/20 hover:-translate-y-1"
            >
              <div>
                {/* Header: Icon + Category Badge */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 transition-all">
                    {getServiceIcon(service.icon)}
                  </div>
                  {service.categoryName && (
                    <span className="text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                      {service.categoryName}
                    </span>
                  )}
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2.5">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {service.shortDescription}
                </p>

                {/* Features list */}
                {Array.isArray(service.features) && service.features.length > 0 && (
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-800/80">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      Key Highlights
                    </span>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom CTA Link */}
              <div className="pt-4 border-t border-slate-800/80">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 group/link"
                >
                  <span>Explore Service & Process</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA if limited */}
        {limit && services.length > limit && (
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all"
            >
              <span>View All 11 Digital Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
