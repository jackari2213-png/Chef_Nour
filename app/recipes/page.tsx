'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Utensils } from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import RecipeCard from '@/components/RecipeCard';
import { Difficulty } from '@/types';

export default function RecipesPage() {
    const { recipes } = useApp();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'quickest'>('popular');
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

    // Filter & Sort Logic
    const filteredRecipes = useMemo(() => {
        return recipes.filter(rec => {
            // Category filter
            if (selectedCategory !== 'all' && rec.category_id !== selectedCategory && rec.category_name_ar !== selectedCategory) {
                return false;
            }
            // Difficulty filter
            if (selectedDifficulty !== 'all' && rec.difficulty !== selectedDifficulty) {
                return false;
            }
            // Search query filter
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Page Header */}
            <div className="text-right border-b border-gray-200 pb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
                    وصفات الشيف نور
                </h1>
                <p className="text-gray-500 font-medium text-sm sm:text-base">
                    تصفحي مئات الوصفات الناجحة والمجربة 100% بمقادير مضبوطة وخطوات واضحة
                </p>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="ابحثي عن اسم الوصفة أو المكون..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pr-4 pl-10 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Desktop Categories Horizontal Pill Filter */}
                <div className="hidden lg:flex items-center gap-2 overflow-x-auto max-w-xl no-scrollbar py-1">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${selectedCategory === 'all' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        الكل ({recipes.length})
                    </button>
                    {MOCK_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${selectedCategory === cat.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {cat.name_ar}
                        </button>
                    ))}
                </div>

                {/* Sort & Mobile Filter Toggle */}
                <div className="flex items-center justify-between w-full md:w-auto gap-3">

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setMobileFilterOpen(true)}
                        className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>التصفية</span>
                    </button>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:inline" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-brand-500"
                        >
                            <option value="popular">الأكثر مشاهدة</option>
                            <option value="rating">الأعلى تقييماً</option>
                            <option value="newest">الأحدث</option>
                            <option value="quickest">الأسرع تحضيراً</option>
                        </select>
                    </div>

                </div>

            </div>

            {/* Main Results Grid */}
            {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-12">
                    <div className="w-16 h-16 bg-orange-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">لم نجد أي وصفة تطابق بحثك</h3>
                    <p className="text-xs text-gray-500 font-medium mb-6">جربي التفتيش عن كلمات أخرى أو إلغاء تصفية البحث.</p>
                    <button
                        onClick={() => {
                            setSelectedCategory('all');
                            setSelectedDifficulty('all');
                            setSearchQuery('');
                        }}
                        className="bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors"
                    >
                        إعادة ضبط الفلاتر
                    </button>
                </div>
            )}

            {/* Mobile Filters Bottom Sheet */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-0 lg:hidden">
                    <div className="bg-white w-full rounded-t-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300">

                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-brand-500" />
                                تصفية الوصفات
                            </h3>
                            <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3">الفئة:</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`p-2.5 rounded-xl text-xs font-bold ${selectedCategory === 'all' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    الكل
                                </button>
                                {MOCK_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`p-2.5 rounded-xl text-xs font-bold ${selectedCategory === cat.id ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {cat.name_ar}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-3">مستوى الصعوبة:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['all', 'easy', 'medium', 'hard'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        className={`p-2.5 rounded-xl text-xs font-bold ${selectedDifficulty === diff ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {diff === 'all' ? 'الكل' : diff === 'easy' ? 'سهل' : diff === 'medium' ? 'متوسط' : 'صعب'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setMobileFilterOpen(false)}
                            className="w-full bg-brand-500 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-orange-glow"
                        >
                            عرض النتائج ({filteredRecipes.length})
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}
