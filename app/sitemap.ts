import { MetadataRoute } from 'next';
import { MOCK_RECIPES, MOCK_PRODUCTS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://chefnour.ma';

    const recipes = MOCK_RECIPES.map(recipe => ({
        url: `${baseUrl}/recipes/${recipe.slug}`,
        lastModified: new Date(recipe.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const products = MOCK_PRODUCTS.map(product => ({
        url: `${baseUrl}/store/${product.slug}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    const staticRoutes = [
        '',
        '/recipes',
        '/store',
        '/favorites',
        '/contact',
        '/login',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.7,
    }));

    return [...staticRoutes, ...recipes, ...products];
}
