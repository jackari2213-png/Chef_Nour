'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { t } = useTranslation();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl border border-gray-100 space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900">{t('errors.genericTitle')}</h2>
                <p className="text-xs text-gray-500 font-medium">{t('errors.genericDesc')}</p>
                <button
                    onClick={reset}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-orange-glow transition-all btn-tap"
                >
                    {t('errors.tryAgain')}
                </button>
            </div>
        </div>
    );
}
