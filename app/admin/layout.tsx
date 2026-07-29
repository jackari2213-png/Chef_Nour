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
import { isSupabaseConfigured } from '@/lib/supabase-client';
import { supabaseSignIn, supabaseSignOut } from '@/lib/useAuth';
import { useTranslation } from '@/lib/useTranslation';

const ADMIN_EMAIL = 'nour@chefnour.com';

// ─── Admin Login Gate ─────────────────────────────────────────────────────────
function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
    const { setUser, login } = useApp();
    const { t } = useTranslation();
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
                const profile = await supabaseSignIn(email.trim().toLowerCase(), password);

                if (profile.role !== 'admin' && email.trim().toLowerCase() !== ADMIN_EMAIL) {
                    await supabaseSignOut();
                    setError(t('auth.adminNotAdmin'));
                } else {
                    // Force admin role for the admin email
                    setUser({ ...profile, role: 'admin' });
                    onSuccess();
                }
            } else {
                // Fallback: no Supabase configured (dev mode)
                if (email.trim().toLowerCase() === ADMIN_EMAIL && password === 'chefnour2024') {
                    login(email.trim().toLowerCase(), 'admin');
                    onSuccess();
                } else {
                    setError(t('auth.adminError'));
                }
            }
        } catch (err: any) {
            setError(err.message || t('auth.adminError'));
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
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                        <ChefHat className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">{t('auth.adminLoginTitle')}</h1>
                        <p className="text-xs text-gray-400 font-medium">{t('auth.adminOnly')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-5 shadow-2xl">
                    <div className="flex items-center gap-2 text-brand-400 text-sm font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('auth.adminOnly')}</span>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 block">{t('auth.adminEmail')}</label>
                        <input
                            type="email"
                            required
                            placeholder="nour@chefnour.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 block">{t('auth.adminPassword')}</label>
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

                    {error && (
                        <div className="bg-red-950 border border-red-800 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-all shadow-orange-glow flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3" />
                            </svg>
                        ) : (
                            <Lock className="w-4 h-4" />
                        )}
                        <span>{loading ? t('auth.adminVerifying') : t('auth.adminLoginBtn')}</span>
                    </button>

                    <div className="text-center">
                        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2">
                            {t('auth.backToSite')}
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
    const { user, sessionReady, setUser, logout } = useApp();
    const { t, getLocalizedField } = useTranslation();

    // Loading state while store resolves session
    if (!sessionReady) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Guard: show login screen if not authenticated as admin
    if (!user || user.role !== 'admin') {
        return <AdminLoginGate onSuccess={() => {}} />;
    }

    const navItems = [
        { href: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard },
        { href: '/admin/recipes', label: t('admin.recipes'), icon: Utensils },
        { href: '/admin/categories', label: t('admin.categories'), icon: Grid },
        { href: '/admin/moderation', label: t('admin.moderation'), icon: MessageSquare },
        { href: '/admin/products', label: t('admin.products'), icon: BookOpen },
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
                                <span className="font-extrabold text-lg text-white block">{t('admin.title')}</span>
                                <span className="text-[10px] text-brand-400 font-bold">{t('admin.cmsTitle')}</span>
                            </div>
                        </div>
                        <Link href="/" className="text-gray-400 hover:text-white text-xs font-bold flex items-center gap-1" title={t('admin.backToSite')}>
                            <span>{t('admin.backToSite')}</span>
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
                            alt={t('auth.adminLoginTitle')}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500"
                        />
                        <div>
                            <span className="block text-xs font-bold text-white">{user.full_name}</span>
                            <span className="text-[10px] text-gray-500">{t('admin.siteManager')}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-900 border border-transparent hover:border-red-700 text-gray-300 hover:text-red-300 text-xs font-bold py-2.5 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t('admin.logout')}</span>
                    </button>
                </div>

            </aside>

            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}
