'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Home } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="text-center space-y-6 max-w-md">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl" />
                    <div className="relative w-24 h-24 rounded-3xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-orange-glow rotate-6">
                        <ChefHat className="w-12 h-12" />
                    </div>
                    <span className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center font-black text-2xl text-brand-500 animate-bounce">
                        404
                    </span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                        {t('notFound.title')}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {t('notFound.desc')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-orange-glow transition-all btn-tap"
                    >
                        <Home className="w-4 h-4" />
                        <span>{t('notFound.homeBtn')}</span>
                    </Link>
                    <Link
                        href="/recipes"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-6 py-3 rounded-2xl transition-all btn-tap"
                    >
                        <ChefHat className="w-4 h-4" />
                        <span>{t('notFound.recipesBtn')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
