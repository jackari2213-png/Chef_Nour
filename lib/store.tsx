'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe, Review, Order, UserProfile, Language, Product } from '@/types';
import { MOCK_RECIPES, MOCK_REVIEWS, MOCK_PRODUCTS, MOCK_USER_PROFILE } from './mock-data';

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    favorites: string[]; // array of recipe IDs
    toggleFavorite: (recipeId: string) => void;
    isFavorite: (recipeId: string) => boolean;

    // User Auth
    user: UserProfile | null;
    login: (email: string, role?: 'user' | 'admin') => void;
    logout: () => void;

    // Recipes Management
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id' | 'created_at' | 'rating_avg' | 'rating_count' | 'views_count'>) => void;
    updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
    deleteRecipe: (id: string) => void;

    // Reviews & Moderation
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'created_at' | 'moderation_status'>) => void;
    approveReview: (id: string) => void;
    rejectReview: (id: string) => void;
    deleteReview: (id: string) => void;

    // Orders & Ebook Purchases
    orders: Order[];
    createOrder: (product: Product, email: string, name: string) => Order;

    // Search & Filter State
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ar');
    const [favorites, setFavorites] = useState<string[]>(['rec-1', 'rec-2']);
    const [user, setUser] = useState<UserProfile | null>(MOCK_USER_PROFILE);
    const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'ord-1001',
            user_id: 'usr-admin',
            customer_name: 'الشيف نور',
            customer_email: 'chefnour@example.com',
            total_amount_mad: 49,
            payment_status: 'paid',
            payment_ref: 'PAY-89234710',
            product_id: 'prod-1',
            product_title_ar: 'كتاب حلويات العيد - الشيف نور',
            product_cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
            created_at: new Date().toISOString(),
        }
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    // Initial Load from localStorage
    useEffect(() => {
        try {
            const favs = localStorage.getItem('chef_nour_favs');
            if (favs) setFavorites(JSON.parse(favs));

            const recs = localStorage.getItem('chef_nour_recipes');
            if (recs) setRecipes(JSON.parse(recs));

            const revs = localStorage.getItem('chef_nour_reviews');
            if (revs) setReviews(JSON.parse(revs));

            const ords = localStorage.getItem('chef_nour_orders');
            if (ords) setOrders(JSON.parse(ords));

            const usr = localStorage.getItem('chef_nour_user');
            if (usr) setUser(JSON.parse(usr));
        } catch (e) {
            console.error('Error loading state from localStorage:', e);
        }
    }, []);

    // Save changes helper
    const saveToStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key} to localStorage:`, e);
        }
    };

    const toggleFavorite = (recipeId: string) => {
        setFavorites(prev => {
            const next = prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId];
            saveToStorage('chef_nour_favs', next);
            return next;
        });
    };

    const isFavorite = (recipeId: string) => favorites.includes(recipeId);

    const login = (email: string, role: 'user' | 'admin' = 'user') => {
        const newUser: UserProfile = {
            id: role === 'admin' ? 'usr-admin' : 'usr-' + Date.now(),
            full_name: role === 'admin' ? 'الشيف نور' : email.split('@')[0],
            email: email,
            avatar_url: role === 'admin'
                ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
            role: role,
            created_at: new Date().toISOString(),
        };
        setUser(newUser);
        saveToStorage('chef_nour_user', newUser);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('chef_nour_user');
    };

    const addRecipe = (newRec: Omit<Recipe, 'id' | 'created_at' | 'rating_avg' | 'rating_count' | 'views_count'>) => {
        const fullRec: Recipe = {
            ...newRec,
            id: 'rec-' + Date.now(),
            views_count: 120,
            rating_avg: 5.0,
            rating_count: 1,
            created_at: new Date().toISOString(),
        };
        setRecipes(prev => {
            const next = [fullRec, ...prev];
            saveToStorage('chef_nour_recipes', next);
            return next;
        });
    };

    const updateRecipe = (id: string, updated: Partial<Recipe>) => {
        setRecipes(prev => {
            const next = prev.map(r => r.id === id ? { ...r, ...updated } : r);
            saveToStorage('chef_nour_recipes', next);
            return next;
        });
    };

    const deleteRecipe = (id: string) => {
        setRecipes(prev => {
            const next = prev.filter(r => r.id !== id);
            saveToStorage('chef_nour_recipes', next);
            return next;
        });
    };

    const addReview = (newRev: Omit<Review, 'id' | 'created_at' | 'moderation_status'>) => {
        const fullRev: Review = {
            ...newRev,
            id: 'rev-' + Date.now(),
            moderation_status: 'pending',
            created_at: new Date().toISOString(),
        };
        setReviews(prev => {
            const next = [fullRev, ...prev];
            saveToStorage('chef_nour_reviews', next);
            return next;
        });
    };

    const approveReview = (id: string) => {
        setReviews(prev => {
            const next = prev.map(r => r.id === id ? { ...r, moderation_status: 'approved' as const } : r);
            saveToStorage('chef_nour_reviews', next);
            return next;
        });
    };

    const rejectReview = (id: string) => {
        setReviews(prev => {
            const next = prev.map(r => r.id === id ? { ...r, moderation_status: 'rejected' as const } : r);
            saveToStorage('chef_nour_reviews', next);
            return next;
        });
    };

    const deleteReview = (id: string) => {
        setReviews(prev => {
            const next = prev.filter(r => r.id !== id);
            saveToStorage('chef_nour_reviews', next);
            return next;
        });
    };

    const createOrder = (product: Product, email: string, name: string): Order => {
        const newOrder: Order = {
            id: 'ord-' + Date.now().toString().slice(-6),
            user_id: user?.id || 'guest',
            customer_name: name,
            customer_email: email,
            total_amount_mad: product.price_mad,
            payment_status: 'paid',
            payment_ref: 'PAY-' + Math.floor(10000000 + Math.random() * 90000000),
            product_id: product.id,
            product_title_ar: product.title_ar,
            product_cover_image: product.cover_image,
            created_at: new Date().toISOString(),
        };
        setOrders(prev => {
            const next = [newOrder, ...prev];
            saveToStorage('chef_nour_orders', next);
            return next;
        });
        return newOrder;
    };

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                favorites,
                toggleFavorite,
                isFavorite,
                user,
                login,
                logout,
                recipes,
                addRecipe,
                updateRecipe,
                deleteRecipe,
                reviews,
                addReview,
                approveReview,
                rejectReview,
                deleteReview,
                orders,
                createOrder,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
