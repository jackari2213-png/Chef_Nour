'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Utensils, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';

export default function FavoritesPage() {
    const { favorites, recipes } = useApp();
    const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Header */}
            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Heart className="w-7 h-7 text-red-500 fill-current" />
                    وصفاتي المفضلة المحفوظة
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                    {favoriteRecipes.length} وصفة محفوظة في قائمتك الشخصية
                </p>
            </div>

            {/* Grid */}
            {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {favoriteRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800 mb-1">لم تقومي بحفظ أي وصفة بعد</h3>
                    <p className="text-xs text-gray-500 mb-6">انقري على أيقونة القلب في أي كارت وصفة لنقلها فوراً هنا.</p>
                    <Link
                        href="/recipes"
                        className="bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors"
                    >
                        استكشفي الوصفات الآن
                    </Link>
                </div>
            )}

        </div>
    );
}
