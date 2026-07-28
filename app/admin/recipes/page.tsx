'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Utensils,
    Plus,
    Trash2,
    Edit,
    Eye,
    Search,
    CheckCircle2,
    X,
    Upload,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Recipe } from '@/types';
import { compressImageFile } from '@/lib/imageUtils';

interface IngredientRow { id: string; item_ar: string; amount: string; }
interface StepRow { id: string; step_number: number; instruction_ar: string; image_url?: string; }

export default function AdminRecipesPage() {
    const { recipes, deleteRecipe, updateRecipe, categories } = useApp();
    const [search, setSearch] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Edit Modal State
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [prepTime, setPrepTime] = useState(20);
    const [cookTime, setCookTime] = useState(40);
    const [servings, setServings] = useState(4);
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
    const [steps, setSteps] = useState<StepRow[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const filtered = recipes.filter(r =>
        r.title_ar.includes(search) || r.category_name_ar.includes(search)
    );

    const handleOpenEditModal = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setTitle(recipe.title_ar);
        setCategory(recipe.category_id || (categories[0]?.id || 'cat-1'));
        setDifficulty(recipe.difficulty);
        setPrepTime(recipe.prep_time_minutes);
        setCookTime(recipe.cook_time_minutes);
        setServings(recipe.servings);
        setDescription(recipe.description_ar);
        setMainImage(recipe.main_image);
        setGalleryImages(recipe.gallery_images || []);
        setIngredients(
            recipe.ingredients?.length
                ? recipe.ingredients.map((ing, i) => ({ id: ing.id || 'ing-' + i, item_ar: ing.item_ar, amount: ing.amount }))
                : [{ id: 'ing-1', item_ar: '', amount: '' }]
        );
        setSteps(
            recipe.steps?.length
                ? recipe.steps.map((st, i) => ({ id: st.id || 'step-' + i, step_number: st.step_number || (i + 1), instruction_ar: st.instruction_ar, image_url: st.image_url }))
                : [{ id: 'step-1', step_number: 1, instruction_ar: '' }]
        );
    };

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
                console.error('Image compression error:', err);
            }
        }
        e.target.value = '';
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecipe || !title.trim() || !description.trim()) return;

        setIsSaving(true);
        const selectedCat = categories.find(c => c.id === category) || categories[0];

        try {
            await updateRecipe(editingRecipe.id, {
                title_ar: title,
                description_ar: description,
                category_id: selectedCat?.id || category,
                category_name_ar: selectedCat?.name_ar || 'أطباق مغربية',
                difficulty,
                prep_time_minutes: Number(prepTime),
                cook_time_minutes: Number(cookTime),
                servings: Number(servings),
                main_image: mainImage,
                gallery_images: galleryImages,
                ingredients: ingredients.filter(i => i.item_ar.trim()),
                steps: steps.filter(s => s.instruction_ar.trim()),
            });

            setSuccessMessage(`تم تحديث الوصفة "${title}" بنجاح!`);
            setEditingRecipe(null);
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            alert('حدث خطأ أثناء حفظ التعديلات.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-white">إدارة الوصفات (CMS)</h1>
                    <p className="text-xs text-gray-400 font-medium">عرض، تعديل، وحذف الوصفات المنشورة في المنصة</p>
                </div>

                <Link
                    href="/admin"
                    className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-orange-glow transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة وصفة جديدة</span>
                </Link>
            </div>

            {/* Notification Banner */}
            {successMessage && (
                <div className="bg-emerald-950 text-emerald-300 p-4 rounded-2xl border border-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Search Filter */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="البحث باسم الوصفة أو القسم..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pr-4 pl-10 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Recipes Table */}
            <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-gray-950 text-gray-400 font-extrabold border-b border-gray-800">
                            <tr>
                                <th className="p-4">الوصفة</th>
                                <th className="p-4">الفئة</th>
                                <th className="p-4">الصعوبة</th>
                                <th className="p-4">وقت الطبخ</th>
                                <th className="p-4">المشاهدات</th>
                                <th className="p-4">التقييم</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                            {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-850 transition-colors">
                                    <td className="p-4 font-bold text-white flex items-center gap-3">
                                        <img src={r.main_image} alt={r.title_ar} className="w-10 h-10 rounded-xl object-cover" />
                                        <span>{r.title_ar}</span>
                                    </td>
                                    <td className="p-4 font-semibold">{r.category_name_ar}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                            {r.difficulty === 'easy' ? 'سهل' : r.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold">{r.cook_time_minutes} دقيقة</td>
                                    <td className="p-4 font-semibold text-brand-400">
                                        {r.views_count >= 1000 ? (r.views_count / 1000).toFixed(1) + 'K' : r.views_count.toString()}
                                    </td>
                                    <td className="p-4 font-bold text-amber-400">⭐ {r.rating_avg.toFixed(1)}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                                            <CheckCircle2 className="w-3 h-3" /> منشور
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/recipes/${r.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
                                                title="معاينة"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleOpenEditModal(r)}
                                                className="p-2 text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 rounded-lg transition-colors"
                                                title="تعديل الوصفة"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`هل أنت تأكد من حذف وصفة "${r.title_ar}"؟`)) {
                                                        deleteRecipe(r.id);
                                                    }
                                                }}
                                                className="p-2 text-red-400 hover:text-white bg-red-950/60 hover:bg-red-600 rounded-lg transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT RECIPE MODAL */}
            {editingRecipe && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-amber-400" />
                                تعديل الوصفة: {editingRecipe.title_ar}
                            </h2>
                            <button onClick={() => setEditingRecipe(null)} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-6 text-right">
                            {/* Title & Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">عنوان الوصفة *</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">الفئة</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name_ar}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Difficulty, Times & Servings */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">الصعوبة</label>
                                    <select
                                        value={difficulty}
                                        onChange={e => setDifficulty(e.target.value as any)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                    >
                                        <option value="easy">سهل</option>
                                        <option value="medium">متوسط</option>
                                        <option value="hard">صعب</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">التحضير (دقيقة)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={prepTime}
                                        onChange={e => setPrepTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">الطبخ (دقيقة)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={cookTime}
                                        onChange={e => setCookTime(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 block mb-1.5">عدد الأشخاص</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={servings}
                                        onChange={e => setServings(Number(e.target.value))}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="space-y-4 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                                <label className="text-xs font-black text-white flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-brand-500" />
                                    تعديل صور الوصفة
                                </label>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 block mb-1">الصورة الرئيسية</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={mainImage.startsWith('data:') ? '📷 صورة مرفوعة من الجهاز' : mainImage}
                                            onChange={e => setMainImage(e.target.value)}
                                            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                                        />
                                        <label className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>رفع جديد</span>
                                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, true)} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 block mb-1">إضافة صور لمعرض الوصفة</label>
                                    <label className="flex items-center justify-center p-3 border border-dashed border-gray-700 hover:border-brand-500 bg-gray-900 rounded-xl cursor-pointer text-xs font-bold text-white gap-2">
                                        <Upload className="w-4 h-4 text-brand-500" />
                                        <span>رفع صور إضافية من الجهاز (PC أو الهاتف 📱)</span>
                                        <input type="file" accept="image/*" multiple onChange={e => handleFileUpload(e, false)} className="hidden" />
                                    </label>
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                                    {mainImage && (
                                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand-500">
                                            <img src={mainImage} alt="main" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-0 inset-x-0 bg-brand-500 text-white text-[8px] font-black text-center">الرئيسية</span>
                                        </div>
                                    )}
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group">
                                            <img src={img} alt={`gal-${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1.5">الوصف المختصر *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                                />
                            </div>

                            {/* Submit buttons */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-800 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingRecipe(null)}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-white"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-brand-500 hover:bg-brand-600 text-white shadow-orange-glow flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    <span>حفظ التغييرات في قاعدة البيانات</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
