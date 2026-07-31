-- ============================================================
-- SQL Helper Scripts for Chef Nour Platform
-- Run these in your Supabase SQL Editor
-- ============================================================

-- 1. Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  subscribed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT newsletter_subscriptions_email_key UNIQUE (email)
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Only admin can read list
CREATE POLICY "Admin reads subscriptions" ON public.newsletter_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================

-- 2. Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can send a contact message
CREATE POLICY "Anyone can send contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admin can read contact messages
CREATE POLICY "Admin reads contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can mark as read
CREATE POLICY "Admin updates contact messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================

-- 3. Cooking reels table
CREATE TABLE IF NOT EXISTS public.cooking_reels (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title_ar text NOT NULL,
  title_fr text,
  title_en text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  recipe_id uuid REFERENCES public.recipes(id) ON DELETE SET NULL,
  is_published boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cooking_reels_pkey PRIMARY KEY (id)
);

ALTER TABLE public.cooking_reels ENABLE ROW LEVEL SECURITY;

-- Anyone can read published reels
CREATE POLICY "Anyone reads published reels" ON public.cooking_reels
  FOR SELECT USING (is_published = true);

-- Only admin can write reels
CREATE POLICY "Admin manages reels" ON public.cooking_reels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================

-- 4. User favorites table (optional — for cross-device sync)
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);
