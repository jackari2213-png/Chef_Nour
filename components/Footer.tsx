'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Mail, Send, Heart, BookOpen, Instagram, Youtube, Facebook, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export default function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    if (pathname.startsWith('/admin')) {
        return null;
    }

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Newsletter & Banner Section */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 mb-16 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center lg:text-right">
                        <h3 className="text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center lg:justify-start gap-3">
                            <Mail className="w-7 h-7" />
                            انضمي لنشرة الشيف نور الأسبوعية
                        </h3>
                        <p className="text-orange-100 text-sm font-medium leading-relaxed">
                            احصلي على أحدث الوصفات المجربة، أسرار نجاح الحلويات، والمنشورات الموسمية مباشرة إلى بريدك الإلكتروني مجاناً!
                        </p>
                    </div>

                    <div className="w-full lg:w-auto min-w-[320px]">
                        {subscribed ? (
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center text-white font-bold text-sm border border-white/30 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                تم الاشتراك بنجاح! شكراً لك ❤️
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="أدخلي بريدك الإلكتروني..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white text-gray-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:outline-none w-full focus:ring-2 focus:ring-white"
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shrink-0 transition-all hover:scale-105"
                                >
                                    <span>اشتركي</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Col 1: Brand Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-2xl text-white">الشيف نور</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            منصة طهي عربية رائدة تقدم وصفات تقليدية ومودرن ناجحة ومجربة 100%. أطباق مغربية، حلويات فاخرة، وأسرار المطبخ الاحترافي من مطبخي إلى مائدتك.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-brand-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-brand-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-brand-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Categories */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-4 border-r-4 border-brand-500 pr-3">
                            أقسام الوصفات
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {MOCK_CATEGORIES.slice(0, 6).map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/category/${cat.slug}`} className="hover:text-brand-500 transition-colors">
                                        {cat.name_ar}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-4 border-r-4 border-brand-500 pr-3">
                            روابط سريعة
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/recipes" className="hover:text-brand-500 transition-colors">جميع الوصفات</Link></li>
                            <li><Link href="/store" className="hover:text-brand-500 transition-colors text-brand-400 font-bold">متجر الكتب الرقمية</Link></li>
                            <li><Link href="/about" className="hover:text-brand-500 transition-colors">عن الشيف نور</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-500 transition-colors">تواصل معنا</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-500 transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-500 transition-colors">الشروط والأحكام</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Digital Books Promo */}
                    <div className="bg-gray-800/60 p-5 rounded-2xl border border-gray-700/50">
                        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-brand-500" />
                            كتاب حلويات العيد
                        </h4>
                        <p className="text-xs text-gray-400 mb-4">
                            احصلي على نسخة PDF عالية الدقة تضم 30 وصفة مضمونة ومجربة مع خطوات توضيحية.
                        </p>
                        <Link
                            href="/store"
                            className="inline-block w-full bg-brand-500 hover:bg-brand-600 text-white text-center text-xs font-bold py-2.5 rounded-xl transition-colors"
                        >
                            تصفح المتجر (قريباً)
                        </Link>
                    </div>

                </div>

                {/* Bottom Copyright */}
                <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>© {new Date().getFullYear()} الشيف نور (CHEF NOUR). جميع الحقوق محفوظة.</p>
                    <p className="flex items-center gap-1">
                        صُنع بـ <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> لعشاق الطبخ الأصيل
                    </p>
                </div>

            </div>
        </footer>
    );
}
