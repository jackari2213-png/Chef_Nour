'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChefHat,
    Search,
    BookOpen,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    Globe,
    LogOut,
    ShoppingBag,
    Flame,
    Utensils
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { language, setLanguage, user, logout, favorites, searchQuery, setSearchQuery } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // If in admin dashboard view, render dark admin header variant or skip
    if (pathname.startsWith('/admin')) {
        return null; // Admin dashboard has its own custom sidebar & header
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full glass-header border-b border-gray-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Right side in RTL: Brand Logo & Title */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-orange-glow group-hover:scale-105 transition-transform">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-2xl tracking-tight text-gray-900 leading-tight">
                                    الشيف نور
                                </span>
                                <span className="text-xs font-medium text-brand-600 -mt-1 tracking-wide">
                                    وصفات مجربة 100%
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1 mr-6">
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${pathname === '/' ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'}`}
                            >
                                الرئيسية
                            </Link>

                            {/* Recipe Categories Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setCategoryDropdownOpen(true)}
                                onMouseLeave={() => setCategoryDropdownOpen(false)}
                            >
                                <Link
                                    href="/recipes"
                                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${pathname.startsWith('/recipes') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'}`}
                                >
                                    <span>الوصفات</span>
                                    <ChevronDown className="w-4 h-4" />
                                </Link>

                                {categoryDropdownOpen && (
                                    <div className="absolute top-full right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            التصنيفات الرئيسية
                                        </div>
                                        {MOCK_CATEGORIES.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.slug}`}
                                                className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                onClick={() => setCategoryDropdownOpen(false)}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                                                    {cat.name_ar}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
                                                    {cat.recipe_count}
                                                </span>
                                            </Link>
                                        ))}
                                        <div className="border-t border-gray-100 my-1 pt-1">
                                            <Link
                                                href="/recipes"
                                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-600 hover:underline"
                                                onClick={() => setCategoryDropdownOpen(false)}
                                            >
                                                <Utensils className="w-3.5 h-3.5" />
                                                تصفح جميع الوصفات →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/store"
                                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${pathname.startsWith('/store') ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'}`}
                            >
                                <BookOpen className="w-4 h-4 text-brand-500" />
                                <span>متجر الكتب</span>
                                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full">
                                    قريباً
                                </span>
                            </Link>

                            <Link
                                href="/contact"
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${pathname === '/contact' ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'}`}
                            >
                                تواصل معنا
                            </Link>
                        </nav>
                    </div>

                    {/* Left side in RTL: Actions, Search, User & Primary CTA */}
                    <div className="flex items-center gap-3">

                        {/* Search Trigger Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2.5 rounded-xl text-gray-600 hover:text-brand-600 hover:bg-gray-100 transition-colors"
                            aria-label="بحث عن وصفة"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Language Switcher */}
                        <div className="relative hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`px-2.5 py-1 rounded-lg transition-colors ${language === 'ar' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-900'}`}
                            >
                                AR
                            </button>
                            <button
                                onClick={() => setLanguage('fr')}
                                className={`px-2.5 py-1 rounded-lg transition-colors ${language === 'fr' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-900'}`}
                            >
                                FR
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2.5 py-1 rounded-lg transition-colors ${language === 'en' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-900'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Favorites Icon Button */}
                        <Link
                            href="/favorites"
                            className="relative p-2.5 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="المفضلة"
                        >
                            <Heart className="w-5 h-5" />
                            {favorites.length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>

                        {/* User Account / Profile */}
                        <div className="relative">
                            {user ? (
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <img
                                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                                        alt={user.full_name}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500"
                                    />
                                    <span className="hidden md:inline text-xs font-bold text-gray-800">
                                        {user.full_name}
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="p-2.5 rounded-xl text-gray-600 hover:text-brand-600 hover:bg-gray-100 transition-colors"
                                    title="تسجيل الدخول"
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                            )}

                            {/* User Dropdown */}
                            {userDropdownOpen && user && (
                                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-900">{user.full_name}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-600 bg-orange-50 hover:bg-orange-100"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <ChefHat className="w-4 h-4" />
                                            لوحة تحكم الأدمن
                                        </Link>
                                    )}
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        الملف الشخصي
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        مشترواتي (الكتب)
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-right"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        تسجيل الخروج
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Primary Action CTA: Coming Soon Store */}
                        <Link
                            href="/store"
                            className="hidden sm:flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-2xl shadow-orange-glow hover:scale-105 transition-all"
                        >
                            <BookOpen className="w-4 h-4 text-white" />
                            <span>احصل على كتاب الوصفات</span>
                            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full backdrop-blur-xs">قريباً</span>
                        </Link>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="القائمة"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Screen Search Modal Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-brand-500" />
                            عن أي وصفة تبحثين اليوم؟
                        </h3>

                        <form onSubmit={handleSearchSubmit} className="relative mb-6">
                            <input
                                type="text"
                                placeholder="ابحثي عن وصفة، مكون (مثل: دجاج، لوز، كيك)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full bg-gray-50 border-2 border-brand-200 focus:border-brand-500 rounded-2xl py-3.5 pr-4 pl-12 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                            >
                                بحث
                            </button>
                        </form>

                        <div className="text-xs font-bold text-gray-400 mb-3">أكثر البحث تداولاً:</div>
                        <div className="flex flex-wrap gap-2">
                            {['طاجين الدجاج', 'كعكة الشوكولاتة', 'بريوات', 'كسكس', 'شباكية العيد', 'حريرة رمضانية'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setSearchQuery(tag);
                                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                                        setIsSearchOpen(false);
                                    }}
                                    className="bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                                >
                                    <Search className="w-3 h-3 text-brand-500" />
                                    <span>{tag}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Navigation Drawer Sheet */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100"
                        >
                            الرئيسية
                        </Link>

                        <div className="py-2 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-400 block mb-2">تصفح الوصفات حسب الفئة:</span>
                            <div className="grid grid-cols-2 gap-2">
                                {MOCK_CATEGORIES.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2.5 rounded-xl bg-gray-50 text-xs font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 transition-colors flex items-center justify-between"
                                    >
                                        <span>{cat.name_ar}</span>
                                        <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full">{cat.recipe_count}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/store"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-brand-600 py-2 border-b border-gray-100 flex items-center justify-between"
                        >
                            <span>متجر الكتب الرقمية</span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">قريباً</span>
                        </Link>

                        <Link
                            href="/favorites"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between"
                        >
                            <span>وصفاتي المفضلة</span>
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{favorites.length}</span>
                        </Link>

                        <Link
                            href="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100"
                        >
                            تواصل معنا
                        </Link>

                        {user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-extrabold text-brand-600 bg-brand-50 p-3 rounded-2xl flex items-center gap-2"
                            >
                                <ChefHat className="w-5 h-5" />
                                لوحة تحكم الأدمن
                            </Link>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">اللغة:</span>
                            <div className="flex gap-2">
                                <button onClick={() => setLanguage('ar')} className={`px-3 py-1 rounded-xl text-xs font-bold ${language === 'ar' ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}>العربية</button>
                                <button onClick={() => setLanguage('fr')} className={`px-3 py-1 rounded-xl text-xs font-bold ${language === 'fr' ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}>Français</button>
                                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-xl text-xs font-bold ${language === 'en' ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}>English</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
