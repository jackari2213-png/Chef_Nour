'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Grid,
    Plus,
    Trash2,
    Edit,
    Search,
    CheckCircle2,
    X,
    Upload,
    Image as ImageIcon,
    Loader2,
    Utensils
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Category } from '@/types';
import { compressImageFile } from '@/lib/imageUtils';

export default function AdminCategoriesPage() {
    const { categories, recipes, addCategory, updateCategory, deleteCategory } = useApp();
    const [search, setSearch] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form fields
    const [nameAr, setNameAr] = useState('');
    const [slug, setSlug] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Compute dynamic count per category
    const getCategoryRecipeCount = (catId: string, catNameAr: string) => {
        return recipes.filter(r => r.category_id === catId || r.category_name_ar === catNameAr).length;
    };

    const filtered = categories.filter(c =>
        c.name_ar.includes(search) || c.slug.includes(search)
    );

    const resetForm = () => {
        setNameAr('');
        setSlug('');
        setImageUrl('');
        setEditingCategory(null);
    };

    const handleOpenEdit = (cat: Category) => {
        setEditingCategory(cat);
        setNameAr(cat.name_ar);
        setSlug(cat.slug);
        setImageUrl(cat.image_url);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const compressed = await compressImageFile(file);
            setImageUrl(compressed);
        } catch (err) {
            console.error('Failed to compress image:', err);
        }
        e.target.value = '';
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameAr.trim()) return;

        setIsSubmitting(true);
        const autoSlug = slug.trim() || nameAr.trim().toLowerCase().replace(/\s+/g, '-');

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, {
                    name_ar: nameAr,
                    slug: autoSlug,
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                });
                setSuccessMessage(`تم تحديث تصنيف "${nameAr}" بنجاح!`);
            } else {
                await addCategory({
                    name_ar: nameAr,
                    name_fr: '',
                    name_en: '',
                    slug: autoSlug,
                    image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                });
                setSuccessMessage(`تم إضافة تصنيف "${nameAr}" جديد بنجax!`);
            }

            setIsAddModalOpen(false);
            resetForm();
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            alert('حدث خطأ أثناء حفظ التصنيف.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <Grid className="w-6 h-6 text-brand-500" />
                        إدارة تصنيفات الوصفات
                    </h1>
                    <p className="text-xs text-gray-400 font-medium">إضافة، تعديل، وحذف تصنيفات المأكولات المعروضة في الشيف نور</p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-orange-glow transition-all flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تصنيف جديد</span>
                </button>
            </div>

            {/* Notification Banner */}
            {successMessage && (
                <div className="bg-emerald-950 text-emerald-300 p-4 rounded-2xl border border-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="البحث في التصنيفات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pr-4 pl-10 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((cat) => {
                    const count = getCategoryRecipeCount(cat.id, cat.name_ar);
                    return (
                        <div
                            key={cat.id}
                            className="bg-gray-900 border border-gray-800 rounded-3xl p-4 flex flex-col justify-between hover:border-gray-700 transition-all shadow-lg group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={cat.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                                    alt={cat.name_ar}
                                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-800 group-hover:scale-105 transition-transform"
                                />
                                <div className="min-w-0">
                                    <h3 className="font-black text-white text-base truncate">{cat.name_ar}</h3>
                                    <p className="text-[11px] text-gray-400 font-mono">/{cat.slug}</p>
                                    <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-brand-400 bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-900">
                                        <Utensils className="w-3 h-3" />
                                        <span>{count} وصفات</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-800">
                                <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="p-2 text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>تعديل</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`هل أنت تأكد من حذف تصنيف "${cat.name_ar}"؟`)) {
                                            deleteCategory(cat.id);
                                        }
                                    }}
                                    className="p-2 text-red-400 hover:text-white bg-red-950/60 hover:bg-red-600 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>حذف</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ADD / EDIT CATEGORY MODAL */}
            {(isAddModalOpen || editingCategory) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                {editingCategory ? <Edit className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-brand-500" />}
                                {editingCategory ? `تعديل تصنيف: ${editingCategory.name_ar}` : 'إضافة تصنيف جديد'}
                            </h3>
                            <button
                                onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 text-right">
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1.5">اسم التصنيف (بالعربية) *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: حلويات مغربية، أطباق رمضانية"
                                    value={nameAr}
                                    onChange={e => setNameAr(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1.5">الرابط الفرعي (Slug)</label>
                                <input
                                    type="text"
                                    placeholder="مثال: sweets, main-dishes (اختياري)"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2 bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
                                <label className="text-xs font-bold text-white flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-brand-500" />
                                    صورة التصنيف
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="رابط صورة مباشر..."
                                        value={imageUrl.startsWith('data:') ? '📷 صورة مرفوعة مضغوطة' : imageUrl}
                                        onChange={e => setImageUrl(e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                                    />
                                    <label className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>رفع من الجهاز</span>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>

                                {imageUrl && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 mt-2">
                                        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-xs font-black bg-brand-500 hover:bg-brand-600 text-white shadow-orange-glow flex items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    <span>حفظ التصنيف</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
