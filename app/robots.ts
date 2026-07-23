import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/admin/*', '/orders'],
        },
        sitemap: 'https://chefnour.ma/sitemap.xml',
    };
}
