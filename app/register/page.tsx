'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !name.trim()) return;

        login(email, 'user');
        router.push('/profile');
    };

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 text-right">

                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                        <ChefHat className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">إنشاء حساب جديد</h1>
                    <p className="text-xs text-gray-500">انضمت لـ +170K متابعة وفية لمجتمع الشيف نور</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-extrabold text-gray-700 block mb-1">الاسم الكامل:</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="اسمك الكامل"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-brand-500"
                            />
                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-extrabold text-gray-700 block mb-1">البريد الإلكتروني:</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
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

                    <button
                        type="submit"
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
                    >
                        <span>إنشاء الحساب</span>
                        <UserPlus className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100 text-xs text-gray-500">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="font-bold text-brand-600 hover:underline">
                        تسجيل الدخول
                    </Link>
                </div>

            </div>
        </div>
    );
}
