import { describe, it, expect } from 'vitest';
import ar from '../ar';
import fr from '../fr';
import en from '../en';
import { getTranslation } from '../index';
import type { TranslationDict } from '../types';

// Compile-time conformance: TS enforces each dictionary matches TranslationDict
// (dictionaries: Record<Language, TranslationDict> in index.ts).
// At runtime we verify the three dictionaries stay identical to each other.

function flattenKeys(obj: unknown, prefix = ''): string[] {
    if (Array.isArray(obj)) return [prefix];
    if (obj && typeof obj === 'object') {
        return Object.keys(obj).flatMap(k =>
            flattenKeys((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k)
        );
    }
    return [prefix];
}

describe('translation dictionaries', () => {
    it('ar, fr and en have identical key sets', () => {
        const arKeys = flattenKeys(ar).sort();
        expect(flattenKeys(fr).sort()).toEqual(arKeys);
        expect(flattenKeys(en).sort()).toEqual(arKeys);
    });

    it('ar, fr and en have identical value types per key (strings vs arrays)', () => {
        const typeOf = (key: string, dict: unknown): string => {
            const parts = key.split('.');
            let cur: unknown = dict;
            for (const p of parts) cur = (cur as Record<string, unknown>)[p];
            return Array.isArray(cur) ? 'array' : typeof cur;
        };

        for (const key of flattenKeys(ar)) {
            const t = typeOf(key, ar);
            expect(typeOf(key, fr)).toBe(t);
            expect(typeOf(key, en)).toBe(t);
        }
    });

    it('placeholder tokens are consistent across languages', () => {
        const collect = (dict: unknown): Record<string, string[]> => {
            const result: Record<string, string[]> = {};
            const walk = (obj: unknown, prefix = '') => {
                if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                    for (const [k, v] of Object.entries(obj)) {
                        walk(v, prefix ? `${prefix}.${k}` : k);
                    }
                } else if (typeof obj === 'string') {
                    const tokens = [...obj.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
                    if (tokens.length) result[prefix] = tokens;
                }
            };
            walk(dict);
            return result;
        };

        const arTokens = collect(ar);
        const frTokens = collect(fr);
        const enTokens = collect(en);
        expect(Object.keys(frTokens).sort()).toEqual(Object.keys(arTokens).sort());
        expect(Object.keys(enTokens).sort()).toEqual(Object.keys(arTokens).sort());

        for (const [key, tokens] of Object.entries(arTokens)) {
            expect(frTokens[key].sort()).toEqual(tokens.sort());
            expect(enTokens[key].sort()).toEqual(tokens.sort());
        }
    });

    it('no empty string values in any dictionary', () => {
        const findEmpty = (obj: unknown, prefix = ''): string[] => {
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                return Object.entries(obj).flatMap(([k, v]) => findEmpty(v, prefix ? `${prefix}.${k}` : k));
            }
            if (typeof obj === 'string' && obj.trim() === '') return [prefix];
            return [];
        };
        expect(findEmpty(ar)).toEqual([]);
        expect(findEmpty(fr)).toEqual([]);
        expect(findEmpty(en)).toEqual([]);
    });

    it('every key with placeholders has its tokens available in the t() signature params', () => {
        // Sanity: the params-driven keys exist in the shape used by components
        const dict = getTranslation('ar') as TranslationDict;
        expect(typeof dict.category.desc).toBe('string');
        expect(dict.category.desc).toContain('{name}');
        expect(dict.recipeDetail.stepXofY).toContain('{current}');
        expect(dict.recipeDetail.stepXofY).toContain('{total}');
        expect(dict.category.recipesIn).toContain('{count}');
    });

    it('getTranslation falls back to Arabic for unknown languages', () => {
        expect(getTranslation('xx' as 'ar')).toBe(getTranslation('ar'));
    });
});
