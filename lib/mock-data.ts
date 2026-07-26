import { Category, Recipe, Product, Review, UserProfile } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        name_ar: 'حلويات',
        name_fr: 'Pâtisseries & Desserts',
        name_en: 'Sweets & Desserts',
        slug: 'sweets',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-2',
        name_ar: 'أطباق رئيسية',
        name_fr: 'Plats Principaux',
        name_en: 'Main Courses',
        slug: 'main-courses',
        image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-3',
        name_ar: 'رمضان',
        name_fr: 'Spécial Ramadan',
        name_en: 'Ramadan Specials',
        slug: 'ramadan',
        image_url: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-4',
        name_ar: 'سلطات',
        name_fr: 'Salades & Entrées',
        name_en: 'Salads & Starters',
        slug: 'salads',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-5',
        name_ar: 'مملحات',
        name_fr: 'Salés & Feuilletés',
        name_en: 'Savory Pastries',
        slug: 'savory',
        image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-6',
        name_ar: 'مشروبات',
        name_fr: 'Boissons & Smoothies',
        name_en: 'Drinks & Smoothies',
        slug: 'drinks',
        image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-7',
        name_ar: 'خبز وعجائن',
        name_fr: 'Pains & Viennoiseries',
        name_en: 'Breads & Doughs',
        slug: 'breads',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
        recipe_count: 0,
    },
    {
        id: 'cat-8',
        name_ar: 'أطباق مغربية',
        name_fr: 'Cuisine Marocaine',
        name_en: 'Moroccan Cuisine',
        slug: 'moroccan',
        image_url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80',
        recipe_count: 0,
    },
];

// ─── EMPTY STARTING RECIPES (will be populated by admin via Supabase) ─────────
// These are placeholder templates visible until the admin adds real recipes.
// All numbers are realistic starting values (0 views, 0 ratings).
export const MOCK_RECIPES: Recipe[] = [];

// ─── PRODUCTS (Digital Ebooks) ────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        title_ar: 'كتاب حلويات العيد - الشيف نور',
        title_fr: "Livre Spécial Pâtisseries de l'Aïd",
        title_en: "Chef Nour's Eid Sweets Cookbook",
        slug: 'eid-sweets-cookbook',
        description_ar: 'دليلك الشامل لنجاح حلويات العيد والمناسبات بخطوات مبسطة ومقادير مضبوطة 100%. يضم 30 وصفة حصرياً مع أسرار الشيف نور الخاصة للحصول على نتائج احترافية من المرة الأولى.',
        price_mad: 49,
        old_price_mad: 99,
        discount_percent: 50,
        cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
        file_url: '/assets/ebooks/chef-nour-eid-sweets.pdf',
        recipes_count: 30,
        features: [
            '30 وصفة مجربة ومكتوبة بدقة',
            'مقادير مضبوطة بالغرام والكوب',
            'أسرار الشيف لنضج مثالي وقرمشة تدوم',
            'صور عالية الدقة لكل مرحلة',
            'تحديثات مجانية مدى الحياة',
            'ضمان استرجاع لمدة 30 يوم'
        ],
        published: true,
        created_at: '2026-05-01T00:00:00Z',
    }
];

// ─── REVIEWS: Start empty — real reviews come from Supabase ───────────────────
export const MOCK_REVIEWS: Review[] = [];

// ─── ADMIN STATS: Real starting values ────────────────────────────────────────
export const MOCK_ADMIN_STATS = {
    total_recipes: 0,
    total_recipes_change: '+0%',
    book_sales: 0,
    book_sales_change: '+0%',
    pending_reviews: 0,
    pending_reviews_change: '+0%',
    total_views: '0',
    total_views_change: '+0%',
};

// ─── DEFAULT USER: Admin Chef Nour ────────────────────────────────────────────
export const MOCK_USER_PROFILE: UserProfile = {
    id: 'usr-admin',
    full_name: 'الشيف نور',
    email: 'chefnour@example.com',
    avatar_url: '/chef-nour.jpg',
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z',
};
