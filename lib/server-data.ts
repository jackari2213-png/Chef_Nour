import { supabase, isSupabaseConfigured } from './supabase-client';
import { cookies } from 'next/headers';
import type { Recipe, Category } from '@/types';
import { MOCK_RECIPES, MOCK_CATEGORIES } from './mock-data';

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    if (!isSupabaseConfigured()) {
        return MOCK_RECIPES.find(r => r.slug === slug) || null;
    }

    const { data } = await supabase
        .from('recipes')
        .select('*, ingredients(*), steps(*)')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

    if (!data) return null;

    return {
        ...data,
        gallery_images: data.gallery_images || [],
        ingredients: (data.ingredients || []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)),
        steps: (data.steps || []).sort((a: any, b: any) => a.step_number - b.step_number),
    } as Recipe;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!isSupabaseConfigured()) {
        return MOCK_CATEGORIES.find(c => c.slug === slug) || null;
    }

    const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    return (data as Category) || null;
}

export async function getServerLanguage(): Promise<'ar' | 'fr' | 'en'> {
    const cookieStore = await cookies();
    const lang = cookieStore.get('chef_lang')?.value;
    return lang === 'fr' || lang === 'en' ? lang : 'ar';
}

export function localizedValue<T extends Record<string, any>>(item: T, field: string, lang: string): string {
    const langField = `${field}_${lang}` as keyof T;
    const arField = `${field}_ar` as keyof T;
    return (item[langField] as string) || (item[arField] as string) || '';
}

export function formatDuration(minutes: number): string {
    const safe = Math.max(0, Math.round(minutes || 0));
    return `PT${safe}M`;
}
