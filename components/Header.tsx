'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChefHat,
    Search,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { useTranslation } from '@/lib/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, getLocalizedField } = useTranslation();
    const { user, logout, favorites, searchQuery, setSearchQuery, categories, recipes } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [announcementDismissed, setAnnouncementDismissed] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // List categories (live categories or fallback)
    const categoryList = categories.length > 0 ? categories : MOCK_CATEGORIES;

    // Dynamic category count calculation
    const getCategoryCount = (catId: string, catNameAr: string) => {
        const count = recipes.filter(r => r.category_id === catId || r.category_name_ar === catNameAr).length;
        return count;
    };

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
        <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
            {/* Top Announcement Banner — Dismissible */}
            {!announcementDismissed && (
                <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white text-[11px] sm:text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 relative">
                    <span>📖 {t('nav.recipeStore')} — {t('common.comingSoon')}</span>
                    <span className="opacity-40 hidden sm:inline">|</span>
                    <span className="hidden sm:inline">{t('footer.featureTested')} 100%</span>
                    <button
                        onClick={() => setAnnouncementDismissed(true)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Main Clean Header Bar */}
            <div className={`transition-all duration-300 border-b ${scrolled ? 'bg-white/90 backdrop-blur-xl border-gray-200/70 shadow-sm' : 'bg-white/95 backdrop-blur-md border-gray-100 shadow-xs'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">

                        {/* Brand Logo & Title */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                                <ChefHat className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl sm:text-2xl tracking-tight text-gray-900 leading-none">
                                    {t('common.chefNour')}
                                </span>
                                <span className="text-[10px] font-bold text-brand-600 tracking-wider">
                                    {t('common.chefNourBrand')}
                                </span>
                            </div>
                        </Link>

                        {/* Centered Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-8 mx-auto">
                            <Link
                                href="/"
                                className={`text-sm font-bold transition-colors ${pathname === '/' ? 'text-brand-600 underline underline-offset-8 decoration-2' : 'text-gray-700 hover:text-brand-600'}`}
                            >
                                {t('nav.home')}
                            </Link>

                            {/* Recipe Categories Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setCategoryDropdownOpen(true)}
                                onMouseLeave={() => setCategoryDropdownOpen(false)}
                            >
                                <Link
                                    href="/recipes"
                                    className={`text-sm font-bold flex items-center gap-1 transition-colors ${pathname.startsWith('/recipes') ? 'text-brand-600 underline underline-offset-8 decoration-2' : 'text-gray-700 hover:text-brand-600'}`}
                                >
                                    <span>{t('nav.recipes')}</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                </Link>

                                {categoryDropdownOpen && (
                                    <div className="absolute top-full right-0 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-1 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                                            {t('nav.categories')}
                                        </div>
                                        {categoryList.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.slug}`}
                                                className="flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                onClick={() => setCategoryDropdownOpen(false)}
                                            >
                                                <span>{getLocalizedField(cat, 'name')}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
                                                    {getCategoryCount(cat.id, cat.name_ar)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/store"
                                className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${pathname.startsWith('/store') ? 'text-brand-600 underline underline-offset-8 decoration-2' : 'text-gray-700 hover:text-brand-600'}`}
                            >
                                <span>{t('nav.recipeStore')}</span>
                                <span className="px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-800 rounded-full">
                                    {t('common.comingSoon')}
                                </span>
                            </Link>

                            <Link
                                href="/contact"
                                className={`text-sm font-bold transition-colors ${pathname === '/contact' ? 'text-brand-600 underline underline-offset-8 decoration-2' : 'text-gray-700 hover:text-brand-600'}`}
                            >
                                {t('nav.contact')}
                            </Link>
                        </nav>

                        {/* Right Action Icons */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Language Switcher */}
                            <LanguageSwitcher compact />

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-700 hover:text-brand-600 transition-colors"
                                aria-label={t('nav.ariaSearch')}
                                title={t('nav.searchRecipe')}
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Favorites */}
                            <Link
                                href="/favorites"
                                className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
                                title={t('nav.favoritesCount')}
                            >
                                <Heart className="w-5 h-5" />
                                {favorites.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>

                            {/* User Profile / Admin */}
                            <div className="relative">
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            className="p-1 rounded-full text-gray-700 hover:text-brand-600 transition-colors"
                                        >
                                            <img
                                                src={user.avatar_url || (user.role === 'admin' ? '/chef-nour.jpg' : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}&backgroundColor=f97316`)}
                                                alt={user.full_name}
                                                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500"
                                            />
                                        </button>

                                        {userDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                                    <span className="block text-xs font-extrabold text-gray-900 truncate">{user.full_name}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium truncate block">{user.email}</span>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    {t('nav.myAccount')}
                                                </Link>
                                                <Link
                                                    href="/favorites"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-red-500 transition-colors"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    {t('nav.favorites')}
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                    >
                                                        <ChefHat className="w-4 h-4" />
                                                        {t('nav.adminPanel')}
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => { logout(); setUserDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {t('auth.logout')}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="p-2 text-gray-700 hover:text-brand-600 transition-colors"
                                        title={t('nav.myAccount')}
                                    >
                                        <User className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-700 hover:text-brand-600 transition-colors"
                                aria-label={t('nav.ariaMenu')}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

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
                            {t('nav.searchTitle')}
                        </h3>

                        <form onSubmit={handleSearchSubmit} className="relative mb-6">
                            <input
                                type="text"
                                placeholder={t('nav.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full bg-gray-50 border-2 border-brand-200 focus:border-brand-500 rounded-2xl py-3.5 pr-4 pl-12 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                            >
                                {t('common.search')}
                            </button>
                        </form>

                        <div className="text-xs font-bold text-gray-400 mb-3">{t('nav.trending')}</div>
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
            <div className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
                <div className={`fixed top-20 left-0 right-0 bg-white z-50 overflow-y-auto p-6 transition-all duration-300 ease-out shadow-2xl ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`} style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100"
                        >
                            {t('nav.home')}
                        </Link>

                        <div className="py-2 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-400 block mb-2">{t('nav.browseCategories')}</span>
                            <div className="grid grid-cols-2 gap-2">
                                {categoryList.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2.5 rounded-xl bg-gray-50 text-xs font-bold text-gray-800 hover:bg-brand-50 hover:text-brand-600 transition-colors flex items-center justify-between"
                                    >
                                        <span>{getLocalizedField(cat, 'name')}</span>
                                        <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full">
                                            {getCategoryCount(cat.id, cat.name_ar)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/store"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-brand-600 py-2 border-b border-gray-100 flex items-center justify-between"
                        >
                            <span>{t('nav.digitalStore')}</span>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">{t('common.comingSoon')}</span>
                        </Link>

                        <Link
                            href="/favorites"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100 flex items-center justify-between"
                        >
                            <span>{t('nav.favorites')}</span>
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{favorites.length}</span>
                        </Link>

                        <Link
                            href="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-gray-900 py-2 border-b border-gray-100"
                        >
                            {t('nav.contact')}
                        </Link>

                        {user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-extrabold text-brand-600 bg-brand-50 p-3 rounded-2xl flex items-center gap-2"
                            >
                                <ChefHat className="w-5 h-5" />
                                {t('nav.adminPanel')}
                            </Link>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">{t('nav.language')}</span>
                            <LanguageSwitcher compact />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
