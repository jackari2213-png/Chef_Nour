'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Utensils, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';
import AnimatedSection from '@/components/AnimatedSection';
import { useTranslation } from '@/lib/useTranslation';

const PAGE_SIZE = 12;

export default function RecipesPage() {
    const { recipes, categories } = useApp();
    const { t, getLocalizedField } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'quickest'>('popular');
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filteredRecipes = useMemo(() => {
        // Reset visible count when filters change
        return recipes.filter(rec => {
            if (selectedCategory !== 'all' && rec.category_id !== selectedCategory && rec.category_name_ar !== selectedCategory) {
                return false;
            }
            if (selectedDifficulty !== 'all' && rec.difficulty !== selectedDifficulty) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const titleMatch = rec.title_ar.toLowerCase().includes(q);
                const descMatch = rec.description_ar.toLowerCase().includes(q);
                const ingMatch = rec.ingredients.some(i => i.item_ar.toLowerCase().includes(q));
                if (!titleMatch && !descMatch && !ingMatch) return false;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'popular') return b.views_count - a.views_count;
            if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === 'quickest') return (a.prep_time_minutes + a.cook_time_minutes) - (b.prep_time_minutes + b.cook_time_minutes);
            return 0;
        });
    }, [recipes, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

    const visibleRecipes = filteredRecipes.slice(0, visibleCount);
    const hasMore = visibleCount < filteredRecipes.length;
    const activeFilters = selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery.trim() !== '';

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedDifficulty('all');
        setSearchQuery('');
        setVisibleCount(PAGE_SIZE);
    };

    const handleCategoryChange = (id: string) => {
        setSelectedCategory(id);
        setVisibleCount(PAGE_SIZE);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            <div className="text-right border-b border-gray-200 pb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
                    {t('recipes.title')}
                </h1>
                <p className="text-gray-500 font-medium text-sm sm:text-base">
                    {t('recipes.subtitle')}
                </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(''); setVisibleCount(PAGE_SIZE); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="hidden lg:flex items-center gap-2 overflow-x-auto max-w-xl no-scrollbar py-1">
                    <button
                        onClick={() => handleCategoryChange('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all btn-tap ${selectedCategory === 'all' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('recipes.filterAll')} ({recipes.length})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all btn-tap ${selectedCategory === cat.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {getLocalizedField(cat, 'name')}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-3">
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all btn-tap"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>{t('recipes.filterCategory')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:inline" />
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value as any); setVisibleCount(PAGE_SIZE); }}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-brand-500 transition-all"
                        >
                            <option value="popular">{t('recipes.sortPopular')}</option>
                            <option value="rating">{t('recipes.sortRating')}</option>
                            <option value="newest">{t('recipes.sortNewest')}</option>
                            <option value="quickest">{t('recipes.sortQuickest')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            {filteredRecipes.length > 0 && (
                <p className="text-xs text-gray-400 font-bold text-right">
                    {visibleRecipes.length} / {filteredRecipes.length} وصفة
                </p>
            )}

            {filteredRecipes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {visibleRecipes.map((recipe, idx) => (
                            <AnimatedSection key={recipe.id} delay={idx * 50}>
                                <RecipeCard recipe={recipe} />
                            </AnimatedSection>
                        ))}
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                                className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-brand-400 text-gray-800 hover:text-brand-600 font-extrabold text-sm px-8 py-3.5 rounded-2xl transition-all hover:shadow-md btn-tap"
                            >
                                <ChevronDown className="w-4 h-4" />
                                <span>عرض المزيد ({filteredRecipes.length - visibleCount} متبقية)</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <AnimatedSection className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12">
                    <div className="w-16 h-16 bg-orange-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('recipes.noRecipes')}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-6">{t('common.noResults')}</p>
                    {activeFilters && (
                        <button
                            onClick={resetFilters}
                            className="bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-all btn-tap inline-flex items-center gap-2"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>{t('recipes.filterAll')}</span>
                        </button>
                    )}
                </AnimatedSection>
            )}

            {mobileFilterOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 lg:hidden">
                    <div className="bg-white w-full rounded-t-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-brand-500" />
                                {t('recipes.filterAll')}
                            </h3>
                            <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3">{t('recipes.filterCategory')}:</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => { handleCategoryChange('all'); setMobileFilterOpen(false); }}
                                    className={`p-2.5 rounded-xl text-xs font-bold transition-all btn-tap ${selectedCategory === 'all' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {t('recipes.filterAll')}
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { handleCategoryChange(cat.id); setMobileFilterOpen(false); }}
                                        className={`p-2.5 rounded-xl text-xs font-bold transition-all btn-tap ${selectedCategory === cat.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {getLocalizedField(cat, 'name')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3">{t('recipes.filterDifficulty')}:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['all', 'easy', 'medium', 'hard'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => { setSelectedDifficulty(diff); setVisibleCount(PAGE_SIZE); }}
                                        className={`p-2.5 rounded-xl text-xs font-bold transition-all btn-tap ${selectedDifficulty === diff ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {diff === 'all' ? t('recipes.filterAll') : diff === 'easy' ? t('recipes.easy') : diff === 'medium' ? t('recipes.medium') : t('recipes.hard')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileFilterOpen(false)}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-orange-glow transition-all btn-tap"
                        >
                            {t('recipes.showResults')} ({filteredRecipes.length})
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
