'use client';

import React from 'react';
import Link from 'next/link';
import { User, Mail, ShieldCheck, Heart, ShoppingBag, LogOut, ChefHat } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function ProfilePage() {
    const { user, logout, favorites, orders } = useApp();

    if (!user) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-900">يجب تسجيل الدخول لمشاهدة ملفك الشخصي</h2>
                <Link href="/login" className="inline-block bg-brand-500 text-white font-bold text-xs px-6 py-3 rounded-xl">
                    تسجيل الدخول
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-right w-full sm:w-auto">
                    <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-500 shadow-md"
                    />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-gray-900">{user.full_name}</h1>
                            {user.role === 'admin' && (
                                <span className="text-[10px] font-extrabold bg-orange-100 text-brand-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <ChefHat className="w-3 h-3" /> أدمن الشيف نور
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        <p className="text-[11px] text-gray-400">عضوة منذ {new Date(user.created_at).toLocaleDateString('ar-MA')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {user.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-orange-glow transition-all"
                        >
                            لوحة تحكم الأدمن
                        </Link>
                    )}
                    <button
                        onClick={logout}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>خروج</span>
                    </button>
                </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Link
                    href="/favorites"
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                            <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-sm text-gray-900">الوصفات المحفوظة</span>
                            <span className="text-xs text-gray-400 font-bold">{favorites.length} وصفة</span>
                        </div>
                    </div>
                    <span className="text-xs text-brand-600 font-bold">عرض ←</span>
                </Link>

                <Link
                    href="/orders"
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-card transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center font-bold">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-sm text-gray-900">الكتب الرقمية المشتراة</span>
                            <span className="text-xs text-gray-400 font-bold">{orders.length} كتب</span>
                        </div>
                    </div>
                    <span className="text-xs text-brand-600 font-bold">عرض ←</span>
                </Link>

            </div>

        </div>
    );
}
