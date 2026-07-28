'use client';

import React from 'react';
import Link from 'next/link';
import {
    ChefHat,
    Flame,
    BookOpen,
    Moon,
    CheckCircle2,
    Sparkles,
    ArrowLeft,
    Star,
    Users,
    Eye,
    Award
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import RecipeCard from '@/components/RecipeCard';
import CategoryCard from '@/components/CategoryCard';
import CommentThread from '@/components/CommentThread';

export default function HomePage() {
    const { recipes } = useApp();
    const trendingRecipes = recipes.slice(0, 6);

    return (
        <div className="space-y-16 pb-20 overflow-hidden bg-[#FAF8F5]">

            {/* 1. HERO SECTION — with bold cooking icons */}
            <section className="relative pt-10 pb-12 overflow-hidden">

                {/* ── Hero Cooking Icons Layer (visible & prominent) */}
                <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

                    {/* ChefHat — top-left large */}
                    <div className="cook-float-1 absolute top-6 left-4 sm:left-8 opacity-[0.13]" style={{ color: '#F57C00' }}>
                        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                            <line x1="6" x2="18" y1="17" y2="17" /><line x1="6" x2="18" y1="13" y2="13" />
                        </svg>
                    </div>

                    {/* Whisk — top-right */}
                    <div className="cook-float-2 absolute top-8 right-4 sm:right-16 opacity-[0.13]" style={{ color: '#F57C00', transform: 'rotate(30deg)' }}>
                        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 3 14 14" /><path d="M5 3c0 0 0 8 7 11" /><path d="M5 3c0 0 4 0 8 7" />
                            <path d="m12 17 5 5" /><path d="M12 17c0 0 4-1 7-7" /><path d="M12 17c0 0-1-4 5-7" />
                        </svg>
                    </div>

                    {/* Star sparkle — floating top-center */}
                    <div className="cook-spin absolute top-10 left-1/3 opacity-30" style={{ color: '#F57C00' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" /></svg>
                    </div>
                    <div className="cook-spin absolute top-24 right-1/3 opacity-20" style={{ color: '#F57C00', animationDelay: '-4s' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" /></svg>
                    </div>

                    {/* Pot — mid-left */}
                    <div className="cook-float-3 absolute bottom-8 left-2 sm:left-10 opacity-[0.10]" style={{ color: '#F57C00', transform: 'rotate(-8deg)' }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" /><path d="M20 12a8 8 0 0 0-16 0" />
                            <path d="M7 12V9" /><path d="M12 12V9" /><path d="M17 12V9" />
                        </svg>
                    </div>

                    {/* Flame — mid-right */}
                    <div className="cook-float-1 absolute bottom-12 right-4 sm:right-20 opacity-[0.13]" style={{ color: '#F57C00', transform: 'rotate(10deg)', animationDelay: '-3s' }}>
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                    </div>

                    {/* Tiny stars scattered */}
                    <div className="cook-spin absolute bottom-20 left-1/4 opacity-25" style={{ color: '#F57C00', animationDelay: '-6s' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" /></svg>
                    </div>
                    <div className="cook-spin absolute top-1/2 right-8 opacity-20" style={{ color: '#F57C00', animationDelay: '-2s' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" /></svg>
                    </div>

                    {/* Spoon/Fork icon — bottom-center */}
                    <div className="cook-float-2 absolute bottom-4 left-1/2 -translate-x-1/2 opacity-[0.08]" style={{ color: '#F57C00', transform: 'rotate(20deg)' }}>
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20" /><path d="M8 2v5a4 4 0 0 0 8 0V2" />
                        </svg>
                    </div>

                    {/* 3 orange dot accent trail near portrait */}
                    <div className="absolute top-1/2 left-[58%] flex gap-2 opacity-30">
                        <span className="w-2 h-2 rounded-full bg-brand-500 cook-float-1" style={{ animationDelay: '-1s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 cook-float-2" style={{ animationDelay: '-3s' }} />
                        <span className="w-1 h-1 rounded-full bg-brand-300 cook-float-3" style={{ animationDelay: '-5s' }} />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                        {/* Right Column (Text Content & Stats) */}
                        <div className="lg:col-span-7 space-y-6 text-right">

                            {/* Main Headline */}
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                                    وصفات مجربة وناجحة 100%
                                    <br />
                                    <span className="text-gray-900">من مطبخي إلى </span>
                                    <span className="text-brand-500">مائدتك</span>
                                </h1>
                            </div>

                            {/* Subtitle Description */}
                            <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
                                اكتشفي أسرار الطبخ مع الشيف نور.
                                <br />
                                أطباق، حلويات، وأفكار لكل يوم.
                            </p>

                            {/* 3 Stats Boxes */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md pt-2">
                                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-xl sm:text-2xl font-black text-brand-500">+3M</span>
                                    <span className="text-[11px] sm:text-xs font-bold text-gray-400">مشاهدة شهرياً</span>
                                </div>
                                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-xl sm:text-2xl font-black text-brand-500">+500</span>
                                    <span className="text-[11px] sm:text-xs font-bold text-gray-400">وصفة</span>
                                </div>
                                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-xl sm:text-2xl font-black text-brand-500">171K</span>
                                    <span className="text-[11px] sm:text-xs font-bold text-gray-400">متابع</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/recipes"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-orange-glow hover:scale-105 transition-all"
                                >
                                    تصفح الوصفات
                                </Link>
                            </div>

                        </div>

                        {/* Left Column — Portrait with orbiting cooking icon badges */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square">

                                {/* Glow ring */}
                                <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-2xl scale-95" />

                                {/* Chef Nour Portrait */}
                                <div className="relative w-full h-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-2xl bg-orange-50">
                                    <img src="/chef-nour.jpg" alt="الشيف نور" className="w-full h-full object-cover object-top rounded-full block" />
                                </div>

                                {/* Orbiting icon badge — TOP (flame) */}
                                <div className="cook-float-1 absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-2xl shadow-xl border border-orange-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                                    </svg>
                                </div>

                                {/* Orbiting badge — LEFT (chef hat) */}
                                <div className="cook-float-2 absolute top-1/3 -left-4 w-12 h-12 bg-white rounded-2xl shadow-xl border border-orange-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                                        <line x1="6" x2="18" y1="17" y2="17" /><line x1="6" x2="18" y1="13" y2="13" />
                                    </svg>
                                </div>

                                {/* Orbiting badge — RIGHT (star rating) */}
                                <div className="cook-float-3 absolute top-1/3 -right-4 w-12 h-12 bg-brand-500 rounded-2xl shadow-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>

                                {/* Orbiting badge — BOTTOM (whisk) */}
                                <div className="cook-float-1 absolute -bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 bg-white rounded-2xl shadow-xl border border-orange-100 flex items-center justify-center" style={{ animationDelay: '-2s' }}>
                                    <svg className="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5 3 14 14" /><path d="M5 3c0 0 0 8 7 11" /><path d="M5 3c0 0 4 0 8 7" />
                                        <path d="m12 17 5 5" /><path d="M12 17c0 0 4-1 7-7" /><path d="M12 17c0 0-1-4 5-7" />
                                    </svg>
                                </div>

                                {/* Stats pill badge — top-right */}
                                <div className="absolute top-4 right-0 sm:-right-4 bg-black/75 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-400 fill-current" />
                                    <div className="text-right">
                                        <span className="block text-xs font-black text-white">+3M</span>
                                        <span className="text-[10px] text-gray-300">مشاهدة شهرياً</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Dots indicator */}
                    <div className="flex items-center justify-center gap-2 pt-8">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    </div>

                </div>
            </section>



            {/* 2. CATEGORIES CAROUSEL SECTION ("تصفح حسب الفئة") */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-right">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            تصفح حسب الفئة
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                            اختر قسمك المفضل واستكشف مئات الوصفات اللذيذة
                        </p>
                    </div>

                    <Link
                        href="/recipes"
                        className="text-xs sm:text-sm font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 transition-colors"
                    >
                        <span>عرض الكل</span>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                {/* Scrollable Horizontal Categories */}
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar pt-2">
                    {MOCK_CATEGORIES.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
            </section>

            {/* 3. TRENDING RECIPES SECTION ("الوصفات الأكثر طلباً🔥") */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-100 pb-4">
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>الأكثر طلباً🔥</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            الوصفات الأكثر طلباً
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                            اخترناها خصيصاً لك من أكثر الوصفات نجاحاً وإقبالاً في مجتمعنا
                        </p>
                    </div>

                    <Link
                        href="/recipes"
                        className="self-start sm:self-auto bg-gray-900 hover:bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <span>عرض الكل</span>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                {/* 6 Recipes Grid matching reference design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {trendingRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </section>


            {/* 5. COMMUNITY DISCUSSION SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-right mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-extrabold mb-2">
                        <Users className="w-4 h-4" />
                        <span>مجتمع الشيف نور</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        تطبيقاتكم وآراؤكم
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                        صور حقيقية وتجارب ناجحة — شاركي وتفاعلي مع مجتمع الشيف نور
                    </p>
                </div>

                <CommentThread limit={3} showForm={true} />
            </section>

        </div >
    );
}
