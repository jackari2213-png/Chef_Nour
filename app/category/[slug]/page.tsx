'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowRight, Utensils } from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import RecipeCard from '@/components/RecipeCard';

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { recipes } = useApp();

    const category = MOCK_CATEGORIES.find(c => c.slug === slug) || MOCK_CATEGORIES[0];
    const categoryRecipes = recipes.filter(r => r.category_id === category.id || r.category_name_ar === category.name_ar);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Category Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 sm:p-12 shadow-xl border border-gray-800">
                <img
                    src={category.image_url}
                    alt={category.name_ar}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="relative z-10 space-y-3 max-w-xl text-right">
                    <Link href="/recipes" className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:underline mb-2">
                        <ArrowRight className="w-4 h-4" />
                        <span>العودة لجميع الوصفات</span>
                    </Link>
                    <h1 className="text-3xl sm:text-5xl font-black">{category.name_ar}</h1>
                    <p className="text-sm text-gray-200 font-medium">
                        استكشفي أحدث وأشهى وصفات قسم {category.name_ar} المضمونة والمجربة من مطبخ الشيف نور.
                    </p>
                    <span className="inline-block text-xs font-extrabold bg-brand-500 text-white px-3 py-1 rounded-full">
                        {categoryRecipes.length} وصفة متاحة
                    </span>
                </div>
            </div>

            {/* Grid */}
            {categoryRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {categoryRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-800">لا توجد وصفات حالياً في هذا القسم</h3>
                </div>
            )}

        </div>
    );
}
