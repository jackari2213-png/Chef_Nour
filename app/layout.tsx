import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Tajawal, Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookingBackground from '@/components/CookingBackground';
import LanguageProvider from '@/components/LanguageProvider';
import ScrollToTop from '@/components/ScrollToTop';
import RegisterSW from '@/components/RegisterSW';
import ConnectivityBanner from '@/components/ConnectivityBanner';
import { ToastProvider } from '@/lib/toast';

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chefnour.ma';

export const viewport: Viewport = {
    themeColor: '#F97316',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    manifest: '/manifest.webmanifest',
    icons: {
        icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
        apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    appleWebApp: {
        capable: true,
        title: 'الشيف نور | CHEF NOUR',
        statusBarStyle: 'default',
    },
    title: {
        default: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
        template: '%s',
    },
    description: 'الموقع الرسمي للشيف نور. وصفات مجربة 100%، حلويات العيد، أطباق مغربية وأسرار الطبخ مع دليلك الشامل لنجاح الوصفات بمقادير مضبوطة.',
    keywords: ['الشيف نور', 'وصفات مغربية', 'طاجين', 'حلويات العيد', 'كتاب الشيف نور', 'طبخ مغربي', 'Chef Nour'],
    openGraph: {
        title: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
        description: 'وصفات مجربة وناجحة 100% بمقادير مضبوطة وأسرار الشيف نور.',
        images: ['https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=1200&q=80'],
        locale: 'ar_MA',
        type: 'website',
        siteName: 'الشيف نور | CHEF NOUR',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
        description: 'وصفات مجربة وناجحة 100% بمقادير مضبوطة وأسرار الشيف نور.',
        images: ['https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=1200&q=80'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'الشيف نور',
    alternateName: 'Chef Nour',
    url: SITE_URL,
    logo: `${SITE_URL}/chef-nour.jpg`,
    sameAs: [],
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@chefnour.ma',
        contactType: 'customer service',
    },
};

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'الشيف نور | CHEF NOUR',
    url: SITE_URL,
    inLanguage: ['ar', 'fr', 'en'],
    publisher: {
        '@type': 'Organization',
        name: 'الشيف نور',
        url: SITE_URL,
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
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
                <AppProvider>
                    <ToastProvider>
                        <LanguageProvider>
                            <ConnectivityBanner />
                            <CookingBackground />
                            <Header />
                            <main className="flex-grow page-enter">
                                {children}
                            </main>
                            <ScrollToTop />
                            <Footer />
                            <RegisterSW />
                        </LanguageProvider>
                    </ToastProvider>
                </AppProvider>
            </body>
        </html>
    );
}
