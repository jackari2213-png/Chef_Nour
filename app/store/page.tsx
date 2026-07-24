'use client';

import React, { useState } from 'react';
import { BookOpen, Bell, CheckCircle2, Clock, Sparkles, ChefHat } from 'lucide-react';

const UPCOMING_BOOKS = [
    {
        title_ar: 'دليل حلويات العيد الشامل',
        subtitle_ar: '80+ وصفة مجربة بمقادير مضبوطة',
        color: 'from-orange-500 to-amber-500',
        icon: '🍪',
    },
    {
        title_ar: 'مطبخ الشيف نور: الطاجين والأطباق المغربية',
        subtitle_ar: 'أسرار الطبخ المغربي الأصيل',
        color: 'from-rose-500 to-pink-600',
        icon: '🍲',
    },
    {
        title_ar: 'حلويات رمضان والحفلات',
        subtitle_ar: 'وصفات احتفالية لكل المناسبات',
        color: 'from-violet-500 to-purple-600',
        icon: '🌙',
    },
];

export default function StorePage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
        setEmail('');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

            {/* Hero Coming Soon */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-black border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>قريباً جداً</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                    متجر كتب
                    <span className="text-brand-500"> الشيف نور</span>
                    <br />
                    الرقمية
                </h1>

                <p className="text-gray-500 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                    نعمل على إعداد كتب رقمية استثنائية بمقادير مضبوطة وصور احترافية لكل الوصفات.
                    <br />
                    سجّلي بريدك لتكوني أول من يعلم عند الإطلاق!
                </p>

                {/* Email Notify Form */}
                {!submitted ? (
                    <form
                        onSubmit={handleNotify}
                        className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2"
                    >
                        <input
                            type="email"
                            required
                            placeholder="أدخلي بريدك الإلكتروني..."
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white border-2 border-gray-200 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto shrink-0 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-orange-glow transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Bell className="w-4 h-4" />
                            <span>أعلميني</span>
                        </button>
                    </form>
                ) : (
                    <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-6 py-3 max-w-sm mx-auto text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>سيتم إعلامك فور إطلاق متجر الكتب!</span>
                    </div>
                )}
            </div>

            {/* Upcoming Books Preview */}
            <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                    <h2 className="text-xl font-black text-gray-900">الكتب القادمة</h2>
                    <span className="text-xs text-gray-400 font-semibold mr-auto">قيد الإعداد</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {UPCOMING_BOOKS.map((book, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-card transition-shadow"
                        >
                            {/* Color Banner */}
                            <div className={`h-28 bg-gradient-to-br ${book.color} flex items-center justify-center`}>
                                <span className="text-5xl opacity-80">{book.icon}</span>
                            </div>

                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    قريباً
                                </span>
                            </div>

                            <div className="p-5 text-right space-y-1">
                                <h3 className="font-extrabold text-gray-900 text-sm leading-snug">{book.title_ar}</h3>
                                <p className="text-xs text-gray-400 font-medium">{book.subtitle_ar}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chef signature */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100 text-center space-y-3">
                <ChefHat className="w-10 h-10 text-brand-500 mx-auto" />
                <p className="text-gray-700 font-bold text-sm leading-relaxed max-w-lg mx-auto">
                    "أعمل بكل اجتهاد لأقدم لكم كتباً رقمية تستحق انتظاركم. وصفات مجربة، مقادير مضبوطة، وصور شهية."
                </p>
                <p className="text-brand-600 font-extrabold text-sm">— الشيف نور</p>
            </div>

        </div>
    );
}
