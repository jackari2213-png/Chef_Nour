'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ShieldCheck, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function StorePage() {
    const featuredProduct = MOCK_PRODUCTS[0];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

            {/* Header */}
            <div className="text-right border-b border-gray-200 pb-6">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3.5 py-1 rounded-full text-xs font-black mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>كتب طبخ رقمية PDF</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    متجر كتب الشيف نور الرقمية
                </h1>
                <p className="text-gray-500 font-medium text-sm sm:text-base mt-1">
                    احصلي على أسرار وصفاتي المكتوبة بمقادير مضبوطة للتحميل الفوري على هاتفك أو حاسوبك
                </p>
            </div>

            {/* Featured Main Book Hero Card */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-12 text-white shadow-2xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    <div className="lg:col-span-7 space-y-6 text-right">
                        <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black border border-white/30">
                            🔥 الأكثر مبيعاً هذا الشهر
                        </span>

                        <h2 className="text-3xl sm:text-5xl font-black leading-tight">
                            {featuredProduct.title_ar}
                        </h2>

                        <p className="text-orange-100 text-sm sm:text-base font-medium leading-relaxed">
                            {featuredProduct.description_ar}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-extrabold text-white">
                            {featuredProduct.features?.map((f, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex flex-wrap items-center gap-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black">{featuredProduct.price_mad} درهم</span>
                                <span className="text-sm font-bold text-orange-200 line-through">{featuredProduct.old_price_mad} درهم</span>
                            </div>

                            <Link
                                href={`/store/${featuredProduct.slug}`}
                                className="bg-white hover:bg-orange-50 text-brand-600 font-black text-sm px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                            >
                                شراء الكتاب والتحميل الفوري ←
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex justify-center">
                        <img
                            src={featuredProduct.cover_image}
                            alt={featuredProduct.title_ar}
                            className="rounded-3xl shadow-2xl max-w-[280px] border-4 border-white/20 transform hover:scale-105 transition-transform"
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}
