'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
    Clock,
    Users,
    Flame,
    Star,
    Heart,
    Share2,
    Printer,
    CheckSquare,
    Square,
    Play,
    ChevronRight,
    ChevronLeft,
    Maximize2,
    Minimize2,
    BookOpen,
    ChefHat,
    Camera,
    Send,
    ArrowRight,
    Sparkles,
    Award,
    Utensils,
    CheckCircle2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_RECIPES } from '@/lib/mock-data';
import RecipeCard from '@/components/RecipeCard';
import CookingTimer from '@/components/CookingTimer';
import CommentThread from '@/components/CommentThread';

export default function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { recipes, isFavorite, toggleFavorite, user } = useApp();

    // Find recipe or fallback to first recipe (e.g. Chicken Tagine)
    const recipe = recipes.find(r => r.slug === slug) || recipes[1] || MOCK_RECIPES[1];
    const favorite = isFavorite(recipe.id);

    // Ingredients checklist state
    const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
    const [activeStep, setActiveStep] = useState<number>(0);

    // Fullscreen Cooking Mode state
    const [cookingModeOpen, setCookingModeOpen] = useState<boolean>(false);
    const [cookingStep, setCookingStep] = useState<number>(0);
    // Select all / Toggle all ingredients
    const allChecked = recipe.ingredients.every(i => checkedIngredients[i.id]);

    const toggleAllIngredients = () => {
        if (allChecked) {
            setCheckedIngredients({});
        } else {
            const next: Record<string, boolean> = {};
            recipe.ingredients.forEach(i => { next[i.id] = true; });
            setCheckedIngredients(next);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: recipe.title_ar,
                text: recipe.description_ar,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ رابط الوصفة بنجاح!');
        }
    };

    const relatedRecipes = recipes.filter(r => r.id !== recipe.id).slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

            {/* 1. Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Link href="/" className="hover:text-brand-600 transition-colors">الرئيسية</Link>
                <span>/</span>
                <Link href="/recipes" className="hover:text-brand-600 transition-colors">الوصفات</Link>
                <span>/</span>
                <span className="text-gray-900 font-extrabold">{recipe.title_ar}</span>
            </nav>

            {/* 2. Top Header & Title Section */}
            <div className="space-y-4 text-right">

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="inline-block bg-brand-100 text-brand-700 text-xs font-black px-3.5 py-1.5 rounded-full">
                        {recipe.category_name_ar}
                    </span>

                    {/* Action Buttons: Print, Share, Favorite */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">طباعة</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">مشاركة</span>
                        </button>

                        <button
                            onClick={() => toggleFavorite(recipe.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${favorite ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50 text-gray-700 border border-gray-200'}`}
                        >
                            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                            <span>{favorite ? 'محفوظة' : 'حفظ الوصفة'}</span>
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    {recipe.title_ar}
                </h1>

                {/* Rating & Author Row */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 font-semibold pt-2">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-extrabold text-gray-900 text-sm mr-1">{recipe.rating_avg.toFixed(1)}</span>
                        <span className="text-gray-400">({recipe.rating_count.toLocaleString('ar-MA')} تقييم)</span>
                    </div>

                    <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
                        <img
                            src="/chef-nour.jpg"
                            alt="الشيف نور"
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-brand-500"
                        />
                        <span className="font-bold text-gray-900">إعداد: الشيف نور</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 border-r border-gray-200 pr-6">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{(recipe.views_count / 1000).toFixed(0)}K مشاهدة</span>
                    </div>
                </div>

            </div>

            {/* 3. Recipe Main Visual & Thumbnail Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group">
                    <img
                        src={recipe.main_image}
                        alt={recipe.title_ar}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    {recipe.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                            <a
                                href={recipe.video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-orange-glow transition-transform hover:scale-110"
                            >
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </a>
                        </div>
                    )}
                </div>

                {/* 4 Thumbnail Gallery row matching reference image */}
                <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                    {[
                        recipe.main_image,
                        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80',
                        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80',
                        'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=400&q=80',
                    ].map((imgUrl, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                            <img src={imgUrl} alt="صورة إضافية" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Metadata Badges Row matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <Clock className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                    <span className="block text-[11px] text-gray-400 font-bold">وقت التحضير</span>
                    <span className="text-sm font-extrabold text-gray-900">{recipe.prep_time_minutes} دقيقة</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <span className="block text-[11px] text-gray-400 font-bold">وقت الطبخ</span>
                    <span className="text-sm font-extrabold text-gray-900">{recipe.cook_time_minutes} دقيقة</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <span className="block text-[11px] text-gray-400 font-bold">عدد الأشخاص</span>
                    <span className="text-sm font-extrabold text-gray-900">{recipe.servings} أشخاص</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <Award className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <span className="block text-[11px] text-gray-400 font-bold">مستوى الصعوبة</span>
                    <span className="text-sm font-extrabold text-gray-900">
                        {recipe.difficulty === 'easy' ? 'سهل' : recipe.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                    </span>
                </div>
            </div>

            {/* 5. Mobile Quick Jump Navigation Pills (visible only on mobile/tablet) */}
            <div className="lg:hidden flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-gray-200 shadow-sm sticky top-16 z-30">
                <a href="#ingredients-section" className="flex-1 text-center bg-orange-50 hover:bg-orange-100 text-brand-700 font-extrabold text-xs py-2.5 rounded-xl border border-orange-200 transition-colors">
                    🥕 المقادير ({recipe.ingredients.length})
                </a>
                <a href="#steps-section" className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs py-2.5 rounded-xl border border-gray-200 transition-colors">
                    🍳 التحضير ({recipe.steps.length})
                </a>
                <a href="#reviews-section" className="flex-1 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs py-2.5 rounded-xl border border-emerald-200 transition-colors">
                    💬 التعليقات
                </a>
            </div>

            {/* 6. Main Split Content: Ingredients Checklist & Step-by-Step Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                {/* Right Col in RTL: Interactive Ingredients Checklist */}
                <div id="ingredients-section" className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-card space-y-4 lg:sticky lg:top-28 scroll-mt-28">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-brand-500" />
                            <span>المقادير</span>
                        </h3>

                        <button
                            onClick={toggleAllIngredients}
                            className="text-xs font-bold text-brand-600 hover:underline"
                        >
                            {allChecked ? 'إلغاء التحديد' : 'تحديد الكل'}
                        </button>
                    </div>

                    <div className="space-y-2.5">
                        {recipe.ingredients.map(ing => {
                            const isChecked = !!checkedIngredients[ing.id];
                            return (
                                <div
                                    key={ing.id}
                                    onClick={() => setCheckedIngredients(prev => ({ ...prev, [ing.id]: !prev[ing.id] }))}
                                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors border ${isChecked ? 'bg-orange-50/70 border-orange-200 text-gray-400 line-through' : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isChecked ? (
                                            <CheckSquare className="w-5 h-5 text-brand-500 shrink-0" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-300 shrink-0" />
                                        )}
                                        <span className="text-xs font-extrabold">{ing.item_ar}</span>
                                    </div>
                                    <span className="text-xs font-bold text-brand-600 bg-white px-2.5 py-1 rounded-xl shadow-xs">
                                        {ing.amount}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cooking Timer */}
                    <CookingTimer defaultMinutes={recipe.cook_time_minutes} />

                    {/* Fullscreen Cooking Mode Trigger */}
                    <div className="pt-2">
                        <button
                            onClick={() => {
                                setCookingStep(0);
                                setCookingModeOpen(true);
                            }}
                            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                        >
                            <Maximize2 className="w-4 h-4" />
                            <span>وضع الطبخ (شاشة كاملة)</span>
                        </button>
                    </div>
                </div>

                {/* Left Col in RTL: Step-by-Step Preparation Instructions */}
                <div id="steps-section" className="lg:col-span-8 space-y-6 scroll-mt-28">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <h3 className="text-xl font-black text-gray-900">طريقة التحضير</h3>
                        <span className="text-xs font-bold text-gray-400">{recipe.steps.length} خطوات</span>
                    </div>

                    <div className="space-y-6">
                        {recipe.steps.map((step, idx) => (
                            <div
                                key={step.id}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start"
                            >
                                {/* Step Number Circle */}
                                <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                                    {step.step_number}
                                </div>

                                <div className="space-y-3 flex-1 text-right">
                                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-semibold">
                                        {step.instruction_ar}
                                    </p>

                                    {step.image_url && (
                                        <div className="rounded-2xl overflow-hidden aspect-video bg-gray-100 max-w-md border border-gray-100 shadow-xs">
                                            <img src={step.image_url} alt={`مرحلة ${step.step_number}`} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 7. Community Discussion Thread */}
            <section id="reviews-section" className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-card space-y-6 scroll-mt-28">
                <div className="border-b border-gray-100 pb-4 text-right">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">تطبيقاتكم وآراؤكم</h2>
                    <p className="text-xs text-gray-500 font-medium">شاركينا تجربتك مع الوصفة وتفاعلي مع مجتمع الشيف نور!</p>
                </div>
                <CommentThread
                    recipeId={recipe.id}
                    recipeTitle={recipe.title_ar}
                    showForm={true}
                />
            </section>

            {/* 8. Fullscreen Distraction-Free Cooking Mode Modal */}
            {cookingModeOpen && (
                <div className="fixed inset-0 bg-gray-950 text-white z-50 overflow-y-auto flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-300">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center font-black">
                                {cookingStep + 1}
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg sm:text-xl text-white">{recipe.title_ar}</h3>
                                <p className="text-xs text-gray-400">وضع الطبخ بدون تشتيت</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setCookingModeOpen(false)}
                            className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl transition-colors"
                        >
                            <Minimize2 className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Central Cooking Instruction Big Text */}
                    <div className="my-auto max-w-3xl mx-auto text-center space-y-8 py-8">
                        <span className="inline-block bg-brand-500/20 text-brand-400 font-extrabold text-sm px-4 py-1.5 rounded-full border border-brand-500/30">
                            المرحلة {cookingStep + 1} من {recipe.steps.length}
                        </span>

                        <p className="text-2xl sm:text-4xl font-extrabold leading-relaxed text-gray-100">
                            {recipe.steps[cookingStep]?.instruction_ar}
                        </p>

                        {recipe.steps[cookingStep]?.image_url && (
                            <img
                                src={recipe.steps[cookingStep].image_url}
                                alt="مرحلة"
                                className="max-h-72 rounded-3xl mx-auto shadow-2xl border border-gray-800 object-cover"
                            />
                        )}

                        {/* Embedded Timer in Cooking Mode */}
                        <div className="max-w-xs mx-auto">
                            <CookingTimer defaultMinutes={recipe.cook_time_minutes} />
                        </div>
                    </div>

                    {/* Bottom Navigation Step Controls */}
                    <div className="flex items-center justify-between border-t border-gray-800 pt-6">
                        <button
                            disabled={cookingStep === 0}
                            onClick={() => setCookingStep(prev => Math.max(0, prev - 1))}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                            <span>المرحلة السابقة</span>
                        </button>

                        {/* Progress dots */}
                        <div className="flex gap-2">
                            {recipe.steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all ${i === cookingStep ? 'bg-brand-500 scale-125' : 'bg-gray-800'}`}
                                />
                            ))}
                        </div>

                        <button
                            disabled={cookingStep === recipe.steps.length - 1}
                            onClick={() => setCookingStep(prev => Math.min(recipe.steps.length - 1, prev + 1))}
                            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-orange-glow transition-all"
                        >
                            <span>المرحلة التالية</span>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}
