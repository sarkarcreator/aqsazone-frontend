'use client';


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import SearchModal from './SearchModal';
import { apiUrl } from '@/lib/api-client';

interface NavbarProps {
  onOpenInquiry?: (serviceName?: string, projectName?: string) => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [services, setServices] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep service navigation connected to the same published CMS catalogue as the footer.
  useEffect(() => {
    let cancelled = false;

    const loadPublishedServices = async () => {
      try {
        const response = await fetch(apiUrl('/api/services?admin=false'));
        if (!response.ok) throw new Error(`Services request failed: ${response.status}`);
        const data = await response.json();
        if (!cancelled) {
          const published = Array.isArray(data.services) ? data.services : [];
          setServices(
            published.filter(
              (service: { id?: unknown; name?: unknown; slug?: unknown; isPublished?: unknown }) =>
                typeof service.id === 'number' &&
                typeof service.name === 'string' &&
                typeof service.slug === 'string' &&
                service.isPublished !== false
            )
          );
        }
      } catch (error) {
        console.error('Failed to load published navigation services:', error);
      }
    };

    loadPublishedServices();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keyboard shortcut Ctrl/Cmd + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors"
            >
              <img
                src="/assets/aqsa-zone-logo.svg"
                alt="Aqsa Zone — Ideas | Design | Digital"
                width={240}
                height={60}
                fetchPriority="high"
                decoding="async"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href === '/services' && pathname.startsWith('/services/'));

                if (link.href === '/services') {
                  return (
                    <div key={link.href} className="group relative">
                      <Link
                        href="/services"
                        prefetch={true}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white bg-purple-600/25 border border-purple-500/30 shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        Services
                        <span aria-hidden="true" className="text-[10px] opacity-70">▾</span>
                      </Link>
                      <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 translate-y-1 rounded-2xl border border-slate-800 bg-slate-950/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <Link
                          href="/services"
                          prefetch={true}
                          className="block rounded-xl px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-slate-900"
                        >
                          View All Services
                        </Link>
                        <div className="my-1 border-t border-slate-800" />
                        <div className="max-h-80 overflow-y-auto">
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.slug}`}
                              prefetch={true}
                              className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                                pathname === `/services/${service.slug}`
                                  ? 'bg-purple-600/20 text-purple-200'
                                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                              }`}
                            >
                              {service.name}
                            </Link>
                          ))}
                          {services.length === 0 && (
                            <p className="px-3 py-2 text-xs text-slate-500">
                              No published services available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white bg-purple-600/25 border border-purple-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                title="Search portfolio & services (Cmd+K)"
              >
                <Search className="w-4 h-4 text-purple-400" />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700 text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Inquire CTA Button */}
              {onOpenInquiry ? (
                <button
                  type="button"
                  onClick={() => onOpenInquiry()}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Let&apos;s Talk</span>
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Let&apos;s Talk</span>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href === '/services' && pathname.startsWith('/services/'));
                return (
                  <React.Fragment key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.href === '/services' && services.length > 0 && (
                      <div className="ml-4 mb-2 flex flex-col gap-1 border-l border-slate-800 pl-3">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            prefetch={true}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                              pathname === `/services/${service.slug}`
                                ? 'text-purple-300 bg-purple-600/10'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center font-medium flex items-center justify-center gap-2"
                >
                  <span>Let&apos;s Work Together</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-center text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Panel / CRM Login</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
