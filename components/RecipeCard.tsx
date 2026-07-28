'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Users, Star, Flame, Eye, Heart, ArrowLeft } from 'lucide-react';
import { Recipe } from '@/types';
import { useApp } from '@/lib/store';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const { isFavorite, toggleFavorite } = useApp();
    const favorite = isFavorite(recipe.id);

    // Difficulty badge colors matching reference design
    const getDifficultyBadge = (difficulty: Recipe['difficulty']) => {
        switch (difficulty) {
            case 'easy':
                return { label: 'سهل', bg: 'bg-emerald-500 text-white' };
            case 'medium':
                return { label: 'متوسط', bg: 'bg-amber-500 text-white' };
            case 'hard':
                return { label: 'صعب', bg: 'bg-red-500 text-white' };
            default:
                return { label: 'سهل', bg: 'bg-emerald-500 text-white' };
        }
    };

    const difficultyBadge = getDifficultyBadge(recipe.difficulty);

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card card-hover-effect flex flex-col h-full">
            {/* Card Header & Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
                <img
                    src={recipe.main_image}
                    alt={recipe.title_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80';
                    }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Right (RTL Left): Difficulty Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${difficultyBadge.bg}`}>
                        {difficultyBadge.label}
                    </span>
                </div>

                {/* Top Left (RTL Right): Views Count Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-current" />
                        <span>{
                            recipe.views_count >= 1000000
                                ? (recipe.views_count / 1000000).toFixed(1) + 'M'
                                : recipe.views_count >= 1000
                                    ? (recipe.views_count / 1000).toFixed(1) + 'K'
                                    : recipe.views_count.toString()
                        }</span>
                    </span>
                </div>

                {/* Favorite Toggle Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                    }}
                    className={`absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${favorite ? 'bg-red-500 text-white scale-110' : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500'}`}
                    title={favorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Card Content Body - Stretches with flex-grow */}
            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    {/* Category Tag */}
                    <div className="text-xs font-bold text-brand-600 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        <span>{recipe.category_name_ar}</span>
                    </div>

                    {/* Recipe Title */}
                    <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 min-h-[3.25rem]">
                        <Link href={`/recipes/${recipe.slug}`}>
                            {recipe.title_ar}
                        </Link>
                    </h3>
                </div>

                <div>
                    {/* Meta Info: Prep Time & Servings */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} دقيقة</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.servings} أشخاص</span>
                        </div>
                    </div>

                    {/* Ratings Row with RTL logical property ms-1 */}
                    <div className="flex items-center justify-between text-xs mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                            </div>
                            <span className="font-bold text-gray-900 ms-1">{recipe.rating_avg.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 font-medium">({recipe.rating_count.toLocaleString('ar-MA')} تقييم)</span>
                    </div>

                    {/* Card Action Button */}
                    <Link
                        href={`/recipes/${recipe.slug}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-brand-500 text-gray-800 hover:text-white font-bold text-xs py-2.5 rounded-2xl transition-all duration-200 group-hover:bg-brand-500 group-hover:text-white"
                    >
                        <span>عرض الوصفة</span>
                        <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
