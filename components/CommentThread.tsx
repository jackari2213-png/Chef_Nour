'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { Review } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import { useTranslation } from '@/lib/useTranslation';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string, t: (key: string, params?: Record<string, string | number>) => string) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return t('comments.justNow');
    if (diff < 3600) return t('comments.minutesAgo', { count: Math.floor(diff / 60) });
    if (diff < 86400) return t('comments.hoursAgo', { count: Math.floor(diff / 3600) });
    return t('comments.daysAgo', { count: Math.floor(diff / 86400) });
}

function StarRow({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`w-3.5 h-3.5 ${i <= count ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

// ─── Admin Badge ──────────────────────────────────────────────────────────────

const AdminBadge = () => {
    const { t } = useTranslation();
    return (
        <span className="inline-flex items-center gap-1 bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            {t('comments.chefReply')}
        </span>
    );
};

// ─── Reply Input Box ──────────────────────────────────────────────────────────

interface ReplyInputProps {
    parentId: string;
    onClose: () => void;
}

function ReplyInput({ parentId, onClose }: ReplyInputProps) {
    const { t } = useTranslation();
    const { user, addReply } = useApp();
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const isAdmin = user?.role === 'admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitting(true);
        // Optimistic: adds instantly via store
        addReply(parentId, text.trim(), isAdmin);
        setSubmitting(false);
        setDone(true);
        setText('');
        setTimeout(() => { setDone(false); onClose(); }, 1500);
    };

    if (done) {
        return (
            <div className="mt-3 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('comments.commentPending')}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="transition-all duration-300 ease-out" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
            <div className="flex items-start gap-2">
                <img
                    src={isAdmin ? '/chef-nour.jpg' : (user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80')}
                    alt={user?.full_name || t('recipeDetail.yourName')}
                    className={`w-8 h-8 rounded-full object-cover shrink-0 ring-2 ${isAdmin ? 'ring-brand-500' : 'ring-gray-200'}`}
                />
                <div className="flex-1 space-y-2">
                    {isAdmin && (
                        <div className="flex items-center gap-1.5 mb-1">
                            <AdminBadge />
                            <span className="text-[10px] text-gray-400 font-medium">{t('comments.chefReply')}</span>
                        </div>
                    )}
                    <textarea
                        autoFocus
                        rows={2}
                        placeholder={isAdmin ? t('recipeDetail.replyPlaceholder') : t('recipeDetail.replyPlaceholder')}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full text-sm bg-white border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-2xl px-3 py-2 text-right text-gray-800 resize-none outline-none transition-all placeholder-gray-400"
                    />
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={onClose}
                            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-xl transition-colors">
                            {t('common.close')}
                        </button>
                        <button
                            type="submit"
                            disabled={!text.trim() || submitting}
                            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M13 7l5 5-5 5" />
                            </svg>
                            {t('comments.reply')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </form>
    );
}

// ─── Single Comment Card ───────────────────────────────────────────────────────

interface CommentCardProps {
    review: Review;
    depth: number;   // 0 = top-level, 1+ = reply
}

function CommentCard({ review, depth }: CommentCardProps) {
    const { t } = useTranslation();
    const [replyOpen, setReplyOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(review.likes_count ?? 0);
    const isTop = depth === 0;

    const handleLike = () => {
        setLiked(prev => !prev);
        setLocalLikes(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className={`${depth > 0 ? 'border-r-2 border-brand-200 pr-4' : ''}`}>
            {/* Card */}
            <div className={`bg-white rounded-2xl border transition-shadow hover:shadow-md ${isTop ? 'border-gray-100 shadow-sm p-5' : 'border-gray-50 shadow-sm p-4'} space-y-3`}>

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="relative shrink-0">
                            <img
                                src={review.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                                alt={review.user_name}
                                className={`rounded-full object-cover ${isTop ? 'w-10 h-10' : 'w-8 h-8'} ring-2 ${review.is_admin ? 'ring-brand-500' : 'ring-gray-100'}`}
                            />
                            {review.is_admin && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center shadow">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`font-extrabold text-gray-900 truncate ${isTop ? 'text-sm' : 'text-xs'}`}>
                                    {review.user_name}
                                </span>
                                {review.is_admin && <AdminBadge />}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                {isTop && review.rating > 0 && <StarRow count={review.rating} />}
                                <span className="text-[10px] text-gray-400 font-medium">{timeAgo(review.created_at, t)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderation status badge (top-level only) */}
                    {isTop && (
                        <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${review.moderation_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                            {review.moderation_status === 'approved' ? t('comments.approved') : t('comments.pending')}
                        </span>
                    )}
                </div>

                {/* Comment text */}
                <p className={`text-gray-700 leading-relaxed text-right font-medium ${isTop ? 'text-sm' : 'text-xs'}`}>
                    {review.comment}
                </p>

                {/* Photo attachment (top-level only) */}
                {review.photo_url && isTop && (
                    <div className="rounded-2xl overflow-hidden border border-gray-100 max-w-xs aspect-video">
                        <img src={review.photo_url} alt={t('comments.photo')} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${liked ? 'text-brand-500' : 'text-gray-400 hover:text-brand-400'}`}
                    >
                        <svg className={`w-3.5 h-3.5 transition-transform ${liked ? 'scale-110' : ''}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {localLikes > 0 && <span>{localLikes}</span>}
                    </button>

                    {/* Reply */}
                    <button
                        onClick={() => setReplyOpen(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-brand-500 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        {t('comments.reply')}
                    </button>
                </div>

                {/* Reply Input — collapses/expands */}
                {replyOpen && (
                    <ReplyInput parentId={review.id} onClose={() => setReplyOpen(false)} />
                )}
            </div>

            {/* Nested Replies */}
            {review.replies && review.replies.length > 0 && (
                <div className="mt-3 mr-4 space-y-2.5">
                    {review.replies.map(reply => (
                        <CommentCard key={reply.id} review={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── New Top-level Comment Form ───────────────────────────────────────────────

interface NewCommentFormProps {
    recipeId: string;
    recipeTitle?: string;
}

function NewCommentForm({ recipeId, recipeTitle }: NewCommentFormProps) {
    const { t } = useTranslation();
    const { user, addReview } = useApp();
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [done, setDone] = useState(false);

    // Guest identity modal state
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [guestName, setGuestName] = useState(() => {
        try { return localStorage.getItem('chef_nour_guest_name') || ''; } catch { return ''; }
    });
    const [guestEmail, setGuestEmail] = useState(() => {
        try { return localStorage.getItem('chef_nour_guest_email') || ''; } catch { return ''; }
    });

    const submitComment = async (displayName: string, displayAvatar?: string, guestUserId?: string) => {
        const avatarUrl = displayAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=f97316`;

        // Optimistic local update
        addReview({
            user_id: user?.id || guestUserId || '',
            user_name: displayName,
            user_avatar: avatarUrl,
            is_admin: false,
            recipe_id: recipeId,
            recipe_title_ar: recipeTitle,
            rating,
            comment: text.trim(),
            parent_id: null,
        });

        // Persist to Supabase
        if (isSupabaseConfigured()) {
            await supabase.from('reviews').insert({
                user_id: user?.id || null,   // NULL for guests — allowed by RLS
                user_name: displayName,
                user_avatar: avatarUrl,
                is_admin: false,
                recipe_id: recipeId || null,
                recipe_title_ar: recipeTitle || null,
                rating,
                comment: text.trim(),
                parent_id: null,
                moderation_status: 'pending',
            });
        }

        setDone(true);
        setText('');
        setTimeout(() => setDone(false), 3500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (user) {
            // Logged-in user → submit directly
            submitComment(user.full_name, user.avatar_url);
        } else {
            // Guest → show quick identity modal
            setShowIdentityModal(true);
        }
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = guestName.trim() || t('recipeDetail.yourName');
        try {
            localStorage.setItem('chef_nour_guest_name', name);
            if (guestEmail.trim()) localStorage.setItem('chef_nour_guest_email', guestEmail.trim());
        } catch { }
        setShowIdentityModal(false);
        submitComment(name);
    };

    if (done) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center text-emerald-700 font-bold text-sm flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('comments.commentPending')}</span>
                <span className="text-xs text-emerald-500 font-medium">{t('comments.pending')}</span>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                {/* Header with user info */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <img
                                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}&backgroundColor=f97316`}
                                alt={user.full_name}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-200"
                            />
                            <div>
                                <span className="font-bold text-gray-800 text-sm">{user.full_name}</span>
                                <span className="text-[10px] text-gray-400 block">{t('comments.yourComment')}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-brand-500 text-lg">
                                💬
                            </div>
                            <div className="flex-1">
                                <span className="font-black text-gray-900 text-sm">{t('recipeDetail.shareYourThoughts')}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <a href="/login" className="text-[10px] text-brand-500 font-bold hover:underline">{t('comments.loginToComment')}</a>
                                    <span className="text-[10px] text-gray-300">•</span>
                                    <span className="text-[10px] text-gray-400">{t('recipeDetail.leaveReview')}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs text-gray-500 font-medium ml-2">{t('recipeDetail.rating')}:</span>
                    {[1, 2, 3, 4, 5].map(i => (
                        <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(i)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <svg className={`w-6 h-6 transition-colors ${i <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-300'}`}
                                fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Textarea */}
                <textarea
                    rows={3}
                    required
                    placeholder={t('recipeDetail.commentPlaceholder')}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-2xl px-4 py-3 text-right text-gray-800 resize-none outline-none transition-all placeholder-gray-400"
                />

                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3 rounded-2xl transition-all shadow-md hover:shadow-orange-200 hover:shadow-lg flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M13 7l5 5-5 5" />
                    </svg>
                    {t('comments.postComment')}
                </button>
            </form>

            {/* ── Guest Identity Modal ── */}
            {showIdentityModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="text-center space-y-1">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto text-2xl">👋</div>
                            <h3 className="font-black text-gray-900 text-base">{t('recipeDetail.yourName')}</h3>
                            <p className="text-xs text-gray-500">{t('recipeDetail.shareYourThoughts')}</p>
                        </div>

                        <form onSubmit={handleGuestSubmit} className="space-y-3">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">{t('recipeDetail.yourName')} *</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    placeholder={t('recipeDetail.yourName')}
                                    value={guestName}
                                    onChange={e => setGuestName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-400 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
                                />
                            </div>

                            {/* Email (optional) */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                    {t('recipeDetail.yourComment')}
                                    <span className="text-gray-400 font-medium mr-1">({t('comments.photo')})</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    value={guestEmail}
                                    onChange={e => setGuestEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-400 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowIdentityModal(false)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    {t('common.close')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl text-xs font-black bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all"
                                >
                                    {t('comments.postComment')} ✓
                                </button>
                            </div>
                        </form>

                        <div className="text-center border-t border-gray-100 pt-3">
                            <a href="/login" className="text-xs text-brand-500 font-bold hover:underline">
                                {t('recipeDetail.loginToReview')} ←
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Main CommentThread Component ─────────────────────────────────────────────

interface CommentThreadProps {
    recipeId?: string;      // if provided, filters to that recipe only
    recipeTitle?: string;
    showForm?: boolean;     // whether to show the new comment form
    limit?: number;         // how many top-level comments to show (homepage)
}

export default function CommentThread({
    recipeId,
    recipeTitle,
    showForm = true,
    limit,
}: CommentThreadProps) {
    const { t } = useTranslation();
    const { reviews } = useApp();
    const [visibleCount, setVisibleCount] = useState(2);

    // Build tree: flatten list → nested structure
    const tree = useMemo(() => {
        // Filter to relevant recipe (or all if no recipeId given)
        const relevant = recipeId
            ? reviews.filter(r => r.recipe_id === recipeId)
            : reviews;

        // Only show approved top-level reviews publicly
        const topLevel = relevant
            .filter(r => !r.parent_id && r.moderation_status === 'approved')
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        const replyMap: Record<string, Review[]> = {};
        relevant
            .filter(r => r.parent_id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .forEach(r => {
                if (r.parent_id) {
                    replyMap[r.parent_id] = [...(replyMap[r.parent_id] || []), r];
                }
            });

        return topLevel.map(r => ({ ...r, replies: replyMap[r.id] || [] }));
    }, [reviews, recipeId]);

    const displayed = limit ? tree.slice(0, limit) : tree.slice(0, visibleCount);
    const hasMore = !limit && tree.length > visibleCount;

    return (
        <div className="space-y-6">
            {/* Thread list */}
            {displayed.length > 0 ? (
                <div className="space-y-4">
                    {displayed.map(review => (
                        <CommentCard key={review.id} review={review} depth={0} />
                    ))}
                    {hasMore && (
                        <div className="text-center pt-2">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 3)}
                                className="bg-brand-50 hover:bg-brand-100 text-brand-600 font-extrabold text-xs px-6 py-2.5 rounded-2xl border border-brand-200 transition-all shadow-xs flex items-center gap-2 mx-auto"
                            >
                                <span>{t('comments.loadMore')} ({tree.length - visibleCount})</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-500">{t('comments.noComments')}</p>
                </div>
            )}

            {/* New comment form */}
            {showForm && (
                <NewCommentForm recipeId={recipeId || 'general'} recipeTitle={recipeTitle} />
            )}
        </div>
    );
}
