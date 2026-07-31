import React from 'react';
import type { Metadata } from 'next';
import { getCategoryBySlug, getServerLanguage, localizedValue } from '@/lib/server-data';
import CategoryDetailClient from './CategoryDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chefnour.ma';
const SITE_NAME = 'الشيف نور | CHEF NOUR';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const lang = await getServerLanguage();
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: `${SITE_NAME} — ${lang === 'fr' ? 'Catégorie' : lang === 'en' ? 'Category' : 'قسم'}`,
        };
    }

    const name = localizedValue(category, 'name', lang);
    const url = `${SITE_URL}/category/${category.slug}`;
    const siteSuffix = lang === 'fr' ? '| CHEF NOUR — Recettes marocaines authentiques' : lang === 'en' ? '| CHEF NOUR — Authentic Moroccan Recipes' : '| الشيف نور — وصفات مغربية أصيلة';

    return {
        title: `${name} ${siteSuffix}`,
        description: lang === 'fr'
            ? `Découvrez toutes nos recettes de ${name} — testées et réussies 100%.`
            : lang === 'en'
                ? `Discover all our ${name} recipes — 100% tested and proven.`
                : `اكتشفي جميع وصفات ${name} — مجربة وناجحة 100% بمقادير مضبوطة.`,
        keywords: [name, 'وصفات مغربية', 'الشيف نور', 'طبخ مغربي'],
        alternates: { canonical: url },
        openGraph: {
            title: `${name} ${siteSuffix}`,
            description: lang === 'fr'
                ? `Découvrez toutes nos recettes de ${name}.`
                : lang === 'en'
                    ? `Discover all our ${name} recipes.`
                    : `اكتشفي جميع وصفات ${name}.`,
            url,
            images: [{ url: category.image_url, width: 1200, height: 630, alt: name }],
            locale: lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : 'ar_MA',
            type: 'website',
            siteName: SITE_NAME,
        },
    };
}

function buildCollectionJsonLd(category: Awaited<ReturnType<typeof getCategoryBySlug>>, lang: 'ar' | 'fr' | 'en', url: string) {
    if (!category) return null;
    const homeLabel = lang === 'fr' ? 'Accueil' : lang === 'en' ? 'Home' : 'الرئيسية';
    const recipesLabel = lang === 'fr' ? 'Recettes' : lang === 'en' ? 'Recipes' : 'الوصفات';
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: localizedValue(category, 'name', lang),
        description: lang === 'fr'
            ? `Découvrez toutes nos recettes de ${localizedValue(category, 'name', lang)}.`
            : lang === 'en'
                ? `Discover all our ${localizedValue(category, 'name', lang)} recipes.`
                : `اكتشفي جميع وصفات ${localizedValue(category, 'name', lang)}.`,
        url,
        image: category.image_url,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: recipesLabel, item: `${SITE_URL}/recipes` },
                { '@type': 'ListItem', position: 3, name: localizedValue(category, 'name', lang), item: url },
            ],
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: [],
        },
    };
}

export default async function CategoryDetailPage({ params }: Props) {
    const { slug } = await params;
    const lang = await getServerLanguage();
    const category = await getCategoryBySlug(slug);
    const url = `${SITE_URL}/category/${slug}`;
    const collectionJsonLd = buildCollectionJsonLd(category, lang, url);

    return (
        <>
            {collectionJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
            )}
            <CategoryDetailClient params={params} initialCategory={category} />
        </>
    );
}
