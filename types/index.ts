export type Difficulty = 'easy' | 'medium' | 'hard';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type UserRole = 'user' | 'admin';
export type Language = 'ar' | 'fr' | 'en';

export interface Category {
    id: string;
    name_ar: string;
    name_fr: string;
    name_en: string;
    slug: string;
    image_url: string;
    recipe_count: number;
}

export interface Ingredient {
    id: string;
    item_ar: string;
    item_fr?: string;
    item_en?: string;
    amount: string;
    order_index?: number;
}

export interface Step {
    id: string;
    step_number: number;
    instruction_ar: string;
    instruction_fr?: string;
    instruction_en?: string;
    image_url?: string;
}

export interface Recipe {
    id: string;
    title_ar: string;
    title_fr?: string;
    title_en?: string;
    slug: string;
    description_ar: string;
    description_fr?: string;
    description_en?: string;
    category_id: string;
    category_name_ar: string;
    difficulty: Difficulty;
    prep_time_minutes: number;
    cook_time_minutes: number;
    servings: number;
    main_image: string;
    gallery_images?: string[];
    video_url?: string;
    views_count: number;
    rating_avg: number;
    rating_count: number;
    featured?: boolean;
    published: boolean;
    ingredients: Ingredient[];
    steps: Step[];
    created_at: string;
}

export interface Review {
    id: string;
    parent_id?: string | null;        // null = top-level; string = reply to that id
    user_id: string;
    user_name: string;
    user_avatar?: string;
    is_admin?: boolean;               // true = Chef Nour (shows special badge)
    recipe_id: string;
    recipe_title_ar?: string;
    rating: number;                   // 0 for replies (no rating)
    comment: string;
    photo_url?: string;
    chef_reply?: string;
    likes_count?: number;
    moderation_status: ModerationStatus;
    created_at: string;
    replies?: Review[];               // hydrated client-side from flat list
}

export interface Product {
    id: string;
    title_ar: string;
    title_fr?: string;
    title_en?: string;
    slug: string;
    description_ar: string;
    price_mad: number;
    old_price_mad?: number;
    discount_percent?: number;
    cover_image: string;
    preview_images?: string[];
    file_url: string;
    recipes_count: number;
    features?: string[];
    published: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    customer_name: string;
    customer_email: string;
    total_amount_mad: number;
    payment_status: PaymentStatus;
    payment_ref: string;
    product_id: string;
    product_title_ar: string;
    product_cover_image: string;
    created_at: string;
}

export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    role: UserRole;
    created_at: string;
}

export interface SearchFilters {
    query?: string;
    category?: string;
    difficulty?: Difficulty;
    maxPrepTime?: number;
    sortBy?: 'views' | 'rating' | 'newest' | 'quickest';
}
