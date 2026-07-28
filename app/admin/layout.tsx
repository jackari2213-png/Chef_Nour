'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Utensils,
    Grid,
    MessageSquare,
    BookOpen,
    LogOut,
    ChefHat,
    ArrowRight,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client';

// Admin email — only this email is granted admin access
const ADMIN_EMAIL = 'nour@chefnour.com';

// ─── Admin Login Gate ─────────────────────────────────────────────────────────
function AdminLoginGate() {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSupabaseConfigured()) {
                // ── Supabase Auth ──────────────────────────────────────
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email: email.trim().toLowerCase(),
                    password,
                });

                if (authError || !data.user) {
                    setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                } else if (data.user.email !== ADMIN_EMAIL) {
                    await supabase.auth.signOut();
                    setError('هذا الحساب لا يمتلك صلاحيات الأدمين');
                } else {
                    login(email.trim().toLowerCase(), 'admin');
                }
            } else {
                // ── Fallback (dev without Supabase) ────────────────────
                if (email.trim().toLowerCase() === ADMIN_EMAIL && password === 'chefnour2024') {
                    login(email.trim().toLowerCase(), 'admin');
                } else {
                    setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                }
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال، حاول مرة أخرى');
        }

        setLoading(false);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center p-4 font-arabic"
            style={{ background: 'radial-gradient(ellipse at 60% 20%, #431407 0%, #111827 60%, #030712 100%)' }}
        >
            <div className="w-full max-w-md space-y-8">

                {/* Logo */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                        <ChefHat className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">الشيف نور</h1>
                        <p className="text-xs text-gray-400 font-medium">لوحة تحكم الأدمين — دخول محمي</p>
                    </div>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-5 shadow-2xl"
                >
                    <div className="flex items-center gap-2 text-brand-400 text-sm font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>دخول مخصص للمسؤولين فقط</span>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 block">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            placeholder="nour@chefnour.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 block">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all pl-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-950 border border-red-800 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-all shadow-orange-glow flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121M17.657 17.657l-2.121-2.121M8.757 8.757L6.636 6.636" />
                            </svg>
                        ) : (
                            <Lock className="w-4 h-4" />
                        )}
                        <span>{loading ? 'جاري التحقق...' : 'دخول للوحة التحكم'}</span>
                    </button>

                    <div className="text-center">
                        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2">
                            ← العودة إلى الموقع
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Admin Layout ────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useApp();

    // Guard: show login screen if not authenticated as admin
    if (!user || user.role !== 'admin') {
        return <AdminLoginGate />;
    }

    const navItems = [
        { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
        { href: '/admin/recipes', label: 'إدارة الوصفات', icon: Utensils },
        { href: '/admin/categories', label: 'إدارة الفئات والتصنيفات', icon: Grid },
        { href: '/admin/moderation', label: 'إدارة التعليقات والصور', icon: MessageSquare },
        { href: '/admin/products', label: 'المنتجات الرقمية (الكتب)', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row font-arabic dir-rtl">

            <aside className="w-full md:w-64 bg-gray-900 border-l border-gray-800 p-6 flex flex-col justify-between shrink-0">

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black shadow-orange-glow">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="font-extrabold text-lg text-white block">لوحة التحكم</span>
                                <span className="text-[10px] text-brand-400 font-bold">الشيف نور CMS</span>
                            </div>
                        </div>
                        <Link href="/" className="text-gray-400 hover:text-white text-xs font-bold flex items-center gap-1" title="العودة للموقع">
                            <span>الموقع</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${isActive ? 'bg-brand-500 text-white shadow-orange-glow' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-gray-800 space-y-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatar_url || '/chef-nour.jpg'}
                            alt="الشيف نور"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500"
                        />
                        <div>
                            <span className="block text-xs font-bold text-white">{user.full_name}</span>
                            <span className="text-[10px] text-gray-500">مسؤول النظام</span>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-900 border border-transparent hover:border-red-700 text-gray-300 hover:text-red-300 text-xs font-bold py-2.5 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>

            </aside>

            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}
