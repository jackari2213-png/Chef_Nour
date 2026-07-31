'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { useTranslation } from '@/lib/useTranslation';

import { useApp } from '@/lib/store';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const { t, getLocalizedField } = useTranslation();
    const { recipes } = useApp();
    const [imgLoaded, setImgLoaded] = useState(false);

    const realCount = recipes.filter(
        r => r.category_id === category.id ||
            r.category_name_ar === category.name_ar ||
            (category.slug === 'ramadan' && (r.category_name_ar === 'رمضان' || r.category_id === 'cat-3'))
    ).length;

    const displayCount = realCount > 0 ? realCount : category.recipe_count;

    return (
        <Link
            href={`/category/${category.slug}`}
            className="group relative flex flex-col items-center min-w-[115px] max-w-[135px] p-4 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100/80 shadow-sm hover:shadow-lg hover:border-brand-200/60 hover:bg-white transition-all duration-300 text-center"
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative shadow-sm ring-2 ring-transparent group-hover:ring-brand-500/60 group-hover:shadow-md group-hover:shadow-brand-500/10 transition-all duration-300">
                {!imgLoaded && (
                    <div className="absolute inset-0 skeleton-shimmer" />
                )}
                <img
                    src={category.image_url}
                    alt={getLocalizedField(category, 'name')}
                    className={`w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'} group-hover:scale-110`}
                    onLoad={() => setImgLoaded(true)}
                    loading="lazy"
                />
            </div>

            <span className="font-extrabold text-xs text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                {getLocalizedField(category, 'name')}
            </span>

            <span className="text-[11px] font-semibold text-gray-400 bg-gray-50/80 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:font-extrabold px-2.5 py-0.5 rounded-full transition-all">
                {displayCount} {t('category.recipesCountSuffix') || 'وصفة'}
            </span>
        </Link>
    );
}
