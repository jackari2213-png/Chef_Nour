'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Download, ShoppingBag, CheckCircle2, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

function OrdersContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';
    const { orders } = useApp();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Success alert banner if just purchased */}
            {isSuccess && (
                <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-3xl p-6 shadow-md text-right space-y-2 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 font-black text-lg text-emerald-800">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <span>{t('orders.successTitle')}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">
                        {t('orders.successDesc')}
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="text-right border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <ShoppingBag className="w-7 h-7 text-brand-500" />
                    {t('orders.title')}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">
                    {t('orders.subtitle')}
                </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((ord) => (
                        <div
                            key={ord.id}
                            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4 text-right w-full sm:w-auto">
                                <img
                                    src={ord.product_cover_image}
                                    alt={ord.product_title_ar}
                                    className="w-16 h-20 rounded-xl object-cover shadow-sm border border-gray-200 shrink-0"
                                />
                                <div>
                                    <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mb-1">
                                        {t('orders.paid')} ({ord.payment_ref})
                                    </span>
                                    <h3 className="font-extrabold text-base text-gray-900">{ord.product_title_ar}</h3>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {t('orders.orderDate')}: {new Date(ord.created_at).toLocaleDateString('ar-MA')} • {t('orders.amount')}: {ord.total_amount_mad} {t('orders.currency')}
                                    </p>
                                </div>
                            </div>

                            {/* Secure Digital Download Link */}
                            <a
                                href="/assets/ebooks/chef-nour-eid-sweets.pdf"
                                download
                                className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-orange-glow transition-all flex items-center justify-center gap-2 hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span>{t('orders.download')}</span>
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">{t('orders.noOrdersTitle')}</h3>
                        <p className="text-xs text-gray-500 mb-4">{t('orders.noOrdersDesc')}</p>
                        <Link
                            href="/store"
                            className="inline-block bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl"
                        >
                            {t('orders.browseStore')}
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}

export default function OrdersPage() {
    const { t } = useTranslation();
    return (
        <Suspense fallback={<div className="p-12 text-center text-sm font-bold">{t('orders.loading')}</div>}>
            <OrdersContent />
        </Suspense>
    );
}
