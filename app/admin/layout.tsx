'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Utensils,
    Grid,
    PlusCircle,
    MessageSquare,
    Camera,
    BookOpen,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    ChefHat,
    ArrowRight
} from 'lucide-react';
import { useApp } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useApp();

    const navItems = [
        { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
        { href: '/admin/recipes', label: 'إدارة الوصفات', icon: Utensils },
        { href: '/admin/categories', label: 'إدارة الفئات والتصنيفات', icon: Grid },
        { href: '/admin/moderation', label: 'إدارة التعليقات والصور', icon: MessageSquare },
        { href: '/admin/products', label: 'المنتجات الرقمية (الكتب)', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row font-arabic dir-rtl">

            {/* Admin Dark Sidebar strictly matching reference bottom-right panel design */}
            <aside className="w-full md:w-64 bg-gray-900 border-l border-gray-800 p-6 flex flex-col justify-between shrink-0">

                <div className="space-y-8">

                    {/* Admin Header Brand */}
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

                    {/* Navigation Links */}
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

                {/* User Info / Logout */}
                <div className="pt-6 border-t border-gray-800 space-y-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatar_url || '/chef-nour.jpg'}
                            alt="الشيف نور"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500"
                        />
                        <div>
                            <span className="block text-xs font-bold text-white">{user?.full_name || 'الشيف نور'}</span>
                            <span className="text-[10px] text-gray-500">مسؤول النظام</span>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>خروج إلى الموقع</span>
                    </Link>
                </div>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}
