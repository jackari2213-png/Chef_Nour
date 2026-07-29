import ar from './ar';
import fr from './fr';
import en from './en';
import type { Language } from '@/types';
import type { TranslationDict } from './types';

const dictionaries: Record<Language, TranslationDict> = { ar, fr, en };

export function getTranslation(lang: Language): TranslationDict {
  return dictionaries[lang] || dictionaries.ar;
}

export { type TranslationDict };
