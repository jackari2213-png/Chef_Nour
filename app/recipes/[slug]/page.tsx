import React from 'react';
import type { Metadata } from 'next';
import { getRecipeBySlug, getServerLanguage, localizedValue, formatDuration } from '@/lib/server-data';
import RecipeDetailClient from './RecipeDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chefnour.ma';
const SITE_NAME = 'الشيف نور | CHEF NOUR';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const lang = await getServerLanguage();
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        return {
            title: `${SITE_NAME} — ${lang === 'fr' ? 'Recette' : lang === 'en' ? 'Recipe' : 'وصفة'}`,
        };
    }

    const title = localizedValue(recipe, 'title', lang);
    const description = localizedValue(recipe, 'description', lang);
    const image = recipe.main_image || '/og-default.jpg';
    const url = `${SITE_URL}/recipes/${recipe.slug}`;

    const siteSuffix = lang === 'fr' ? '| CHEF NOUR — Recettes marocaines authentiques' : lang === 'en' ? '| CHEF NOUR — Authentic Moroccan Recipes' : '| الشيف نور — وصفات مغربية أصيلة';

    return {
        title: `${title} ${siteSuffix}`,
        description,
        keywords: [title, 'وصفات مغربية', 'الشيف نور', 'طاجين', 'حلويات'],
        alternates: { canonical: url },
        openGraph: {
            title: `${title} ${siteSuffix}`,
            description,
            url,
            images: [{ url: image, width: 1200, height: 630, alt: title }],
            locale: lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : 'ar_MA',
            type: 'article',
            siteName: SITE_NAME,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} ${siteSuffix}`,
            description,
            images: [image],
        },
    };
}

function buildRecipeJsonLd(recipe: Awaited<ReturnType<typeof getRecipeBySlug>>, lang: 'ar' | 'fr' | 'en', url: string) {
    if (!recipe) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: localizedValue(recipe, 'title', lang),
        description: localizedValue(recipe, 'description', lang),
        image: [recipe.main_image, ...(recipe.gallery_images || [])],
        author: {
            '@type': 'Person',
            name: 'الشيف نور',
            alternateName: 'Chef Nour',
        },
        datePublished: recipe.created_at,
        prepTime: formatDuration(recipe.prep_time_minutes),
        cookTime: formatDuration(recipe.cook_time_minutes),
        totalTime: formatDuration(recipe.prep_time_minutes + recipe.cook_time_minutes),
        recipeYield: `${recipe.servings}`,
        recipeCategory: localizedValue(recipe, 'category_name', lang),
        recipeCuisine: 'Marocaine / Moroccan',
        keywords: [localizedValue(recipe, 'title', lang), 'وصفات مغربية', 'الشيف نور'],
        recipeIngredient: recipe.ingredients.map(i => `${i.amount} ${localizedValue(i, 'item', lang)}`),
        recipeInstructions: recipe.steps.map(s => ({
            '@type': 'HowToStep',
            position: s.step_number,
            name: `${localizedValue(recipe, 'title', lang)} — ${s.step_number}`,
            text: localizedValue(s, 'instruction', lang),
            ...(s.image_url ? { image: [s.image_url] } : {}),
        })),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: recipe.rating_avg.toFixed(1),
            ratingCount: String(recipe.rating_count || 0),
        },
        url,
        mainEntityOfPage: url,
    };
}

function buildBreadcrumbJsonLd(recipe: Awaited<ReturnType<typeof getRecipeBySlug>>, lang: 'ar' | 'fr' | 'en', url: string) {
    if (!recipe) return null;
    const homeLabel = lang === 'fr' ? 'Accueil' : lang === 'en' ? 'Home' : 'الرئيسية';
    const recipesLabel = lang === 'fr' ? 'Recettes' : lang === 'en' ? 'Recipes' : 'الوصفات';
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: recipesLabel, item: `${SITE_URL}/recipes` },
            { '@type': 'ListItem', position: 3, name: localizedValue(recipe, 'title', lang), item: url },
        ],
    };
}

export default async function RecipeDetailPage({ params }: Props) {
    const { slug } = await params;
    const lang = await getServerLanguage();
    const recipe = await getRecipeBySlug(slug);
    const url = `${SITE_URL}/recipes/${slug}`;
    const recipeJsonLd = buildRecipeJsonLd(recipe, lang, url);
    const breadcrumbJsonLd = buildBreadcrumbJsonLd(recipe, lang, url);

    return (
        <>
            {recipeJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }} />
            )}
            {breadcrumbJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            )}
            <RecipeDetailClient params={params} initialRecipe={recipe} />
        </>
    );
}
