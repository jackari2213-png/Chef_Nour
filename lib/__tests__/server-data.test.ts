import { describe, it, expect } from 'vitest';
import { formatDuration, localizedValue } from '../server-data';
import { getTranslation } from '../translations';

describe('formatDuration', () => {
    it('formats minutes as ISO 8601 durations', () => {
        expect(formatDuration(0)).toBe('PT0M');
        expect(formatDuration(45)).toBe('PT45M');
        expect(formatDuration(90)).toBe('PT90M');
    });

    it('handles invalid inputs safely', () => {
        expect(formatDuration(-5)).toBe('PT0M');
        expect(formatDuration(undefined as unknown as number)).toBe('PT0M');
    });
});

describe('localizedValue', () => {
    const item = { title_ar: 'طاجين', title_fr: 'Tajine', title_en: 'Tagine' };

    it('picks the requested language', () => {
        expect(localizedValue(item, 'title', 'ar')).toBe('طاجين');
        expect(localizedValue(item, 'title', 'fr')).toBe('Tajine');
        expect(localizedValue(item, 'title', 'en')).toBe('Tagine');
    });

    it('falls back to Arabic when the language field is missing', () => {
        expect(localizedValue({ title_ar: 'كسكس' }, 'title', 'en')).toBe('كسكس');
    });

    it('returns empty string when nothing is available', () => {
        expect(localizedValue({} as Record<string, unknown>, 'title', 'ar')).toBe('');
    });
});

describe('getTranslation', () => {
    it('returns the requested dictionary', () => {
        expect(getTranslation('ar').nav.home).toBeTruthy();
        expect(getTranslation('fr').nav.home).toBeTruthy();
        expect(getTranslation('en').nav.home).toBeTruthy();
    });

    it('falls back to Arabic for unknown languages', () => {
        expect(getTranslation('xx' as 'ar')).toBe(getTranslation('ar'));
    });
});
