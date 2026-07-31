'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, ChefHat } from 'lucide-react';

export default function OfflinePage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-gray-100 space-y-4">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
                    <WifiOff className="w-8 h-8 text-brand-500" />
                </div>
                <h2 className="text-xl font-black text-gray-900">أنتِ حالياً غير متصلة بالإنترنت</h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    يبدو أن اتصالك بالإنترنت غير متاح. الوصفات المحفوظة سابقاً ستكون متاحة عند عودة الاتصال.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                    <ChefHat className="w-4 h-4" />
                    <span>الشيف نور</span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-orange-glow transition-all btn-tap"
                >
                    إعادة المحاولة
                </button>
                <Link
                    href="/"
                    className="block text-xs font-bold text-brand-600 hover:underline"
                >
                    العودة للرئيسية
                </Link>
            </div>
        </div>
    );
}
