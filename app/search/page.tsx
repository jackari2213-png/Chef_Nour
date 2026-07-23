'use client';

import React, { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Utensils } from 'lucide-react';
import { useApp } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { recipes } = useApp();

    const results = recipes.filter(r => {
        const q = query.toLowerCase();
        return (
            r.title_ar.toLowerCase().includes(q) ||
            r.description_ar.toLowerCase().includes(q) ||
            r.ingredients.some(i => i.item_ar.toLowerCase().includes(q))
        );
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Search className="w-7 h-7 text-brand-500" />
                    نتائج البحث عن: "{query}"
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                    تم العثور على {results.length} وصفة
                </p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {results.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800 mb-1">لم نعثر على نتائج مطابقة</h3>
                    <p className="text-xs text-gray-500">جربي استخدام كلمات بحث عامة مثل: دجاج، كيك، طاجين.</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-sm font-bold">جاري تحميل نتائج البحث...</div>}>
            <SearchResults />
        </Suspense>
    );
}
