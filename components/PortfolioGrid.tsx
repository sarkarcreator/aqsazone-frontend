'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  Eye,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Video,
  FileText,
  Globe,
  Share2,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  clientName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  serviceName?: string | null;
  shortDescription: string;
  thumbnailUrl?: string | null;
  format: string;
  sourceType: string;
  isSourceVisible: boolean;
  isFeatured: boolean;
  projectDate?: string | null;
  liveUrl?: string | null;
  externalUrl?: string | null;
  tools?: string[] | null;
}

interface PortfolioGridProps {
  projects: ProjectItem[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
}

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'image':
      return <ImageIcon className="w-3.5 h-3.5" />;
    case 'video':
      return <Video className="w-3.5 h-3.5" />;
    case 'website':
      return <Globe className="w-3.5 h-3.5" />;
    case 'social_post':
      return <Share2 className="w-3.5 h-3.5" />;
    case 'written_work':
      return <FileText className="w-3.5 h-3.5" />;
    case 'case_study':
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    default:
      return <Layers className="w-3.5 h-3.5" />;
  }
};

const formatLabels: Record<string, string> = {
  all: 'All Formats',
  image: 'Images / Design',
  video: 'Video / Demo',
  website: 'Live Website',
  social_post: 'Social Media',
  written_work: 'Written Content',
  case_study: 'Case Study',
  multiple: 'Multi-Media',
};

export default function PortfolioGrid({
  projects,
  title = 'Featured Work & Client Projects',
  subtitle = 'Explore our portfolio of verified client deliverables, AI integrations, brand identities, and high-performance digital platforms.',
  showFilters = true,
  limit,
}: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.categoryName).filter(Boolean))) as string[];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== 'all' && p.categoryName !== selectedCategory) {
        return false;
      }
      if (selectedFormat !== 'all' && p.format !== selectedFormat) {
        return false;
      }
      if (selectedSource !== 'all' && p.sourceType !== selectedSource) {
        return false;
      }
      return true;
    });
  }, [projects, selectedCategory, selectedFormat, selectedSource]);

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filters Bar */}
        {showFilters && (
          <div className="space-y-4 mb-12">
            {/* Category Filter */}
            <div className="flex items-center justify-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Disciplines ({projects.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Format & Source Secondary Filters */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-1 border-t border-slate-900">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mr-1">
                Format:
              </span>
              {['all', 'image', 'video', 'website', 'written_work', 'case_study', 'multiple'].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                    selectedFormat === fmt
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                  }`}
                >
                  {getFormatIcon(fmt)}
                  <span>{formatLabels[fmt] || fmt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No projects found matching the filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category or format filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFormat('all');
                setSelectedSource('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-950/20 hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <Image
                  src={project.thumbnailUrl || '/images/project_dashboard.jpg'}
                  alt={project.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                    {getFormatIcon(project.format)}
                    <span>{formatLabels[project.format] || project.format}</span>
                  </span>

                  {project.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Year date pill */}
                {project.projectDate && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
                    {project.projectDate}
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Category & Client */}
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                    <span className="text-purple-400 font-medium">
                      {project.categoryName || 'Digital Solution'}
                    </span>
                    {project.clientName && (
                      <span className="text-slate-400">{project.clientName}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2.5">
                    <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                  </h3>

                  {/* Short description */}
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tools preview */}
                  {Array.isArray(project.tools) && project.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                          +{project.tools.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 group/link"
                  >
                    <span>View Project Case</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Visit Live URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA if limited */}
        {limit && projects.length > limit && (
          <div className="mt-12 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-sm shadow-md transition-all group"
            >
              <span>Explore All {projects.length} Portfolio Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
