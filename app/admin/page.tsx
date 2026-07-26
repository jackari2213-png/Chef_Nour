'use client';

import React, { useState } from 'react';
import {
    Utensils,
    BookOpen,
    MessageSquare,
    Eye,
    Check,
    Trash2,
    Plus,
    CheckCircle2,
    X,
    ChefHat,
    Minus,
    Image as ImageIcon,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

interface IngredientRow { id: string; item_ar: string; amount: string; }
interface StepRow { id: string; step_number: number; instruction_ar: string; image_url?: string; }

export default function AdminDashboardPage() {
    const { reviews, approveReview, rejectReview, recipes, addRecipe, orders } = useApp();
    const pendingReviews = reviews.filter(r => r.moderation_status === 'pending');
    const totalViews = recipes.reduce((sum, r) => sum + (r.views_count || 0), 0);
    const totalViewsFormatted = totalViews >= 1000000 ? (totalViews / 1000000).toFixed(1) + 'M' : totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews.toString();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [recipeAdded, setRecipeAdded] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(MOCK_CATEGORIES[0].id);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [prepTime, setPrepTime] = useState(20);
    const [cookTime, setCookTime] = useState(40);
    const [servings, setServings] = useState(4);
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80');
    const [galleryImages, setGalleryImages] = useState<string[]>([
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80',
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    ]);
    const [newImageUrl, setNewImageUrl] = useState('');

    const [ingredients, setIngredients] = useState<IngredientRow[]>([
        { id: 'i1', item_ar: 'المكون الأول', amount: '250g' },
        { id: 'i2', item_ar: 'البهارات', amount: '1 ملعقة صغيرة' },
    ]);
    const [steps, setSteps] = useState<StepRow[]>([
        { id: 's1', step_number: 1, instruction_ar: '' },
    ]);

    // Gallery Image Helpers
    const addGalleryImage = (url: string) => {
        if (!url.trim()) return;
        setGalleryImages(prev => [...prev, url.trim()]);
        setNewImageUrl('');
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, idx) => idx !== index));
    };

    // Ingredient helpers
    const addIngredient = () => setIngredients(prev => [...prev, { id: 'i' + Date.now(), item_ar: '', amount: '' }]);
    const removeIngredient = (id: string) => setIngredients(prev => prev.filter(i => i.id !== id));
    const updateIngredient = (id: string, field: keyof IngredientRow, val: string) =>
        setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));

    // Step helpers
    const addStep = () => setSteps(prev => [...prev, { id: 's' + Date.now(), step_number: prev.length + 1, instruction_ar: '' }]);
    const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, step_number: idx + 1 })));
    const updateStep = (id: string, field: keyof StepRow, val: string) =>
        setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));

    const resetForm = () => {
        setTitle(''); setDescription('');
        setIngredients([{ id: 'i1', item_ar: '', amount: '' }]);
        setSteps([{ id: 's1', step_number: 1, instruction_ar: '' }]);
        setMainImage('https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80');
        setGalleryImages([]);
        setNewImageUrl('');
        setPrepTime(20); setCookTime(40); setServings(4);
    };

    const handleAddRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        if (steps.some(s => !s.instruction_ar.trim())) {
            alert('يرجى ملء جميع خطوات التحضير');
            return;
        }

        addRecipe({
            title_ar: title,
            slug: 'recipe-' + Date.now(),
            description_ar: description,
            category_id: category,
            category_name_ar: MOCK_CATEGORIES.find(c => c.id === category)?.name_ar || 'أطباق مغربية',
            difficulty,
            prep_time_minutes: Number(prepTime),
            cook_time_minutes: Number(cookTime),
            servings: Number(servings),
            main_image: mainImage,
            gallery_images: galleryImages,
            published: true,
            ingredients: ingredients.filter(i => i.item_ar.trim()),
            steps: steps.filter(s => s.instruction_ar.trim()),
        });

        setRecipeAdded(true);
        setModalOpen(false);
        resetForm();
        setTimeout(() => setRecipeAdded(false), 4000);
    };

    return (
        <div className="space-y-8">

            {/* Dashboard Top Title */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">لوحة التحكم والأداء</h1>
                    <p className="text-xs text-gray-400 font-medium">مرحباً الشيف نور، إليك ملخص الإحصائيات اليومية</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                    النظام يعمل بكفاءة 100%
                </span>
            </div>

            {/* Success confirmation */}
            {recipeAdded && (
                <div className="bg-emerald-950 text-emerald-300 p-4 rounded-2xl border border-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    تم نشر الوصفة بنجاح وإضافتها للمنصة فوراً!
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-brand-500/50 transition-all">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold">الوصفات المنشورة</span>
                        <Utensils className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{recipes.length}</span>
                        <span className="text-xs font-bold text-emerald-400">حقيقي</span>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold">مبيعات الكتب</span>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{orders.length}</span>
                        <span className="text-xs font-bold text-emerald-400">حقيقي</span>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-all">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold">تعليقات جديدة</span>
                        <MessageSquare className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{pendingReviews.length}</span>
                        <span className="text-xs font-bold text-amber-400">في الانتظار</span>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold">إجمالي المشاهدات</span>
                        <Eye className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{totalViewsFormatted}</span>
                        <span className="text-xs font-bold text-emerald-400">حقيقي</span>
                    </div>
                </div>
            </div>

            {/* Main Grid: Moderation + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Moderation Inbox */}
                <div className="lg:col-span-7 bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-brand-500" />
                            التعليقات في انتظار الموافقة ({pendingReviews.length})
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {pendingReviews.length > 0 ? (
                            pendingReviews.map(rev => (
                                <div key={rev.id} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4 hover:bg-slate-800/80 transition-colors">
                                    <div className="flex items-center gap-3 text-right flex-1 min-w-0">
                                        <img src={rev.user_avatar} alt={rev.user_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="font-extrabold text-xs text-white">{rev.user_name}</h4>
                                            <p className="text-[11px] text-brand-400 font-bold">{rev.recipe_title_ar}</p>
                                            <p className="text-xs text-slate-300 truncate">{rev.comment}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => approveReview(rev.id)}
                                            className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-colors" title="موافقة">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => rejectReview(rev.id)}
                                            className="w-9 h-9 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-colors" title="رفض">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-medium">جميع التعليقات تمت مراجعتها وموافقتها بالكامل</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Add Recipe CTA */}
                    <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 text-white space-y-3 shadow-orange-glow">
                        <ChefHat className="w-8 h-8" />
                        <h3 className="text-lg font-black">نشر وصفة جديدة</h3>
                        <p className="text-xs text-orange-100 font-medium">أضيفي وصفة كاملة مع المقادير والخطوات والصور</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full bg-white text-brand-600 font-extrabold text-xs py-3 rounded-2xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>إضافة وصفة جديدة</span>
                        </button>
                    </div>

                    {/* Recent Recipes list */}
                    <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3">
                        <h4 className="text-xs font-black text-white border-b border-slate-700 pb-2">آخر 5 وصفات منشورة</h4>
                        {recipes.slice(0, 5).map(r => (
                            <div key={r.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-700/50 transition-colors">
                                <img src={r.main_image} alt={r.title_ar} className="w-8 h-8 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-200 truncate">{r.title_ar}</p>
                                    <p className="text-[10px] text-slate-400">{r.category_name_ar}</p>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold shrink-0">منشور</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full-Featured Add Recipe Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-gray-900 rounded-3xl w-full max-w-3xl border border-gray-700 shadow-2xl my-6 animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <ChefHat className="w-6 h-6 text-brand-500" />
                                إضافة وصفة جديدة كاملة
                            </h2>
                            <button onClick={() => { setModalOpen(false); resetForm(); }}
                                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddRecipe} className="p-6 space-y-6 text-right">

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">عنوان الوصفة *</label>
                                    <input required type="text" placeholder="مثال: طاجين اللحم بالبرقوق" value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">الفئة</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none">
                                        {MOCK_CATEGORIES.map(c => (<option key={c.id} value={c.id}>{c.name_ar}</option>))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">مستوى الصعوبة</label>
                                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none">
                                        <option value="easy">سهل</option>
                                        <option value="medium">متوسط</option>
                                        <option value="hard">صعب</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">وقت التحضير (دقيقة)</label>
                                    <input type="number" min="1" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">وقت الطبخ (دقيقة)</label>
                                    <input type="number" min="1" value={cookTime} onChange={e => setCookTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none" />
                                </div>

                                {/* Multi-Image & Gallery Management Section */}
                                <div className="sm:col-span-2 space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-white flex items-center gap-1.5">
                                            <ImageIcon className="w-4 h-4 text-brand-500" />
                                            معرض صور الوصفة (الصورة الرئيسية + الصور الإضافية)
                                        </label>
                                        <span className="text-[10px] text-gray-400">إجمالي {1 + galleryImages.length} صور</span>
                                    </div>

                                    {/* Input Main Image */}
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-400 block mb-1">رابط الصورة الرئيسية (Cover)</label>
                                        <input type="url" value={mainImage} onChange={e => setMainImage(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500" />
                                    </div>

                                    {/* Add New Gallery Image Input */}
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-400 block mb-1">إضافة صورة فرعية للمعرض</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="أدخلي رابط الصورة (URL)..."
                                                value={newImageUrl}
                                                onChange={e => setNewImageUrl(e.target.value)}
                                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addGalleryImage(newImageUrl)}
                                                className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>إضافة</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Thumbnails Grid Preview */}
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                                        {/* Main image thumbnail */}
                                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-brand-500 shadow-md group">
                                            <img src={mainImage} alt="main" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-0 inset-x-0 bg-brand-500 text-white text-[9px] font-black text-center py-0.5">الرئيسية</span>
                                        </div>

                                        {/* Gallery thumbnails */}
                                        {galleryImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 shadow-md group">
                                                <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="حذف الصورة"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const oldMain = mainImage;
                                                        setMainImage(img);
                                                        setGalleryImages(prev => prev.map((item, i) => i === idx ? oldMain : item));
                                                    }}
                                                    className="absolute bottom-0 inset-x-0 bg-black/70 hover:bg-brand-600 text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    جعلها رئيسية
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">وصف مختصر *</label>
                                    <textarea required rows={3} placeholder="وصف شهي ومفصل للوصفة..." value={description} onChange={e => setDescription(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500" />
                                </div>
                            </div>

                            {/* Dynamic Ingredients */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-white">المقادير ({ingredients.length})</h3>
                                    <button type="button" onClick={addIngredient}
                                        className="bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>إضافة مكون</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {ingredients.map((ing, idx) => (
                                        <div key={ing.id} className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-bold w-5 shrink-0">{idx + 1}.</span>
                                            <input
                                                type="text" placeholder="اسم المكون"
                                                value={ing.item_ar}
                                                onChange={e => updateIngredient(ing.id, 'item_ar', e.target.value)}
                                                className="flex-1 bg-gray-950 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <input
                                                type="text" placeholder="الكمية"
                                                value={ing.amount}
                                                onChange={e => updateIngredient(ing.id, 'amount', e.target.value)}
                                                className="w-28 bg-gray-950 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            {ingredients.length > 1 && (
                                                <button type="button" onClick={() => removeIngredient(ing.id)}
                                                    className="p-2 text-red-400 hover:bg-red-950 rounded-lg transition-colors">
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Steps */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-white">طريقة التحضير ({steps.length} خطوات)</h3>
                                    <button type="button" onClick={addStep}
                                        className="bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>إضافة خطوة</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {steps.map((step, idx) => (
                                        <div key={step.id} className="bg-gray-950 rounded-2xl p-4 border border-gray-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-extrabold text-brand-400">المرحلة {step.step_number}</span>
                                                {steps.length > 1 && (
                                                    <button type="button" onClick={() => removeStep(step.id)}
                                                        className="p-1 text-red-400 hover:bg-red-950 rounded-lg text-xs">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <textarea rows={2} required
                                                placeholder={`تعليمات المرحلة ${step.step_number}...`}
                                                value={step.instruction_ar}
                                                onChange={e => updateStep(step.id, 'instruction_ar', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <input type="url" placeholder="رابط صورة للخطوة (اختياري)"
                                                value={step.image_url || ''}
                                                onChange={e => updateStep(step.id, 'image_url', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <button type="button" onClick={() => { setModalOpen(false); resetForm(); }}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs py-3 rounded-xl transition-colors">
                                    إلغاء
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-orange-glow transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    <span>نشر الوصفة فوراً</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
