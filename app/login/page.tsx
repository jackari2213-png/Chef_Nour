'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import { supabaseSignIn } from '@/lib/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase-client';
import { useTranslation } from '@/lib/useTranslation';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, login } = useApp();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return;
        setError('');
        setLoading(true);

        try {
            if (isSupabaseConfigured()) {
                const profile = await supabaseSignIn(email.trim().toLowerCase(), password);
                setUser(profile);
                router.push(profile.role === 'admin' ? '/admin' : '/profile');
            } else {
                // Fallback dev mode
                login(email, 'user');
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message || t('auth.errorGeneric'));
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-brand-50/30">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6 text-right">

                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                            <ChefHat className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">{t('auth.loginTitle')}</h1>
                        <p className="text-xs text-gray-500">{t('auth.loginSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-extrabold text-gray-700 block mb-1.5">{t('auth.email')}</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                />
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-extrabold text-gray-700 block mb-1.5">{t('auth.password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl animate-in fade-in duration-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow transition-all btn-tap flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3" />
                                </svg>
                            ) : (
                                <LogIn className="w-4 h-4" />
                            )}
                            <span>{loading ? t('auth.loggingIn') : t('auth.loginBtn')}</span>
                        </button>
                    </form>

                    <div className="text-center pt-4 border-t border-gray-100 text-xs text-gray-500">
                        {t('auth.noAccount')}{' '}
                        <Link href="/register" className="font-bold text-brand-600 hover:underline hover:text-brand-700 transition-colors">
                            {t('auth.createAccount')}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
