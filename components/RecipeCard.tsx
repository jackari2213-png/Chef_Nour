'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Users, Star, Flame, Heart, ArrowLeft } from 'lucide-react';
import { Recipe } from '@/types';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const { isFavorite, toggleFavorite } = useApp();
    const { t, getLocalizedField } = useTranslation();
    const favorite = isFavorite(recipe.id);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const getDifficultyBadge = (difficulty: Recipe['difficulty']) => {
        switch (difficulty) {
            case 'easy':
                return { label: t('recipeCard.easy'), bg: 'bg-emerald-500 text-white' };
            case 'medium':
                return { label: t('recipeCard.medium'), bg: 'bg-amber-500 text-white' };
            case 'hard':
                return { label: t('recipeCard.hard'), bg: 'bg-red-500 text-white' };
            default:
                return { label: t('recipeCard.easy'), bg: 'bg-emerald-500 text-white' };
        }
    };

    const difficultyBadge = getDifficultyBadge(recipe.difficulty);

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl card-hover-effect flex flex-col h-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 skeleton-shimmer" />
                )}
                <img
                    src={imgError
                        ? 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80'
                        : recipe.main_image
                    }
                    alt={getLocalizedField(recipe, 'title')}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => { setImgError(true); setImgLoaded(true); }}
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                    {recipe.views_count > 10000 && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md backdrop-blur-sm flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-current" />
                            {t('recipeCard.trending')}
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${difficultyBadge.bg} backdrop-blur-sm`}>
                        {difficultyBadge.label}
                    </span>
                </div>

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

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                    }}
                    className={`absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md btn-tap ${favorite ? 'bg-red-500 text-white scale-110' : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500'}`}
                    title={favorite ? t('recipeCard.removeFav') : t('recipeCard.saveFav')}
                >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <div className="text-xs font-bold text-brand-600 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        <span>{getLocalizedField(recipe, 'category_name')}</span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 min-h-[3.25rem]">
                        <Link href={`/recipes/${recipe.slug}`}>
                            {getLocalizedField(recipe, 'title')}
                        </Link>
                    </h3>
                </div>

                <div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} {t('recipeCard.minutes')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.servings} {t('recipeCard.persons')}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(recipe.rating_avg) ? 'fill-current' : 'fill-none stroke-current'}`} />
                                ))}
                            </div>
                            <span className="font-bold text-gray-900 ms-1">{recipe.rating_avg.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 font-medium">({recipe.rating_count.toLocaleString('ar-MA')} {t('recipeCard.review')})</span>
                    </div>

                    <Link
                        href={`/recipes/${recipe.slug}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-brand-500 text-gray-800 hover:text-white font-bold text-xs py-2.5 rounded-2xl transition-all duration-200 btn-tap group-hover:shadow-md group-hover:shadow-brand-500/20"
                    >
                        <span>{t('recipeCard.viewRecipe')}</span>
                        <ArrowLeft className="w-4 h-4 rtl:rotate-0 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
