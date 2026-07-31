'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function ConnectivityBanner() {
    const { t, isRTL } = useTranslation();
    const [online, setOnline] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        setOnline(navigator.onLine);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (online) return null;

    return (
        <div
            role="status"
            dir={isRTL ? 'rtl' : 'ltr'}
            className="bg-amber-500 text-white text-center text-xs sm:text-sm font-bold py-2 px-4 flex items-center justify-center gap-2"
        >
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t('connectivity.offlineTitle')}</span>
            <span className="hidden sm:inline opacity-90">· {t('connectivity.offlineDesc')}</span>
        </div>
    );
}
