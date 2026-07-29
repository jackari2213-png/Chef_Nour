'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import { supabaseSignIn } from '@/lib/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase-client';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, login } = useApp();
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
            setError(err.message || 'حدث خطأ، حاول مرة أخرى');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 text-right">

                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                        <ChefHat className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">تسجيل الدخول</h1>
                    <p className="text-xs text-gray-500">أهلاً بك مجدداً في منصة الشيف نور</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-extrabold text-gray-700 block mb-1">البريد الإلكتروني:</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500"
                            />
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-extrabold text-gray-700 block mb-1">كلمة المرور:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500"
                            />
                            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
                    >
                        <span>{loading ? 'جاري الدخول...' : 'دخول'}</span>
                        <LogIn className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100 text-xs text-gray-500">
                    ليس لديك حساب؟{' '}
                    <Link href="/register" className="font-bold text-brand-600 hover:underline">
                        أنشئي حساب جديد
                    </Link>
                </div>

            </div>
        </div>
    );
}
