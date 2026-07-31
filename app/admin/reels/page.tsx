'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Play, Eye, EyeOff, Film, Link2, Clock, Loader2, Check, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';

interface Reel {
    id: string;
    title_ar: string;
    title_fr?: string | null;
    video_url: string;
    thumbnail_url?: string | null;
    duration_seconds?: number | null;
    recipe_id?: string | null;
    is_published: boolean;
    views_count: number;
    created_at: string;
}

const EMPTY: Omit<Reel, 'id' | 'views_count' | 'created_at'> = {
    title_ar: '',
    title_fr: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: undefined,
    recipe_id: undefined,
    is_published: true,
};

export default function AdminReelsPage() {
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Reel | null>(null);
    const [form, setForm] = useState({ ...EMPTY });
    const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    useEffect(() => {
        fetchReels();
    }, []);

    const fetchReels = async () => {
        setLoading(true);
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }
        const { data } = await supabase
            .from('cooking_reels')
            .select('*')
            .order('created_at', { ascending: false });
        const toReel = (r: any): Reel => ({
            ...r,
            title_fr: r.title_fr ?? undefined,
            thumbnail_url: r.thumbnail_url ?? undefined,
            duration_seconds: r.duration_seconds ?? undefined,
            recipe_id: r.recipe_id ?? undefined,
        });
        setReels((data || []).map(toReel));
        setLoading(false);
    };

    const openNew = () => {
        setEditing(null);
        setForm({ ...EMPTY });
        setShowForm(true);
        setMsg(null);
    };

    const openEdit = (reel: Reel) => {
        setEditing(reel);
        setForm({
            title_ar: reel.title_ar,
            title_fr: reel.title_fr || '',
            video_url: reel.video_url,
            thumbnail_url: reel.thumbnail_url || '',
            duration_seconds: reel.duration_seconds,
            recipe_id: reel.recipe_id,
            is_published: reel.is_published,
        });
        setShowForm(true);
        setMsg(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title_ar.trim() || !form.video_url.trim()) return;
        setSaving(true);
        try {
            const payload = {
                title_ar: form.title_ar.trim(),
                title_fr: form.title_fr?.trim() || null,
                video_url: form.video_url.trim(),
                thumbnail_url: form.thumbnail_url?.trim() || null,
                duration_seconds: form.duration_seconds || null,
                recipe_id: form.recipe_id || null,
                is_published: form.is_published,
            };

            if (editing) {
                const { error } = await supabase.from('cooking_reels').update(payload).eq('id', editing.id);
                if (error) throw error;
                setReels(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
            } else {
                const { data, error } = await supabase.from('cooking_reels').insert(payload).select().single();
                if (error) throw error;
                if (data) {
                    const toReel = (r: any): Reel => ({
                        ...r,
                        title_fr: r.title_fr ?? undefined,
                        thumbnail_url: r.thumbnail_url ?? undefined,
                        duration_seconds: r.duration_seconds ?? undefined,
                        recipe_id: r.recipe_id ?? undefined,
                    });
                    setReels(prev => [toReel(data), ...prev]);
                }
            }

            setMsg({ type: 'ok', text: editing ? 'تم التحديث بنجاح ✓' : 'تم الإضافة بنجاح ✓' });
            setShowForm(false);
        } catch (err: any) {
            setMsg({ type: 'err', text: err.message || 'حدث خطأ' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل تريدين حذف هذا الريل؟')) return;
        setReels(prev => prev.filter(r => r.id !== id));
        if (isSupabaseConfigured()) {
            await supabase.from('cooking_reels').delete().eq('id', id);
        }
    };

    const togglePublish = async (reel: Reel) => {
        const next = !reel.is_published;
        setReels(prev => prev.map(r => r.id === reel.id ? { ...r, is_published: next } : r));
        if (isSupabaseConfigured()) {
            await supabase.from('cooking_reels').update({ is_published: next }).eq('id', reel.id);
        }
    };

    const input = 'w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all';

    return (
        <div className="space-y-6 text-right">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Film className="w-6 h-6 text-brand-500" />
                        ريلز الطبخ
                    </h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">إدارة مقاطع الفيديو القصيرة</p>
                </div>
                <button onClick={openNew} className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-orange-glow transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة ريل
                </button>
            </div>

            {/* Message */}
            {msg && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {msg.type === 'ok' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {msg.text}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-4">
                    <h2 className="text-lg font-black text-gray-900">{editing ? 'تعديل الريل' : 'إضافة ريل جديد'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">العنوان بالعربية *</label>
                                <input type="text" required className={input} value={form.title_ar}
                                    onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} placeholder="مثال: كيك الشوكولاتة في 3 دقائق" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">العنوان بالفرنسية</label>
                                <input type="text" className={input} value={form.title_fr || ''}
                                    onChange={e => setForm(f => ({ ...f, title_fr: e.target.value }))} placeholder="Titre en français" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1"><Link2 className="w-3 h-3" /> رابط الفيديو (YouTube / TikTok) *</label>
                            <input type="url" required className={input} value={form.video_url}
                                onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://youtube.com/shorts/..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">رابط الصورة المصغرة</label>
                                <input type="url" className={input} value={form.thumbnail_url || ''}
                                    onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> المدة (بالثواني)</label>
                                <input type="number" className={input} value={form.duration_seconds || ''}
                                    onChange={e => setForm(f => ({ ...f, duration_seconds: parseInt(e.target.value) || undefined }))} placeholder="60" />
                            </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" checked={form.is_published}
                                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                                className="w-4 h-4 accent-orange-500" />
                            <span className="text-xs font-bold text-gray-700">منشور (مرئي للزوار)</span>
                        </label>
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={saving}
                                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-orange-glow transition-all flex items-center gap-2 disabled:opacity-60">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {saving ? 'جارٍ الحفظ...' : (editing ? 'تحديث' : 'إضافة')}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all">
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reels Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
            ) : reels.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <Film className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-700 mb-1">لا توجد ريلز بعد</h3>
                    <p className="text-xs text-gray-400 mb-4">أضيفي أول ريل طبخ لمشاركته مع متابعيك</p>
                    <button onClick={openNew} className="inline-flex items-center gap-2 bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                        <Plus className="w-4 h-4" /> إضافة ريل
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reels.map(reel => (
                        <div key={reel.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${!reel.is_published ? 'opacity-60' : 'border-gray-100'}`}>
                            {reel.thumbnail_url ? (
                                <div className="relative aspect-video bg-gray-100">
                                    <img src={reel.thumbnail_url} alt={reel.title_ar} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                                            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                        </div>
                                    </div>
                                    {reel.duration_seconds && (
                                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            {Math.floor(reel.duration_seconds / 60)}:{String(reel.duration_seconds % 60).padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    <Film className="w-10 h-10 text-gray-300" />
                                </div>
                            )}
                            <div className="p-4 space-y-2">
                                <h3 className="font-extrabold text-sm text-gray-900 line-clamp-1">{reel.title_ar}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => openEdit(reel)} className="p-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => togglePublish(reel)} className="p-1.5 bg-gray-100 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all" title={reel.is_published ? 'إخفاء' : 'نشر'}>
                                            {reel.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                        <button onClick={() => handleDelete(reel.id)} className="p-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reel.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {reel.is_published ? 'منشور' : 'مخفي'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
