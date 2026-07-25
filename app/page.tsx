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
import { MOCK_CATEGORIES, MOCK_REVIEWS } from '@/lib/mock-data';
import RecipeCard from '@/components/RecipeCard';
import CategoryCard from '@/components/CategoryCard';
import VideoReels from '@/components/VideoReels';

export default function HomePage() {
    const { recipes, reviews } = useApp();
    const trendingRecipes = recipes.slice(0, 6);
    const approvedReviews = reviews.filter(r => r.moderation_status === 'approved');

    return (
        <div className="space-y-16 pb-20 overflow-hidden bg-[#FAF8F5]">

            {/* 1. HERO SECTION — Matches reference design strictly */}
            <section className="relative pt-10 pb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                            {/* 3 Stats Boxes matching reference image */}
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

                            {/* Buttons Row */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/recipes"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-orange-glow hover:scale-105 transition-all"
                                >
                                    تصفح الوصفات
                                </Link>
                            </div>

                        </div>

                        {/* Left Column (Circular Food Dish matching reference image) */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square">

                                {/* Outer subtle shadow ring */}
                                <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-2xl scale-95" />

                                {/* Circular Dish Image Container with Strict Constraints */}
                                <div className="relative w-full h-full aspect-square rounded-full p-2 bg-white shadow-2xl overflow-hidden border-4 border-white flex items-center justify-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=85"
                                        alt="طاجين الشيف نور"
                                        className="w-full h-full aspect-square object-cover rounded-full block"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80';
                                        }}
                                    />
                                </div>

                                {/* Top Right Floating Pill Badge matching reference */}
                                <div className="absolute top-4 right-2 sm:right-4 bg-black/75 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-400 fill-current" />
                                    <div className="text-right">
                                        <span className="block text-xs font-black text-white">+3M</span>
                                        <span className="text-[10px] text-gray-300">مشاهدة شهرياً</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Carousel Navigation Dots under Hero matching reference */}
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

            {/* 4. VIDEO REELS SECTION */}
            <VideoReels />

            {/* 5. COMMUNITY REVIEWS SECTION ("تطبيقاتكم وآراؤكم" strictly matching reference image) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-right mb-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-extrabold mb-2">
                        <Users className="w-4 h-4" />
                        <span>مجتمع الشيف نور</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        تطبيقاتكم وآراؤكم
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                        صور حقيقية وتجارب ناجحة لنساء وجدن متعة الطبخ معنا
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {approvedReviews.map((rev) => (
                        <div key={rev.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col justify-between space-y-4">
                            <div>
                                {/* User Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={rev.user_avatar}
                                        alt={rev.user_name}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500"
                                    />
                                    <div>
                                        <h4 className="font-extrabold text-sm text-gray-900">{rev.user_name}</h4>
                                        <div className="flex text-amber-500 text-xs">
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium mb-3">
                                    "{rev.comment}"
                                </p>

                                {/* User Submitted Dish Photo */}
                                {rev.photo_url && (
                                    <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-3 border border-gray-100">
                                        <img src={rev.photo_url} alt="تطبيق الوصفة" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                    </div>
                                )}
                            </div>

                            {/* Chef Verified Reply */}
                            {rev.chef_reply && (
                                <div className="bg-orange-50/80 p-3 rounded-2xl border border-orange-100 text-xs text-brand-900">
                                    <div className="flex items-center gap-1 font-bold text-brand-700 mb-1">
                                        <ChefHat className="w-3.5 h-3.5" />
                                        <span>رد الشيف نور:</span>
                                    </div>
                                    <p className="text-[11px] leading-snug">{rev.chef_reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

        </div >
    );
}
