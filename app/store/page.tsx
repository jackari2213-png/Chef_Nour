'use client';

import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';
import { useTranslation } from '@/lib/useTranslation';

export default function ComingSoonEbooks() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsLoading(true);
        setError('');

        try {
            if (isSupabaseConfigured()) {
                const { error: dbError } = await supabase
                    .from('newsletter_subscriptions')
                    .insert({ email: email.trim().toLowerCase() });

                if (dbError && dbError.code !== '23505') {
                    // 23505 = unique_violation (already subscribed) — treat as success
                    throw dbError;
                }
            }
            setSubmitted(true);
        } catch (err) {
            setError(t('store.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-[85vh] flex items-center justify-center bg-gray-950 overflow-hidden py-16">
            {/* صورة الخلفية فيها كتوب ديال الطياب مكدسين */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1920&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/40" />

            {/* المحتوى */}
            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                <div className="inline-block mb-6 p-5 bg-brand-500 rounded-full shadow-orange-glow animate-pulse">
                    {/* أيقونة ديال كتاب */}
                    <BookOpen className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">
                    {t('store.title')}
                </h1>

                <h2 className="text-3xl md:text-5xl font-extrabold text-brand-400 mb-6 drop-shadow-md">
                    {t('store.subtitle')}
                </h2>

                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t('store.description')}
                </p>

                {!submitted ? (
                    <div className="max-w-md mx-auto space-y-3">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('store.emailPlaceholder')}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-right"
                            />
                            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-extrabold rounded-2xl transition-all shadow-orange-glow shrink-0 hover:scale-105 flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {t('store.buyNow')}
                            </button>
                        </form>
                        {error && <p className="text-red-400 text-sm font-semibold text-center">{error}</p>}
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 px-6 py-4 rounded-2xl text-base font-bold shadow-lg backdrop-blur-md">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <span>{t('store.thankYou')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
