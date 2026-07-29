'use client';

import { useCallback } from 'react';
import { useApp } from '@/lib/store';
import { getTranslation } from '@/lib/translations';
import type { TranslationDict } from '@/lib/translations';

function getNestedValue(obj: any, path: string): string | string[] | undefined {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') return acc[part];
    return undefined;
  }, obj);
}

export function useTranslation() {
  const { language } = useApp();
  const dict = getTranslation(language);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = getNestedValue(dict, key);
      if (value === undefined) return key;
      if (typeof value === 'object') return key;
      let str = value as string;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [dict]
  );

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const lang = language;
  const isRTL = language === 'ar';

  const getLocalizedField = useCallback(
    <T extends Record<string, any>>(item: T, field: string): string => {
      const langField = `${field}_${language}` as keyof T;
      const arField = `${field}_ar` as keyof T;
      return (item[langField] as string) || (item[arField] as string) || '';
    },
    [language]
  );

  return { t, dir, lang, language, isRTL, getLocalizedField };
}
