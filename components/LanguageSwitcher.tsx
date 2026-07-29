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

  if (compact) {
    return (
      <div className="flex gap-1">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
              language === l.code
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-brand-600 transition-colors text-xs font-bold"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find((l) => l.code === language)?.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[120px]">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLanguage(l.code); setOpen(false); }}
              className={`w-full text-right px-4 py-2 text-xs font-bold transition-colors ${
                language === l.code
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
