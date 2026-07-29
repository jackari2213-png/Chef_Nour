import React from 'react';
import type { Metadata } from 'next';
import { Tajawal, Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookingBackground from '@/components/CookingBackground';
import LanguageProvider from '@/components/LanguageProvider';
import ScrollToTop from '@/components/ScrollToTop';

const tajawal = Tajawal({
    subsets: ['arabic'],
    weight: ['300', '400', '500', '700', '800', '900'],
    variable: '--font-tajawal',
});

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400', '600', '700', '800', '900'],
    variable: '--font-cairo',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
    description: 'الموقع الرسمي للشيف نور. وصفات مجربة 100%، حلويات العيد، أطباق مغربية وأسرار الطبخ مع دليلك الشامل لنجاح الوصفات بمقادير مضبوطة.',
    keywords: ['الشيف نور', 'وصفات مغربية', 'طاجين', 'حلويات العيد', 'كتاب الشيف نور', 'طبخ مغربي', 'Chef Nour'],
    openGraph: {
        title: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
        description: 'وصفات مجربة وناجحة 100% بمقادير مضبوطة وأسرار الشيف نور.',
        images: ['https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=1200&q=80'],
        locale: 'ar_MA',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable} ${inter.variable}`}>
            <body className="font-sans bg-surface-bg text-gray-900 antialiased selection:bg-brand-500 selection:text-white min-h-screen flex flex-col justify-between relative">
                <AppProvider>
                    <LanguageProvider>
                        <CookingBackground />
                        <Header />
                        <main className="flex-grow page-enter">
                            {children}
                        </main>
                        <ScrollToTop />
                        <Footer />
                    </LanguageProvider>
                </AppProvider>
            </body>
        </html>
    );
}
