'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Utensils, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';
import AnimatedSection from '@/components/AnimatedSection';
import { useTranslation } from '@/lib/useTranslation';

export default function FavoritesPage() {
    const { favorites, recipes } = useApp();
    const { t } = useTranslation();
    const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Header */}
            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Heart className="w-7 h-7 text-red-500 fill-current" />
                    {t('favorites.title')}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                    {t('favorites.subtitle', { count: favoriteRecipes.length })}
                </p>
            </div>

            {/* Grid */}
            {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {favoriteRecipes.map((recipe, idx) => (
                        <AnimatedSection key={recipe.id} delay={idx * 50}>
                            <RecipeCard recipe={recipe} />
                        </AnimatedSection>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-red-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('favorites.empty')}</h3>
                    <p className="text-xs text-gray-500 mb-6">{t('favorites.emptyDesc')}</p>
                    <Link
                        href="/recipes"
                        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all btn-tap"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('favorites.browse')}</span>
                    </Link>
                </div>
            )}

        </div>
    );
}
