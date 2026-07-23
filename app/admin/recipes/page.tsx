'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Utensils, Plus, Trash2, Edit, Eye, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function AdminRecipesPage() {
    const { recipes, deleteRecipe } = useApp();
    const [search, setSearch] = useState('');

    const filtered = recipes.filter(r =>
        r.title_ar.includes(search) || r.category_name_ar.includes(search)
    );

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
                                    <td className="p-4 font-semibold text-brand-400">{(r.views_count / 1000).toFixed(1)}K</td>
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
                                                onClick={() => deleteRecipe(r.id)}
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

        </div>
    );
}
