'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Recipe, Review, Order, UserProfile, Language, Product, Category } from '@/types';
import { MOCK_RECIPES, MOCK_REVIEWS, MOCK_PRODUCTS, MOCK_CATEGORIES } from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase-client';
import { resolveCurrentSession, supabaseSignOut } from './useAuth';

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    favorites: string[]; // array of recipe IDs
    toggleFavorite: (recipeId: string) => void;
    isFavorite: (recipeId: string) => boolean;

    // User Auth
    user: UserProfile | null;
    sessionReady: boolean;
    setUser: (user: UserProfile | null) => void;  // exposed so admin login gate can set it directly
    login: (email: string, role?: 'user' | 'admin') => void; // legacy — kept for compatibility
    logout: () => Promise<void>;

    // Categories Management
    categories: Category[];
    addCategory: (category: Omit<Category, 'id' | 'recipe_count'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Recipes Management
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id' | 'created_at' | 'rating_avg' | 'rating_count' | 'views_count'>) => void;
    updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
    deleteRecipe: (id: string) => void;
    incrementViews: (recipeId: string) => void;

    // Reviews & Moderation
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'created_at' | 'moderation_status'>) => void;
    addReply: (parentId: string, comment: string, isAdmin: boolean) => void;
    approveReview: (id: string) => void;
    rejectReview: (id: string) => void;
    deleteReview: (id: string) => void;

    // Orders & Ebook Purchases
    orders: Order[];
    createOrder: (product: Product, email: string, name: string) => Order;

    // Search & Filter State
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Loading state
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ar');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sessionReady, setSessionReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ─── Fetch real data from Supabase on mount ───────────────────────────────
    const fetchFromSupabase = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setIsLoading(false);
            return;
        }

        try {
            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .order('name_ar', { ascending: true });

            if (categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData);
            }

            // Fetch recipes with ingredients and steps
            const { data: recipesData, error: recipesError } = await supabase
                .from('recipes')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (recipesData && !recipesError) {
                // For each recipe, fetch its ingredients and steps
                const fullRecipes: Recipe[] = await Promise.all(
                    recipesData.map(async (r: any) => {
                        const { data: ingredients } = await supabase
                            .from('ingredients')
                            .select('*')
                            .eq('recipe_id', r.id)
                            .order('order_index', { ascending: true });

                        const { data: steps } = await supabase
                            .from('steps')
                            .select('*')
                            .eq('recipe_id', r.id)
                            .order('step_number', { ascending: true });

                        return {
                            ...r,
                            gallery_images: r.gallery_images || [],
                            ingredients: ingredients || [],
                            steps: steps || [],
                        };
                    })
                );
                setRecipes(fullRecipes);
            }

            // Fetch reviews
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (reviewsData && !reviewsError) {
                setReviews(reviewsData);
            }
        } catch (err) {
            console.error('Error fetching from Supabase:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Load favorites from localStorage
        try {
            const favs = localStorage.getItem('chef_nour_favs');
            if (favs) setFavorites(JSON.parse(favs));
        } catch (e) {
            console.error('Error loading favorites from localStorage:', e);
        }

        // Restore Supabase session on mount
        (async () => {
            try {
                const profile = await resolveCurrentSession();
                if (profile) setUser(profile);
            } catch (e) {
                console.error('Error resolving session:', e);
            } finally {
                setSessionReady(true);
            }
        })();

        // Subscribe to auth state changes (login/logout in any tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session) {
                setUser(null);
            } else {
                const profile = await resolveCurrentSession();
                if (profile) setUser(profile);
            }
        });

        // Fetch real data from Supabase
        fetchFromSupabase();

        return () => subscription.unsubscribe();
    }, [fetchFromSupabase]);

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

    // Legacy login — kept for compatibility, used as fallback when Supabase is not configured
    const login = (email: string, role: 'user' | 'admin' = 'user') => {
        const newUser: UserProfile = {
            id: role === 'admin' ? 'usr-admin' : 'usr-' + Date.now(),
            full_name: role === 'admin' ? 'الشيف نور' : email.split('@')[0],
            email: email,
            avatar_url: role === 'admin' ? '/chef-nour.jpg' : undefined,
            role: role,
            created_at: new Date().toISOString(),
        };
        setUser(newUser);
    };

    const logout = async () => {
        await supabaseSignOut();
        setUser(null);
    };

    // ─── Categories Management (with Supabase sync) ───────────────────────────

    const addCategory = async (newCat: Omit<Category, 'id' | 'recipe_count'>) => {
        const localId = 'cat-' + Date.now();
        const fullCat: Category = {
            ...newCat,
            id: localId,
            recipe_count: 0,
        };

        setCategories(prev => [...prev, fullCat]);

        if (isSupabaseConfigured()) {
            try {
                const { data } = await supabase
                    .from('categories')
                    .insert({
                        name_ar: newCat.name_ar,
                        name_fr: newCat.name_fr || '',
                        name_en: newCat.name_en || '',
                        slug: newCat.slug,
                        image_url: newCat.image_url,
                    })
                    .select()
                    .single();

                if (data) {
                    setCategories(prev => prev.map(c => c.id === localId ? { ...c, id: data.id } : c));
                }
            } catch (err) {
                console.error('Failed to add category to Supabase:', err);
            }
        }
    };

    const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));

        if (isSupabaseConfigured()) {
            try {
                await supabase
                    .from('categories')
                    .update({
                        ...(updatedFields.name_ar && { name_ar: updatedFields.name_ar }),
                        ...(updatedFields.name_fr && { name_fr: updatedFields.name_fr }),
                        ...(updatedFields.name_en && { name_en: updatedFields.name_en }),
                        ...(updatedFields.slug && { slug: updatedFields.slug }),
                        ...(updatedFields.image_url && { image_url: updatedFields.image_url }),
                    })
                    .eq('id', id);
            } catch (err) {
                console.error('Failed to update category in Supabase:', err);
            }
        }
    };

    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));

        if (isSupabaseConfigured()) {
            try {
                await supabase.from('categories').delete().eq('id', id);
            } catch (err) {
                console.error('Failed to delete category from Supabase:', err);
            }
        }
    };

    // ─── Recipes CRUD (with Supabase sync) ────────────────────────────────────

    const addRecipe = async (newRec: Omit<Recipe, 'id' | 'created_at' | 'rating_avg' | 'rating_count' | 'views_count'>) => {
        const localId = 'rec-' + Date.now();
        const fullRec: Recipe = {
            ...newRec,
            id: localId,
            views_count: 0,
            rating_avg: 0,
            rating_count: 0,
            created_at: new Date().toISOString(),
        };

        // Optimistic update
        setRecipes(prev => [fullRec, ...prev]);

        // Sync to Supabase
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('recipes')
                    .insert({
                        title_ar: newRec.title_ar,
                        title_fr: newRec.title_fr,
                        title_en: newRec.title_en,
                        slug: newRec.slug,
                        description_ar: newRec.description_ar,
                        category_id: newRec.category_id,
                        category_name_ar: newRec.category_name_ar,
                        difficulty: newRec.difficulty,
                        prep_time_minutes: newRec.prep_time_minutes,
                        cook_time_minutes: newRec.cook_time_minutes,
                        servings: newRec.servings,
                        main_image: newRec.main_image,
                        gallery_images: newRec.gallery_images || [],
                        video_url: newRec.video_url,
                        featured: newRec.featured,
                        published: newRec.published ?? true,
                    })
                    .select()
                    .single();

                if (data && !error) {
                    // Insert ingredients
                    if (newRec.ingredients?.length) {
                        await supabase.from('ingredients').insert(
                            newRec.ingredients.map((ing, idx) => ({
                                recipe_id: data.id,
                                item_ar: ing.item_ar,
                                amount: ing.amount,
                                order_index: idx + 1,
                            }))
                        );
                    }
                    // Insert steps
                    if (newRec.steps?.length) {
                        await supabase.from('steps').insert(
                            newRec.steps.map((step, idx) => ({
                                recipe_id: data.id,
                                step_number: idx + 1,
                                instruction_ar: step.instruction_ar,
                                image_url: step.image_url,
                            }))
                        );
                    }

                    // Update category recipe_count
                    if (newRec.category_id) {
                        await supabase.rpc('increment_category_count', { cat_id: newRec.category_id }).then();
                        setCategories(prev => prev.map(c =>
                            c.id === newRec.category_id ? { ...c, recipe_count: c.recipe_count + 1 } : c
                        ));
                    }

                    // Replace local temp ID with Supabase real ID
                    setRecipes(prev =>
                        prev.map(r => r.id === localId ? { ...fullRec, id: data.id } : r)
                    );
                }
            } catch (err) {
                console.error('Error saving recipe to Supabase:', err);
            }
        }
    };

    const updateRecipe = async (id: string, updated: Partial<Recipe>) => {
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));

        if (isSupabaseConfigured()) {
            try {
                const { ingredients: newIngredients, steps: newSteps, ...recipeFields } = updated;

                if (Object.keys(recipeFields).length > 0) {
                    await supabase.from('recipes').update(recipeFields).eq('id', id);
                }

                if (newIngredients && newIngredients.length > 0) {
                    await supabase.from('ingredients').delete().eq('recipe_id', id);
                    await supabase.from('ingredients').insert(
                        newIngredients.map((ing, idx) => ({
                            recipe_id: id,
                            item_ar: ing.item_ar,
                            amount: ing.amount,
                            order_index: idx + 1,
                        }))
                    );
                }

                if (newSteps && newSteps.length > 0) {
                    await supabase.from('steps').delete().eq('recipe_id', id);
                    await supabase.from('steps').insert(
                        newSteps.map((step, idx) => ({
                            recipe_id: id,
                            step_number: idx + 1,
                            instruction_ar: step.instruction_ar,
                            image_url: step.image_url,
                        }))
                    );
                }
            } catch (err) {
                console.error('Error updating recipe in Supabase:', err);
            }
        }
    };

    const deleteRecipe = (id: string) => {
        const recipe = recipes.find(r => r.id === id);
        setRecipes(prev => prev.filter(r => r.id !== id));

        if (isSupabaseConfigured()) {
            supabase.from('recipes').delete().eq('id', id).then();
            // Decrement category count
            if (recipe?.category_id) {
                supabase.rpc('decrement_category_count', { cat_id: recipe.category_id }).then();
                setCategories(prev => prev.map(c =>
                    c.id === recipe.category_id ? { ...c, recipe_count: Math.max(0, c.recipe_count - 1) } : c
                ));
            }
        }
    };

    // Increment recipe views count
    const incrementViews = (recipeId: string) => {
        setRecipes(prev => prev.map(r =>
            r.id === recipeId ? { ...r, views_count: r.views_count + 1 } : r
        ));
        if (isSupabaseConfigured()) {
            supabase.rpc('increment_views', { recipe_id: recipeId }).then();
        }
    };

    // ─── Reviews CRUD (with Supabase sync) ────────────────────────────────────

    const addReview = async (newRev: Omit<Review, 'id' | 'created_at' | 'moderation_status'>) => {
        const localId = 'rev-' + Date.now();
        const fullRev: Review = {
            ...newRev,
            id: localId,
            moderation_status: 'pending',
            created_at: new Date().toISOString(),
        };

        // Optimistic UI update
        setReviews(prev => [fullRev, ...prev]);

        // Sync to Supabase
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .insert({
                        user_name: newRev.user_name,
                        user_avatar: newRev.user_avatar,
                        is_admin: newRev.is_admin || false,
                        parent_id: newRev.parent_id || null,
                        recipe_id: newRev.recipe_id,
                        recipe_title_ar: newRev.recipe_title_ar,
                        rating: newRev.rating,
                        comment: newRev.comment,
                        moderation_status: 'approved',
                    })
                    .select()
                    .single();

                if (data && !error) {
                    setReviews(prev =>
                        prev.map(r => r.id === localId ? { ...fullRev, id: data.id, moderation_status: 'approved' } : r)
                    );

                    // Recalculate rating_avg and rating_count for the recipe
                    if (newRev.recipe_id && newRev.rating && newRev.rating > 0) {
                        const { data: allRevs } = await supabase
                            .from('reviews')
                            .select('rating')
                            .eq('recipe_id', newRev.recipe_id)
                            .not('rating', 'is', null)
                            .gt('rating', 0);

                        if (allRevs && allRevs.length > 0) {
                            const total = allRevs.reduce((sum, r) => sum + (r.rating || 0), 0);
                            const avg = parseFloat((total / allRevs.length).toFixed(2));
                            const count = allRevs.length;

                            await supabase
                                .from('recipes')
                                .update({ rating_avg: avg, rating_count: count })
                                .eq('id', newRev.recipe_id);

                            // Update local state immediately
                            setRecipes(prev => prev.map(r =>
                                r.id === newRev.recipe_id
                                    ? { ...r, rating_avg: avg, rating_count: count }
                                    : r
                            ));
                        }
                    }
                }
            } catch (err) {
                console.error('Error saving review to Supabase:', err);
            }
        }
    };

    const addReply = async (parentId: string, comment: string, isAdmin: boolean) => {
        const parent = reviews.find(r => r.id === parentId);
        const localId = 'rev-' + Date.now();
        const reply: Review = {
            id: localId,
            parent_id: parentId,
            user_id: isAdmin ? 'usr-admin' : (user?.id || 'usr-guest'),
            user_name: isAdmin ? 'الشيف نور' : (user?.full_name || 'زائر'),
            user_avatar: isAdmin ? '/chef-nour.jpg' : (user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'),
            is_admin: isAdmin,
            recipe_id: parent?.recipe_id || '',
            recipe_title_ar: parent?.recipe_title_ar,
            rating: 0,
            comment,
            moderation_status: 'approved',
            created_at: new Date().toISOString(),
        };

        // Optimistic update
        setReviews(prev => [...prev, reply]);

        // Sync to Supabase
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .insert({
                        user_name: reply.user_name,
                        user_avatar: reply.user_avatar,
                        is_admin: isAdmin,
                        parent_id: parentId,
                        recipe_id: reply.recipe_id,
                        recipe_title_ar: reply.recipe_title_ar,
                        comment,
                        moderation_status: 'approved',
                    })
                    .select()
                    .single();

                if (data && !error) {
                    setReviews(prev =>
                        prev.map(r => r.id === localId ? { ...reply, id: data.id } : r)
                    );
                }
            } catch (err) {
                console.error('Error saving reply to Supabase:', err);
            }
        }
    };

    const approveReview = (id: string) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, moderation_status: 'approved' as const } : r));
        if (isSupabaseConfigured()) {
            supabase.from('reviews').update({ moderation_status: 'approved' }).eq('id', id).then();
        }
    };

    const rejectReview = (id: string) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, moderation_status: 'rejected' as const } : r));
        if (isSupabaseConfigured()) {
            supabase.from('reviews').update({ moderation_status: 'rejected' }).eq('id', id).then();
        }
    };

    const deleteReview = (id: string) => {
        setReviews(prev => prev.filter(r => r.id !== id));
        if (isSupabaseConfigured()) {
            supabase.from('reviews').delete().eq('id', id).then();
        }
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
        setOrders(prev => [newOrder, ...prev]);
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
                sessionReady,
                setUser,
                login,
                logout,
                categories,
                addCategory,
                updateCategory,
                deleteCategory,
                recipes,
                addRecipe,
                updateRecipe,
                deleteRecipe,
                incrementViews,
                reviews,
                addReview,
                addReply,
                approveReview,
                rejectReview,
                deleteReview,
                orders,
                createOrder,
                searchQuery,
                setSearchQuery,
                isLoading,
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
