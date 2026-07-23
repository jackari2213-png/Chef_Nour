-- CHEF NOUR Supabase Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  recipe_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name_ar TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time_minutes INT DEFAULT 20,
  cook_time_minutes INT DEFAULT 40,
  servings INT DEFAULT 4,
  main_image TEXT NOT NULL,
  video_url TEXT,
  views_count INT DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 5.0,
  rating_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Recipe Ingredients
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  item_ar TEXT NOT NULL,
  item_fr TEXT,
  item_en TEXT,
  amount TEXT,
  order_index INT DEFAULT 0
);

-- 5. Recipe Steps
CREATE TABLE IF NOT EXISTS public.recipe_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction_ar TEXT NOT NULL,
  instruction_fr TEXT,
  instruction_en TEXT,
  image_url TEXT
);

-- 6. Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- 7. Reviews & User Cooking Photos
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photo_url TEXT,
  chef_reply TEXT,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Products (E-Books)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT NOT NULL,
  price_mad NUMERIC(10,2) NOT NULL,
  old_price_mad NUMERIC(10,2),
  discount_percent INT DEFAULT 0,
  cover_image TEXT NOT NULL,
  file_url TEXT NOT NULL,
  recipes_count INT DEFAULT 30,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount_mad NUMERIC(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_ref TEXT,
  customer_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  price_mad NUMERIC(10,2) NOT NULL
);

-- 11. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES --
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public recipes are viewable by everyone" ON public.recipes FOR SELECT USING (published = true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (published = true);
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (moderation_status = 'approved');

-- User Policies
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Bypass Trigger/Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
