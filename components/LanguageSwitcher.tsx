'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useApp } from '@/lib/store';
import type { Language } from '@/types';

const languages: { code: Language; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = React.useState(false);
  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-xl bg-gray-100/80 hover:bg-brand-50 hover:text-brand-600 border border-gray-200/60 text-gray-700 transition-all text-xs font-bold shadow-xs"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-500" />
        <span className="text-[11px] font-extrabold uppercase">{current.code}</span>
        <span className="text-[10px] text-gray-400">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 min-w-[130px] animate-in fade-in slide-in-from-top-2 duration-150">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className={`w-full text-right px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between gap-2 ${language === l.code
                    ? 'text-brand-600 bg-brand-50/80 font-black'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span>{l.label}</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono">{l.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
