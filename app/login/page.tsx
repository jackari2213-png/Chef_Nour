'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [asAdmin, setAsAdmin] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        login(email, asAdmin ? 'admin' : 'user');
        if (asAdmin) {
            router.push('/admin');
        } else {
            router.push('/profile');
        }
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
                                placeholder="chefnour@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500"
                            />
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-extrabold text-gray-700 block mb-1">كلمة المرور:</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500"
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="adminRole"
                            checked={asAdmin}
                            onChange={(e) => setAsAdmin(e.target.checked)}
                            className="rounded text-brand-500 focus:ring-brand-500"
                        />
                        <label htmlFor="adminRole" className="text-xs font-bold text-gray-700 cursor-pointer">
                            الدخول كـ مسؤول / أدمن (Chef Nour Admin)
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
                    >
                        <span>دخول</span>
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
