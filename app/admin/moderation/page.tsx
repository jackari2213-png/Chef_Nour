'use client';

import React from 'react';
import { MessageSquare, Check, X, Star } from 'lucide-react';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

export default function AdminModerationPage() {
    const { t, getLocalizedField } = useTranslation();
    const { reviews, approveReview, rejectReview } = useApp();

    return (
        <div className="space-y-6 text-right">
            <div className="border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-black text-white">{t('admin.moderationQueue')}</h1>
                <p className="text-xs text-gray-400 font-medium">{t('admin.moderationQueue')}</p>
            </div>

            <div className="space-y-4">
                {reviews.map((rev) => (
                    <div key={rev.id} className="bg-gray-900 rounded-3xl p-6 border border-gray-800 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <img src={rev.user_avatar} alt={rev.user_name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-extrabold text-sm text-white">{rev.user_name}</h4>
                                    <p className="text-xs text-brand-400 font-bold">{rev.recipe_title_ar}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${rev.moderation_status === 'approved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                                    {rev.moderation_status === 'approved' ? t('comments.approved') : t('comments.pending')}
                                </span>

                                {rev.moderation_status === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => approveReview(rev.id)}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>{t('admin.approve')}</span>
                                        </button>
                                        <button
                                            onClick={() => rejectReview(rev.id)}
                                            className="bg-red-950 text-red-400 hover:bg-red-600 hover:text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>{t('admin.reject')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-300 bg-gray-950 p-4 rounded-2xl border border-gray-800 font-medium">
                            "{rev.comment}"
                        </p>

                        {rev.photo_url && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 font-bold">{t('admin.followerPhoto')}:</span>
                                <img src={rev.photo_url} alt="تطبيق" className="w-24 h-24 rounded-2xl object-cover border border-gray-800 shadow-md" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
