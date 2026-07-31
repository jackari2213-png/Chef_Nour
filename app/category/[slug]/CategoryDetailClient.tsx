'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowRight, Utensils } from 'lucide-react';
import { useApp } from '@/lib/store';
import type { Category } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import AnimatedSection from '@/components/AnimatedSection';
import { useTranslation } from '@/lib/useTranslation';

export default function CategoryDetailClient({ params, initialCategory }: { params: Promise<{ slug: string }>; initialCategory?: Category | null }) {
    const { slug } = use(params);
    const { recipes, categories } = useApp();
    const { t, getLocalizedField } = useTranslation();

    const category = initialCategory ?? categories.find(c => c.slug === slug) ?? categories[0];
    const categoryRecipes = recipes.filter(r => r.category_id === category.id || r.category_name_ar === category.name_ar);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Category Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 sm:p-12 shadow-xl border border-gray-800">
                <img
                    src={category.image_url}
                    alt={getLocalizedField(category, 'name')}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-gray-900/80 via-gray-900/40 to-transparent" />
                <div className="relative z-10 space-y-3 max-w-xl text-right">
                    <Link href="/recipes" className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:underline mb-2 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                        <span>{t('category.backAll')}</span>
                    </Link>
                    <h1 className="text-3xl sm:text-5xl font-black">
                        {getLocalizedField(category, 'name')}
                    </h1>
                    <p className="text-sm text-gray-200 font-medium">
                        {t('category.desc', { name: getLocalizedField(category, 'name') })}
                    </p>
                    <span className="inline-block text-xs font-extrabold bg-brand-500 text-white px-3 py-1 rounded-full">
                        {t('category.recipesIn', { count: categoryRecipes.length })}
                    </span>
                </div>
            </div>

            {/* Grid */}
            {categoryRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {categoryRecipes.map((recipe, idx) => (
                        <AnimatedSection key={recipe.id} delay={idx * 50}>
                            <RecipeCard recipe={recipe} />
                        </AnimatedSection>
                    ))}
                </div>
            ) : (
                <AnimatedSection className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-800">{t('category.noRecipes')}</h3>
                </AnimatedSection>
            )}

        </div>
    );
}
