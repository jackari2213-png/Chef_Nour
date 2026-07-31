'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
    User, Mail, ShieldCheck, Heart, ShoppingBag, LogOut, ChefHat,
    Pencil, Camera, Check, X, Loader2
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

export default function ProfilePage() {
    const { user, logout, favorites, orders, updateProfile } = useApp();
    const { t } = useTranslation();

    const [editing, setEditing] = useState(false);
    const [nameVal, setNameVal] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<'ok' | 'err' | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{t('auth.loginRequired')}</h2>
                <p className="text-sm text-gray-500">{t('auth.loginRequiredDesc') || 'سجلي الدخول للوصول إلى ملفك الشخصي'}</p>
                <Link href="/login" className="inline-block bg-brand-500 text-white font-bold text-sm px-8 py-3 rounded-2xl shadow-orange-glow hover:bg-brand-600 transition-all">
                    {t('auth.login')}
                </Link>
            </div>
        );
    }

    const startEdit = () => {
        setNameVal(user.full_name);
        setEditing(true);
        setSaveMsg(null);
    };

    const cancelEdit = () => {
        setEditing(false);
        setSaveMsg(null);
    };

    const saveEdit = async () => {
        if (!nameVal.trim()) return;
        setSaving(true);
        try {
            await updateProfile({ full_name: nameVal.trim() });
            setSaveMsg('ok');
            setEditing(false);
        } catch {
            setSaveMsg('err');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target?.result as string;
            setSaving(true);
            try {
                await updateProfile({ avatar_url: dataUrl });
                setSaveMsg('ok');
            } catch {
                setSaveMsg('err');
            } finally {
                setSaving(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                    {/* Avatar with upload */}
                    <div className="relative shrink-0">
                        <img
                            src={user.avatar_url || (user.role === 'admin' ? '/chef-nour.jpg' : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}&backgroundColor=f97316`)}
                            alt={user.full_name}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500 shadow-lg bg-orange-100"
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 transition-all hover:scale-110"
                            title="تغيير الصورة"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {/* Name & info */}
                    <div className="flex-1 text-center sm:text-right space-y-2 w-full">
                        {editing ? (
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <input
                                    type="text"
                                    value={nameVal}
                                    onChange={e => setNameVal(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                    className="flex-1 border-2 border-brand-300 rounded-xl px-3 py-2 text-lg font-black text-gray-900 focus:outline-none focus:border-brand-500"
                                    autoFocus
                                    maxLength={60}
                                />
                                <button onClick={saveEdit} disabled={saving} className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all disabled:opacity-50">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={cancelEdit} className="w-9 h-9 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <h1 className="text-2xl font-black text-gray-900">{user.full_name}</h1>
                                {user.role === 'admin' && (
                                    <span className="text-[10px] font-extrabold bg-orange-100 text-brand-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <ChefHat className="w-3 h-3" /> {t('profile.adminBadge')}
                                    </span>
                                )}
                                <button onClick={startEdit} className="w-7 h-7 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {saveMsg === 'ok' && <p className="text-xs text-emerald-600 font-bold">✓ تم الحفظ بنجاح</p>}
                        {saveMsg === 'err' && <p className="text-xs text-red-500 font-bold">✗ حدث خطأ، حاولي مجدداً</p>}

                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium justify-center sm:justify-start">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{user.email}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{t('profile.memberSince')} {new Date(user.created_at).toLocaleDateString('ar-MA')}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                        {user.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-orange-glow transition-all whitespace-nowrap"
                            >
                                {t('profile.adminPanelLink')}
                            </Link>
                        )}
                        <button
                            onClick={logout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{t('profile.logout')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Link
                    href="/favorites"
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card transition-all flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-2xl text-gray-900">{favorites.length}</span>
                            <span className="text-xs text-gray-400 font-bold">{t('profile.myFavorites')}</span>
                        </div>
                    </div>
                    <span className="text-xs text-brand-600 font-bold group-hover:underline">{t('common.viewAll')} ←</span>
                </Link>

                <Link
                    href="/orders"
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card transition-all flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-2xl text-gray-900">{orders.length}</span>
                            <span className="text-xs text-gray-400 font-bold">{t('profile.myOrders')}</span>
                        </div>
                    </div>
                    <span className="text-xs text-brand-600 font-bold group-hover:underline">{t('common.viewAll')} ←</span>
                </Link>
            </div>

            {/* Security Info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
                <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-800">حسابك محمي ومؤمن</p>
                    <p className="text-xs text-emerald-600 font-medium">كلمة المرور مشفرة. بياناتك محفوظة بأمان عبر Supabase Auth.</p>
                </div>
            </div>
        </div>
    );
}
