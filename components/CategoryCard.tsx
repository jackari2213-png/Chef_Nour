'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center min-w-[110px] max-w-[130px] p-3 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-card hover:border-brand-200 card-hover-effect transition-all text-center"
        >
            {/* Category Image Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 bg-gray-100 relative shadow-sm ring-2 ring-transparent group-hover:ring-brand-500 transition-all">
                <img
                    src={category.image_url}
                    alt={category.name_ar}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Category Title */}
            <span className="font-extrabold text-xs text-gray-800 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                {category.name_ar}
            </span>

            {/* Recipe Count Badge */}
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 group-hover:bg-brand-50 group-hover:text-brand-600 px-2 py-0.5 rounded-full transition-colors">
                {category.recipe_count}
            </span>
        </Link>
    );
}
