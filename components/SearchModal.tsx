'use client';


import { apiUrl } from '@/lib/api-client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, FolderKanban, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    projects: Array<{ id: number; title: string; slug: string; categoryName?: string; shortDescription: string }>;
    services: Array<{ id: number; name: string; slug: string; categoryName?: string; shortDescription: string }>;
  }>({ projects: [], services: [] });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ projects: [], services: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], services: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/search?q=${encodeURIComponent(query)}`));
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, services, technologies, skills..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to search across <span className="text-purple-300">Aqsa Zone</span> portfolio and service catalogue.
            </div>
          )}

          {query && !loading && results.projects.length === 0 && results.services.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results found for &ldquo;<span className="text-slate-200">{query}</span>&rdquo;. Try searching for &ldquo;AI&rdquo;, &ldquo;Web&rdquo;, &ldquo;Design&rdquo;, or &ldquo;SEO&rdquo;.
            </div>
          )}

          {/* Services Matches */}
          {results.services.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Services ({results.services.length})
              </div>
              <div className="space-y-1.5">
                {results.services.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-purple-950/30 border border-slate-800/80 hover:border-purple-500/40 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{s.shortDescription}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Matches */}
          {results.projects.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                Portfolio Projects ({results.projects.length})
              </div>
              <div className="space-y-1.5">
                {results.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/portfolio/${p.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{p.shortDescription}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to close</span>
          <div className="flex items-center gap-2">
            <span>Global search index</span>
          </div>
        </div>
      </div>
    </div>
  );
}
