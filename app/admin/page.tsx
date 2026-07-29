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
    Upload,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { compressImageFile } from '@/lib/imageUtils';
import { useTranslation } from '@/lib/useTranslation';

interface IngredientRow { id: string; item_ar: string; amount: string; }
interface StepRow { id: string; step_number: number; instruction_ar: string; image_url?: string; }

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const { reviews, approveReview, rejectReview, recipes, addRecipe, orders, categories } = useApp();
    const pendingReviews = reviews.filter(r => r.moderation_status === 'pending');
    const totalViews = recipes.reduce((sum, r) => sum + (r.views_count || 0), 0);
    const totalViewsFormatted = totalViews >= 1000000 ? (totalViews / 1000000).toFixed(1) + 'M' : totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews.toString();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [recipeAdded, setRecipeAdded] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(categories[0]?.id || 'cat-1');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [prepTime, setPrepTime] = useState(20);
    const [cookTime, setCookTime] = useState(40);
    const [servings, setServings] = useState(4);
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
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

    // File Upload Handler for PC / Mobile with Compression
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        for (const file of Array.from(files)) {
            try {
                const compressedUrl = await compressImageFile(file);
                if (isMain) {
                    setMainImage(compressedUrl);
                } else {
                    setGalleryImages(prev => [...prev, compressedUrl]);
                }
            } catch (err) {
                console.error('Image compression failed:', err);
            }
        }

        // Reset input value so same file can be selected again
        e.target.value = '';
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
        setMainImage('');
        setGalleryImages([]);
        setNewImageUrl('');
        setPrepTime(20); setCookTime(40); setServings(4);
    };

    const handleAddRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        if (steps.some(s => !s.instruction_ar.trim())) {
            alert(t('admin.fillAllSteps'));
            return;
        }

        const selectedCat = categories.find(c => c.id === category) || categories[0];

        addRecipe({
            title_ar: title,
            slug: 'recipe-' + Date.now(),
            description_ar: description,
            category_id: selectedCat?.id || category,
            category_name_ar: selectedCat?.name_ar || 'أطباق مغربية',
            difficulty,
            prep_time_minutes: Number(prepTime),
            cook_time_minutes: Number(cookTime),
            servings: Number(servings),
            main_image: mainImage || 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80',
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
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{t('admin.dashboardTitle')}</h1>
                    <p className="text-xs text-gray-400 font-medium">{t('admin.dashboardSubtitle')}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                    {t('admin.systemStatus')}
                </span>
            </div>

            {/* Success confirmation */}
            {recipeAdded && (
                <div className="bg-emerald-950 text-emerald-300 p-4 rounded-2xl border border-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {t('admin.recipePublished')}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative group bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-brand-500/50 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-500/10 transition-all" />
                    <div className="flex items-center justify-between text-slate-400 relative z-10">
                        <span className="text-xs font-bold">{t('admin.statsTotalRecipes')}</span>
                        <Utensils className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex items-baseline justify-between relative z-10">
                        <span className="text-3xl font-black text-white">{recipes.length}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">{t('admin.real')}</span>
                    </div>
                </div>
                <div className="relative group bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-blue-500/50 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all" />
                    <div className="flex items-center justify-between text-slate-400 relative z-10">
                        <span className="text-xs font-bold">{t('admin.statsBookSales')}</span>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex items-baseline justify-between relative z-10">
                        <span className="text-3xl font-black text-white">{orders.length}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">{t('admin.real')}</span>
                    </div>
                </div>
                <div className="relative group bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-amber-500/50 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-all" />
                    <div className="flex items-center justify-between text-slate-400 relative z-10">
                        <span className="text-xs font-bold">{t('admin.statsPendingReviews')}</span>
                        <MessageSquare className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between relative z-10">
                        <span className="text-3xl font-black text-white">{pendingReviews.length}</span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full">{t('admin.pending')}</span>
                    </div>
                </div>
                <div className="relative group bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-5 border border-slate-700 space-y-3 hover:border-purple-500/50 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-all" />
                    <div className="flex items-center justify-between text-slate-400 relative z-10">
                        <span className="text-xs font-bold">{t('admin.statsTotalViews')}</span>
                        <Eye className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex items-baseline justify-between relative z-10">
                        <span className="text-3xl font-black text-white">{totalViewsFormatted}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">{t('admin.real')}</span>
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
                            {t('admin.moderationQueue')} ({pendingReviews.length})
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
                                            className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-colors" title={t('admin.approve')}>
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => rejectReview(rev.id)}
                                            className="w-9 h-9 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-colors" title={t('admin.reject')}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-medium">{t('admin.noPendingReviews')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Add Recipe CTA */}
                    <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 text-white space-y-3 shadow-orange-glow">
                        <ChefHat className="w-8 h-8" />
                        <h3 className="text-lg font-black">{t('admin.quickActions')}</h3>
                        <p className="text-xs text-orange-100 font-medium">{t('admin.addQuickRecipe')}</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full bg-white text-brand-600 font-extrabold text-xs py-3 rounded-2xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t('admin.addRecipe')}</span>
                        </button>
                    </div>

                    {/* Recent Recipes list */}
                    <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 space-y-3">
                        <h4 className="text-xs font-black text-white border-b border-slate-700 pb-2">{t('admin.recentRecipes')}</h4>
                        {recipes.slice(0, 5).map(r => (
                            <div key={r.id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-700/50 transition-colors">
                                <img src={r.main_image} alt={r.title_ar} className="w-8 h-8 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-200 truncate">{r.title_ar}</p>
                                    <p className="text-[10px] text-slate-400">{r.category_name_ar}</p>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-bold shrink-0">{t('admin.published')}</span>
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
                                {t('admin.addRecipe')}
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
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.recipeTitle')} *</label>
                                    <input required type="text" placeholder={t('admin.recipeTitlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.category')}</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none">
                                        {categories.map(c => (<option key={c.id} value={c.id}>{c.name_ar}</option>))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.difficulty')}</label>
                                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none">
                                        <option value="easy">{t('admin.easy')}</option>
                                        <option value="medium">{t('admin.medium')}</option>
                                        <option value="hard">{t('admin.hard')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.prepTime')}</label>
                                    <input type="number" min="1" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.cookTime')}</label>
                                    <input type="number" min="1" value={cookTime} onChange={e => setCookTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none" />
                                </div>

                                {/* Multi-Image & Gallery Management Section */}
                                <div className="sm:col-span-2 space-y-4 bg-gray-950 p-4 sm:p-5 rounded-2xl border border-gray-800 shadow-inner">
                                    <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                                        <label className="text-xs font-black text-white flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-brand-500" />
                                            {t('admin.imageGallery')}
                                        </label>
                                        <span className="text-[10px] bg-brand-950 text-brand-400 font-extrabold px-2.5 py-1 rounded-full border border-brand-800">
                                            {t('admin.totalImages', { count: (mainImage ? 1 : 0) + galleryImages.length })}
                                        </span>
                                    </div>

                                    {/* 1. Main Cover Image Section */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-300 block">{t('admin.mainImage')}</label>
                                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                                            <input
                                                type="text"
                                                placeholder={t('admin.imageUrlPlaceholder')}
                                                value={mainImage.startsWith('data:') ? '📷 صورة مرفوعة من الجهاز' : mainImage}
                                                onChange={e => setMainImage(e.target.value)}
                                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <label className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-orange-glow flex items-center justify-center gap-2 shrink-0">
                                                <Upload className="w-4 h-4" />
                                                <span>{t('admin.uploadFromDevice')}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, true)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* 2. Additional Gallery Images Section */}
                                    <div className="space-y-2 pt-1 border-t border-gray-850">
                                        <label className="text-[11px] font-bold text-gray-300 block">{t('admin.additionalImages')}</label>

                                        {/* PC / Mobile Multi-file Dropzone button */}
                                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-700 hover:border-brand-500 bg-gray-900/60 hover:bg-gray-900 rounded-2xl cursor-pointer transition-all group text-center">
                                            <Upload className="w-6 h-6 text-brand-500 group-hover:scale-110 transition-transform mb-1" />
                                            <span className="text-xs font-black text-white">{t('admin.uploadImages')}</span>
                                            <span className="text-[10px] text-gray-400 mt-0.5">{t('admin.uploadImagesHint')}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleFileUpload(e, false)}
                                                className="hidden"
                                            />
                                        </label>

                                        {/* Direct URL Input fallback */}
                                        <div className="flex gap-2 pt-1">
                                            <input
                                                type="url"
                                                    placeholder={t('admin.imageUrlPlaceholder')}
                                                value={newImageUrl}
                                                onChange={e => setNewImageUrl(e.target.value)}
                                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addGalleryImage(newImageUrl)}
                                                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1 shrink-0 border border-gray-700"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>{t('admin.addLink')}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3. Thumbnails Grid Preview */}
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                                        {/* Main image thumbnail */}
                                        {mainImage ? (
                                            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-brand-500 shadow-md group">
                                                <img src={mainImage} alt="main" className="w-full h-full object-cover" />
                                                <span className="absolute bottom-0 inset-x-0 bg-brand-500 text-white text-[9px] font-black text-center py-0.5">{t('admin.main')}</span>
                                            </div>
                                        ) : (
                                            <div className="relative aspect-square rounded-xl overflow-hidden border border-dashed border-gray-700 bg-gray-900/50 flex flex-col items-center justify-center text-center p-1 text-gray-500">
                                                <ImageIcon className="w-5 h-5 mb-1 text-gray-600" />
                                                <span className="text-[9px] font-bold">{t('admin.noMainImage')}</span>
                                            </div>
                                        )}

                                        {/* Gallery thumbnails */}
                                        {galleryImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 shadow-md group">
                                                <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title={t('admin.deleteImage')}
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
                                                    {t('admin.makeMain')}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">{t('admin.shortDescription')} *</label>
                                    <textarea required rows={3} placeholder={t('admin.descriptionPlaceholder')} value={description} onChange={e => setDescription(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500" />
                                </div>
                            </div>

                            {/* Dynamic Ingredients */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-white">{t('admin.ingredients')} ({ingredients.length})</h3>
                                    <button type="button" onClick={addIngredient}
                                        className="bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>{t('admin.addIngredient')}</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {ingredients.map((ing, idx) => (
                                        <div key={ing.id} className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-bold w-5 shrink-0">{idx + 1}.</span>
                                            <input
                                                type="text" placeholder={t('admin.ingredientName')}
                                                value={ing.item_ar}
                                                onChange={e => updateIngredient(ing.id, 'item_ar', e.target.value)}
                                                className="flex-1 bg-gray-950 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <input
                                                type="text" placeholder={t('admin.amount')}
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
                                    <h3 className="text-sm font-black text-white">{t('admin.instructions')} ({steps.length} {t('admin.steps')})</h3>
                                    <button type="button" onClick={addStep}
                                        className="bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>{t('admin.addStep')}</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {steps.map((step, idx) => (
                                        <div key={step.id} className="bg-gray-950 rounded-2xl p-4 border border-gray-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-extrabold text-brand-400">{t('admin.step')} {step.step_number}</span>
                                                {steps.length > 1 && (
                                                    <button type="button" onClick={() => removeStep(step.id)}
                                                        className="p-1 text-red-400 hover:bg-red-950 rounded-lg text-xs">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <textarea rows={2} required
                                                placeholder={t('admin.stepInstructionPlaceholder', { number: step.step_number })}
                                                value={step.instruction_ar}
                                                onChange={e => updateStep(step.id, 'instruction_ar', e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                            />
                                            <input type="url" placeholder={t('admin.stepImagePlaceholder')}
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
                                    {t('common.cancel')}
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-orange-glow transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    <span>{t('common.save')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
