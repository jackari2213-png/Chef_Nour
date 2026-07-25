'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { Review } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
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

const AdminBadge = () => (
    <span className="inline-flex items-center gap-1 bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        الشيف نور
    </span>
);

// ─── Reply Input Box ──────────────────────────────────────────────────────────

interface ReplyInputProps {
    parentId: string;
    onClose: () => void;
}

function ReplyInput({ parentId, onClose }: ReplyInputProps) {
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
            <div className="mt-3 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs font-bold">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                تم نشر ردك! شكراً 🎉
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-2">
                <img
                    src={isAdmin ? '/chef-nour.jpg' : (user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80')}
                    alt={user?.full_name || 'أنت'}
                    className={`w-8 h-8 rounded-full object-cover shrink-0 ring-2 ${isAdmin ? 'ring-brand-500' : 'ring-gray-200'}`}
                />
                <div className="flex-1 space-y-2">
                    {isAdmin && (
                        <div className="flex items-center gap-1.5 mb-1">
                            <AdminBadge />
                            <span className="text-[10px] text-gray-400 font-medium">تردين كـ الشيف نور</span>
                        </div>
                    )}
                    <textarea
                        autoFocus
                        rows={2}
                        placeholder={isAdmin ? 'اكتبي ردك الرسمي كالشيف نور...' : 'اكتب ردك هنا...'}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full text-sm bg-white border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-2xl px-3 py-2 text-right text-gray-800 resize-none outline-none transition-all placeholder-gray-400"
                    />
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={onClose}
                            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-xl transition-colors">
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={!text.trim() || submitting}
                            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M13 7l5 5-5 5" />
                            </svg>
                            نشر الرد
                        </button>
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
                                <span className="text-[10px] text-gray-400 font-medium">{timeAgo(review.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderation status badge (top-level only) */}
                    {isTop && (
                        <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border ${review.moderation_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                            {review.moderation_status === 'approved' ? '✓ منشور' : '⏳ قيد المراجعة'}
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
                        <img src={review.photo_url} alt="صورة التطبيق" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
                        رد
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
    const { user, addReview } = useApp();
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [done, setDone] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        addReview({
            user_id: user?.id || 'usr-guest',
            user_name: user?.full_name || 'زائر',
            user_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            is_admin: user?.role === 'admin',
            recipe_id: recipeId,
            recipe_title_ar: recipeTitle,
            rating,
            comment: text.trim(),
            parent_id: null,
        });
        setDone(true);
        setText('');
        setTimeout(() => setDone(false), 3000);
    };

    if (done) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-emerald-700 font-bold text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                تم إرسال تعليقك للمراجعة — شكراً لك! ❤️
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 text-sm text-right flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                شاركينا تجربتك مع الوصفة
            </h3>

            {/* Star Rating Picker */}
            <div className="flex items-center gap-1 justify-end">
                <span className="text-xs text-gray-500 font-medium ml-2">تقييمك:</span>
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

            {/* Text area */}
            <textarea
                rows={3}
                required
                placeholder="هل جربتي الوصفة؟ شاركينا النتيجة، النصيحة، أو السؤال..."
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
                نشر التعليق
            </button>
        </form>
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
    const { reviews } = useApp();

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

    const displayed = limit ? tree.slice(0, limit) : tree;

    return (
        <div className="space-y-6">
            {/* Thread list */}
            {displayed.length > 0 ? (
                <div className="space-y-4">
                    {displayed.map(review => (
                        <CommentCard key={review.id} review={review} depth={0} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-500">كن أول من يعلق ويشارك تجربته!</p>
                </div>
            )}

            {/* New comment form */}
            {showForm && (
                <NewCommentForm recipeId={recipeId || 'general'} recipeTitle={recipeTitle} />
            )}
        </div>
    );
}
