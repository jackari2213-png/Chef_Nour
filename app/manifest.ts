import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'الشيف نور | CHEF NOUR — وصفات طهي وحلويات مغربية أصيلة',
        short_name: 'Chef Nour',
        description: 'وصفات مجربة 100%، حلويات العيد، أطباق مغربية وأسرار الطبخ مع الشيف نور.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF7ED',
        theme_color: '#F97316',
        lang: 'ar',
        dir: 'rtl',
        categories: ['food', 'lifestyle'],
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
