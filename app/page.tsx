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
    ShieldCheck,
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
        <div className="space-y-16 pb-20 overflow-hidden">

            {/* 1. HERO SECTION (Split Layout strictly matching reference image) */}
            <section className="relative bg-gradient-to-b from-orange-50/60 via-white to-surface-bg pt-8 pb-16 lg:py-20">

                {/* Background Subtle Gradient Blobs */}
                <div className="absolute top-10 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Right Column (Text Content & Stats) */}
                        <div className="lg:col-span-7 space-y-6 text-right">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
                                <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
                                <span>وصفات مجربة وناجحة 100%</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight">
                                من مطبخي إلى <span className="text-brand-500 underline decoration-brand-200 underline-offset-8">مائدتك</span>
                            </h1>

                            {/* Subtitle Description */}
                            <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                                اكتشفي أسرار الطبخ مع الشيف نور. أطباق مغربية أصيلة، حلويات فاخرة، وأفكار سهلة وسريعة لكل يوم بمقادير مضمونة 100%.
                            </p>

                            {/* Buttons Row */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/recipes"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-orange-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <span>تصفح الوصفات</span>
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>

                                <Link
                                    href="/store/eid-sweets-cookbook"
                                    className="bg-white hover:bg-orange-50 text-gray-800 hover:text-brand-600 border-2 border-gray-200 font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Moon className="w-4 h-4 text-amber-500" />
                                    <span>حمل كتاب رمضان</span>
                                </Link>
                            </div>

                            {/* Verified Chef Profile Badge */}
                            <div className="pt-4 flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&q=80"
                                        alt="الشيف نور"
                                        className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-md"
                                    />
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 bg-white rounded-full absolute -bottom-1 -right-1 fill-current" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-extrabold text-sm text-gray-900">الشيف نور</span>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">شيف معتمد</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">خبيرة الطبخ التقليدي والمودرن</p>
                                </div>
                            </div>

                            {/* Stats Counters Bar strictly matching reference design */}
                            <div className="pt-6 border-t border-gray-200/80 grid grid-cols-3 gap-4 max-w-lg">
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-2xl sm:text-3xl font-black text-brand-500">+3M</span>
                                    <span className="text-xs font-bold text-gray-500">مشاهدة شهرياً</span>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-2xl sm:text-3xl font-black text-gray-900">+500</span>
                                    <span className="text-xs font-bold text-gray-500">وصفة مجربة</span>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                    <span className="block text-2xl sm:text-3xl font-black text-gray-900">171K</span>
                                    <span className="text-xs font-bold text-gray-500">متابع وفية</span>
                                </div>
                            </div>

                        </div>

                        {/* Left Column (Main Hero Visual Dish matching reference) */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md lg:max-w-none">

                                {/* Outer Glow Ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 to-amber-400 blur-2xl opacity-20 transform scale-95" />

                                {/* Main Circular Hero Image */}
                                <div className="relative aspect-square rounded-full p-4 bg-white/70 backdrop-blur-md shadow-2xl border border-white/50 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=1000&q=80"
                                        alt="طاجين مغربي فاخر الشيف نور"
                                        className="w-full h-full object-cover rounded-full shadow-inner hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Floating Badge top left over image */}
                                <div className="absolute top-6 left-2 sm:left-4 z-20 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 animate-bounce">
                                    <Flame className="w-5 h-5 text-orange-400 fill-current" />
                                    <div>
                                        <span className="block text-xs font-bold text-orange-300">+3M</span>
                                        <span className="text-[10px] text-gray-300">مشاهدة شهرياً</span>
                                    </div>
                                </div>

                                {/* Floating Recipe Pill bottom right */}
                                <div className="absolute bottom-6 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brand-600 font-bold">
                                        ⭐ 4.9
                                    </div>
                                    <div>
                                        <span className="block text-xs font-extrabold text-gray-900">طاجين الدجاج الأصيل</span>
                                        <span className="text-[10px] text-gray-500 font-medium">الوصفة الأكثر تقييماً 🔥</span>
                                    </div>
                                </div>

                            </div>
                        </div>

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

            {/* 5. COOKBOOK BANNER PROMO ("دليلك الشامل لنجاح حلويات العيد") */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-100/40 rounded-3xl p-6 sm:p-10 border border-brand-200 shadow-soft overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Left Col (Book Cover Image) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative group max-w-[280px]">
                                <div className="absolute inset-0 bg-brand-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                                <img
                                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"
                                    alt="كتاب حلويات العيد الشيف نور"
                                    className="relative rounded-2xl shadow-2xl border-4 border-white object-cover transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"
                                />
                                <span className="absolute top-3 right-3 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md z-10">
                                    خصم 50%
                                </span>
                            </div>
                        </div>

                        {/* Right Col (Book Content & Pricing) */}
                        <div className="lg:col-span-7 text-right space-y-5">
                            <div className="inline-flex items-center gap-2 bg-brand-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                                <BookOpen className="w-4 h-4" />
                                <span>إصدار حصري ممتاز</span>
                            </div>

                            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                                دليلك الشامل لنجاح حلويات العيد
                            </h2>

                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                                أكثر من 30 وصفة مجربة بمقادير مضبوطة وأسرار الشيف نور للحصول على نتيجة مثالية من المرة الأولى!
                            </p>

                            {/* Highlights List */}
                            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-gray-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span>30 وصفة مضمونة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span>مقادير مضبوطة</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span>أسرار الشيف</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span>صور احترافية لكل وصفة</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span>تحديثات مجانية مدى الحياة</span>
                                </div>
                            </div>

                            {/* Pricing & CTA */}
                            <div className="pt-4 border-t border-brand-200/60 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl sm:text-4xl font-black text-brand-600">49 درهم</span>
                                    <span className="text-sm font-bold text-gray-400 line-through">99 درهم</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">وفر 50 درهم</span>
                                </div>

                                <Link
                                    href="/store/eid-sweets-cookbook"
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-orange-glow hover:scale-105 active:scale-95 transition-all"
                                >
                                    اشتري الآن ← 49 درهم
                                </Link>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>ضمان استرجاع لمدة 30 يوم • تحميل فوري بعد الدفع مباشرة</span>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

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

        </div>
    );
}
