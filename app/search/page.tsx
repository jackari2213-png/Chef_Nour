'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Utensils, Flame, Star, ChefHat } from 'lucide-react';
import { useApp } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';
import CategoryCard from '@/components/CategoryCard';
import { useTranslation } from '@/lib/useTranslation';

const POPULAR_SEARCHES = ['حريرة', 'شباكية', 'طجين', 'كرواسون', 'بسطيلة', 'مسمن', 'سلطة', 'كيك'];

function SearchResults() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { recipes, categories } = useApp();

    const results = query
        ? recipes.filter(r => {
            const q = query.toLowerCase();
            return (
                r.title_ar.toLowerCase().includes(q) ||
                r.description_ar.toLowerCase().includes(q) ||
                r.ingredients.some(i => i.item_ar.toLowerCase().includes(q))
            );
        })
        : [];

    const trending = [...recipes].sort((a, b) => b.views_count - a.views_count).slice(0, 6);
    const topRated = [...recipes].sort((a, b) => b.rating_avg - a.rating_avg).slice(0, 3);

    if (!query) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

                {/* Hero search bar */}
                <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-brand-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900">{t('search.title') || 'ابحثي عن وصفتك'}</h1>
                    <p className="text-sm text-gray-500 font-medium">ابحثي بالاسم، المكون، أو نوع الطبق</p>

                    {/* Popular searches */}
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {POPULAR_SEARCHES.map(term => (
                            <Link
                                key={term}
                                href={`/search?q=${encodeURIComponent(term)}`}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all shadow-sm"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <ChefHat className="w-5 h-5 text-brand-500" />
                            <h2 className="text-xl font-black text-gray-900">تصفح حسب التصنيف</h2>
                        </div>
                        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {categories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending */}
                {trending.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <Flame className="w-5 h-5 text-orange-500 fill-current" />
                            <h2 className="text-xl font-black text-gray-900">الأكثر مشاهدة</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trending.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                        </div>
                    </section>
                )}

                {/* Top Rated */}
                {topRated.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <Star className="w-5 h-5 text-amber-500 fill-current" />
                            <h2 className="text-xl font-black text-gray-900">الأعلى تقييماً</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topRated.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Search className="w-7 h-7 text-brand-500" />
                    {t('search.title') || 'نتائج البحث'} "{query}"
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                    {t('search.resultsCount', { count: results.length }) || `${results.length} نتيجة`}
                </p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {results.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                        <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">{t('search.noResults') || 'لا توجد نتائج'}</h3>
                        <p className="text-xs text-gray-500 mb-4">{t('search.noResultsDesc') || 'جربي كلمة بحث أخرى'}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {POPULAR_SEARCHES.map(term => (
                                <Link
                                    key={term}
                                    href={`/search?q=${encodeURIComponent(term)}`}
                                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-all"
                                >
                                    {term}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {trending.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-5 text-right">وصفات مقترحة</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trending.slice(0, 3).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    const { t } = useTranslation();
    return (
        <Suspense fallback={<div className="p-12 text-center text-sm font-bold">{t('common.loading')}</div>}>
            <SearchResults />
        </Suspense>
    );
}
