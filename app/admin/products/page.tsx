'use client';

import React from 'react';
import { BookOpen, ShoppingBag, Download, DollarSign, CheckCircle2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';

export default function AdminProductsPage() {
    const { t } = useTranslation();
    const { orders } = useApp();

    return (
        <div className="space-y-8 text-right">

            <div className="border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-black text-white">{t('admin.products')}</h1>
                <p className="text-xs text-gray-400 font-medium">{t('admin.productsSubtitle')}</p>
            </div>

            {/* Products Catalog */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-white">{t('admin.activeProducts')}:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_PRODUCTS.map((prod) => (
                        <div key={prod.id} className="bg-gray-900 rounded-3xl p-6 border border-gray-800 flex gap-4">
                            <img src={prod.cover_image} alt={prod.title_ar} className="w-24 h-32 rounded-2xl object-cover border border-gray-800" />
                            <div className="space-y-2 flex-1">
                                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                                    {t('admin.activeDownloadReady')}
                                </span>
                                <h4 className="font-extrabold text-base text-white">{prod.title_ar}</h4>
                                <p className="text-xs text-gray-400 line-clamp-2">{prod.description_ar}</p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-lg font-black text-brand-400">{prod.price_mad} {t('common.currency')}</span>
                                    <span className="text-xs text-gray-400 font-bold">{t('admin.sales', { count: 1248 })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-white">{t('admin.recentOrders', { count: orders.length })}:</h3>
                <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-gray-950 text-gray-400 font-extrabold border-b border-gray-800">
                            <tr>
                                <th className="p-4">{t('admin.orderId')}</th>
                                <th className="p-4">{t('admin.customer')}</th>
                                <th className="p-4">{t('admin.email')}</th>
                                <th className="p-4">{t('admin.product')}</th>
                                <th className="p-4">{t('admin.amount')}</th>
                                <th className="p-4">{t('admin.paymentStatus')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                            {orders.map((ord) => (
                                <tr key={ord.id} className="hover:bg-gray-850">
                                    <td className="p-4 font-mono font-bold text-gray-400">{ord.id.slice(0, 8)}</td>
                                    <td className="p-4 font-bold text-white">{ord.customer_name}</td>
                                    <td className="p-4">{ord.customer_email}</td>
                                    <td className="p-4 font-semibold text-brand-400">{ord.product_title_ar}</td>
                                    <td className="p-4 font-extrabold text-white">{ord.total_amount_mad} {t('common.currency')}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                                            <CheckCircle2 className="w-3 h-3" /> {t('admin.paid')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
