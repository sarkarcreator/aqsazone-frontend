'use client';


import React from 'react';
import { X, Sparkles } from 'lucide-react';
import ContactForm from './ContactForm';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialProject?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  initialService,
  initialProject,
}: InquiryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Direct Inquiry</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Let&apos;s Build Something Meaningful Together.
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Fill out the brief details below and Aqsa will review your scope promptly.
          </p>
        </div>

        {/* Form */}
        <ContactForm
          initialService={initialService}
          initialProject={initialProject}
          source="modal"
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
