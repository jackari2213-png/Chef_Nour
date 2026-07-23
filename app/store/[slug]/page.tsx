'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, ShieldCheck, CreditCard, Lock, Download, Star, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { createOrder, user } = useApp();

    const product = MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0];
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [customerEmail, setCustomerEmail] = useState(user?.email || '');
    const [customerName, setCustomerName] = useState(user?.full_name || '');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerEmail.trim() || !customerName.trim()) return;

        setIsProcessing(true);

        // Simulate payment processing abstraction layer
        setTimeout(() => {
            const order = createOrder(product, customerEmail, customerName);
            setIsProcessing(false);
            setCheckoutModalOpen(false);
            // Redirect user to orders page with download entitlement
            router.push(`/orders?success=true&order_id=${order.id}`);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Link href="/" className="hover:text-brand-600">الرئيسية</Link>
                <span>/</span>
                <Link href="/store" className="hover:text-brand-600">متجر الكتب</Link>
                <span>/</span>
                <span className="text-gray-900 font-extrabold">{product.title_ar}</span>
            </nav>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Right Col: Book Cover & Guarantee */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gradient-to-tr from-brand-100 to-amber-50 rounded-3xl p-8 border border-brand-200 text-center shadow-soft relative overflow-hidden">
                        <span className="absolute top-4 right-4 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md z-10">
                            خصم {product.discount_percent}%
                        </span>
                        <img
                            src={product.cover_image}
                            alt={product.title_ar}
                            className="rounded-2xl shadow-2xl mx-auto max-w-[260px] border-4 border-white transform hover:scale-105 transition-transform"
                        />
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span>ضمان الشراء الآمن والتحميل الفوري</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            بمجرد إتمام الطلب، يتم فتح صلاحية التحميل المباشر لكتاب PDF بصيغة فائقة الوضوح قابلة للطباعة والقراءة على كل الأجهزة.
                        </p>
                    </div>
                </div>

                {/* Left Col: Details & Features */}
                <div className="lg:col-span-7 space-y-6 text-right">

                    <div className="space-y-2">
                        <span className="text-xs font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                            كتاب رقمي صيغة PDF
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                            {product.title_ar}
                        </h1>
                    </div>

                    {/* Pricing Box */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="block text-xs font-bold text-gray-400">السعر النهائي:</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl sm:text-4xl font-black text-brand-600">{product.price_mad} درهم</span>
                                <span className="text-sm font-bold text-gray-400 line-through">{product.old_price_mad} درهم</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setCheckoutModalOpen(true)}
                            className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-orange-glow hover:scale-105 active:scale-95 transition-all"
                        >
                            اشتري الآن والتحميل فوراً ←
                        </button>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-black text-gray-900">محتويات ومميزات الكتاب:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.features?.map((feat, idx) => (
                                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 text-xs font-bold text-gray-800">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
                        <h4 className="font-bold text-sm text-gray-900">وصف الكتاب:</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                            {product.description_ar}
                        </p>
                    </div>

                </div>

            </div>

            {/* Payment Abstraction Checkout Modal */}
            {checkoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">

                        <div className="text-right border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-brand-500" />
                                إتمام شراء الكتاب الرقمي
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">الدفع عبر البوابة التجريبية / بطاقة بنكية</p>
                        </div>

                        <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-right">
                            <div>
                                <label className="text-xs font-extrabold text-gray-700 block mb-1">الاسم الكامل:</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="أدخلي اسمك الكامل"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-extrabold text-gray-700 block mb-1">البريد الإلكتروني للتحميل:</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="أدخلي بريدك الإلكتروني"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between text-xs font-bold text-brand-900">
                                <span>المبلغ المطلوب:</span>
                                <span className="text-base font-black text-brand-600">{product.price_mad} درهم</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCheckoutModalOpen(false)}
                                    className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-2/3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-orange-glow transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <span>جاري معالجة الطلب...</span>
                                    ) : (
                                        <>
                                            <Lock className="w-3.5 h-3.5" />
                                            <span>تأكيد الشراء والتحميل</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}
