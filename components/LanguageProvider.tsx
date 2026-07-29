'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/store';

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useApp();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return <>{children}</>;
}
