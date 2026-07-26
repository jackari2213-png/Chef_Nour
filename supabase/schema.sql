-- ========================================================
-- CHEF NOUR PLATFORM - FULL SUPABASE DATABASE SCHEMA
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed');

-- 3. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_fr TEXT,
    name_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    recipe_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RECIPES TABLE
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ar TEXT NOT NULL,
    title_fr TEXT,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name_ar TEXT NOT NULL,
    difficulty difficulty_level DEFAULT 'medium'::difficulty_level,
    prep_time_minutes INT DEFAULT 20,
    cook_time_minutes INT DEFAULT 45,
    servings INT DEFAULT 4,
    main_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    views_count INT DEFAULT 0,
    rating_avg NUMERIC(3,2) DEFAULT 5.0,
    rating_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    item_ar TEXT NOT NULL,
    amount TEXT NOT NULL,
    order_index INT DEFAULT 1
);

-- 7. RECIPE STEPS TABLE
CREATE TABLE IF NOT EXISTS public.steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    instruction_ar TEXT NOT NULL,
    image_url TEXT
);

-- 8. REVIEWS & DISCUSSION THREADS TABLE (Supports Parent-Child Nesting)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE, -- NULL for top-level, UUID for replies
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    recipe_title_ar TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    photo_url TEXT,
    chef_reply TEXT,
    likes_count INT DEFAULT 0,
    moderation_status moderation_status DEFAULT 'approved'::moderation_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PRODUCTS (EBOOKS & DIGITAL PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ar TEXT NOT NULL,
    title_fr TEXT,
    title_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT NOT NULL,
    price_mad NUMERIC(10,2) NOT NULL,
    old_price_mad NUMERIC(10,2),
    discount_percent INT DEFAULT 0,
    cover_image TEXT NOT NULL,
    file_url TEXT NOT NULL,
    recipes_count INT DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    amount_mad NUMERIC(10,2) NOT NULL,
    status order_status DEFAULT 'pending'::order_status,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. SITE SETTINGS TABLE (Social links, banner text, active Giveaway credentials)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    chef_name TEXT DEFAULT 'الشيف نور',
    chef_avatar TEXT DEFAULT '/chef-nour.jpg',
    bio_ar TEXT DEFAULT 'منصة طهي مغربية أصيلة. وصفات مجربة وناجحة 100% بمقادير مضبوطة وأسرار احترافية من المطبخ مباشرةً إلى مائدتك.',
    instagram_url TEXT DEFAULT 'https://instagram.com/chefnour',
    youtube_url TEXT DEFAULT 'https://youtube.com/@chefnour',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@chefnour',
    facebook_url TEXT DEFAULT 'https://facebook.com/chefnour',
    whatsapp_number TEXT DEFAULT '+212600000000',
    email TEXT DEFAULT 'contact@chefnour.ma',
    announcement_banner_text TEXT DEFAULT '📖 كتب وصفات الشيف نور الرقمية — قريباً جداً | وصفات مجربة وناجحة 100% بمقادير مضبوطة',
    giveaway_active BOOLEAN DEFAULT TRUE,
    giveaway_title TEXT DEFAULT '🎁 هدية مجتمعي الكبرى - عجانة كهربائية فاخرة + كتاب الحلويات مجاناً!',
    giveaway_description TEXT DEFAULT 'شاركي معنا في سحب العيد الكبير للفوز بعجانة احترافية ونسخة مجانية من كتاب الشيف نور الجديد. اضغطي للتسجيل والمشاركة!',
    giveaway_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    giveaway_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '14 days'
);

-- 12. COOKING REELS TABLE (Dynamic list of video reels)
CREATE TABLE IF NOT EXISTS public.cooking_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    duration TEXT DEFAULT '3:00',
    views_count TEXT DEFAULT '0',
    thumb_url TEXT NOT NULL,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooking_reels ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public recipes are viewable by everyone" ON public.recipes FOR SELECT USING (published = true);
CREATE POLICY "Public ingredients are viewable by everyone" ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Public steps are viewable by everyone" ON public.steps FOR SELECT USING (true);
CREATE POLICY "Public approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (published = true);
CREATE POLICY "Public site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public cooking reels are viewable by everyone" ON public.cooking_reels FOR SELECT USING (true);

-- INSERT policies (allow anonymous comment posting)
CREATE POLICY "Anyone can post reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reviews" ON public.reviews FOR DELETE USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert recipes" ON public.recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update recipes" ON public.recipes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete recipes" ON public.recipes FOR DELETE USING (true);
CREATE POLICY "Anyone can insert ingredients" ON public.ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert steps" ON public.steps FOR INSERT WITH CHECK (true);

-- ========================================================
-- SEED DATA (REAL MOROCCAN RECIPES & CATEGORIES)
-- ========================================================

-- Insert Categories
INSERT INTO public.categories (id, name_ar, name_fr, name_en, slug, image_url, recipe_count) VALUES
('11111111-1111-1111-1111-111111111111', 'أطباق مغربية', 'Cuisine Marocaine', 'Moroccan Cuisine', 'moroccan', 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=600&q=80', 0),
('22222222-2222-2222-2222-222222222222', 'حلويات', 'Pâtisseries & Desserts', 'Sweets & Desserts', 'sweets', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 0),
('33333333-3333-3333-3333-333333333333', 'رمضان', 'Spécial Ramadan', 'Ramadan Specials', 'ramadan', 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&q=80', 0),
('44444444-4444-4444-4444-444444444444', 'مملحات', 'Salés & Feuilletés', 'Savory Pastries', 'savory', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80', 0)
ON CONFLICT (slug) DO NOTHING;

-- Insert Real Recipe 1: Chocolate Cake
INSERT INTO public.recipes (id, title_ar, title_fr, title_en, slug, description_ar, category_id, category_name_ar, difficulty, prep_time_minutes, cook_time_minutes, servings, main_image, views_count, rating_avg, rating_count, featured, published) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كعكة الشوكولاتة بالكريمة', 'Gâteau Fondant au Chocolat', 'Creamy Chocolate Fudge Cake', 'chocolate-cream-cake', 'كعكة شوكولاتة غنية وهشة مع طبقة فاخرة من الكريمة والغاناش المخملي. وصفة مثالية للمناسبات والعزومات.', '22222222-2222-2222-2222-222222222222', 'حلويات', 'easy', 20, 45, 8, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', 0, 0.00, 0, true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Real Recipe 2: Chicken Tagine
INSERT INTO public.recipes (id, title_ar, title_fr, title_en, slug, description_ar, category_id, category_name_ar, difficulty, prep_time_minutes, cook_time_minutes, servings, main_image, views_count, rating_avg, rating_count, featured, published) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'طاجين الدجاج بالزيتون والليمون المصير', 'Poulet aux Olives et Citron Confit', 'Moroccan Chicken Tagine with Olives & Preserved Lemon', 'chicken-tagine-olives', 'طبق مغربي أصيل وفاخر بنكهة متوازنة بين الدجاج الطري المحمر والزيتون الأخضر والليمون المخلل المصير.', '11111111-1111-1111-1111-111111111111', 'أطباق مغربية', 'medium', 30, 60, 6, 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=800&q=80', 0, 0.00, 0, true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Ingredients for Chocolate Cake
INSERT INTO public.ingredients (recipe_id, item_ar, amount, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'دقيق حلويات ممتاز', '250g', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'بودرة كاكاو خام مر', '75g', 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'سكر ناعم', '200g', 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'بيض طازج', '3 حبات', 4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'حليب دافئ', '200ml', 5),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'زيت نباتي', '100ml', 6),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'بيكنج بودر', '1 كيس (11g)', 7),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'فانيلا سائلا', '1 ملعقة صغيرة', 8);

-- Insert Steps for Chocolate Cake
INSERT INTO public.steps (recipe_id, step_number, instruction_ar, image_url) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'فيوعاء كبير، نخفق البيض والسكر والفانيلا جيداً حتى نحصل على خليط كريمي فاتح اللون.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'نضيف الزيت والحليب الدافئ بالتدريج مع الاستمرار في الخفق الخفيف.', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'ننخل الدقيق والكاكاو والبيكنج بودر فوق الخليط ونقلب برفق حتى يتجانس القوام.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'نسكب الخليط في قالب مدهون بالزبداً ومبطن بالكاكاو، ونخبز في فرن مسخن مسبقاً على 180° مئوية لمدة 40-45 دقيقة.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80');

-- Insert Initial Top Level Reviews & Replies
INSERT INTO public.reviews (id, user_name, user_avatar, recipe_id, recipe_title_ar, rating, comment, is_admin, moderation_status) VALUES
('c1111111-1111-1111-1111-111111111111', 'أم كريمة', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'كعكة الشوكولاتة بالكريمة', 5, 'جربت كيكة الشوكولاتة اليوم وطلعت خفيفة وهشيشة بزاف! أولادي عجباتهم بزاف شكراً شيف نور ❤️', false, 'approved');

-- Admin Reply
INSERT INTO public.reviews (user_name, user_avatar, recipe_id, parent_id, comment, is_admin, moderation_status) VALUES
('الشيف نور', '/chef-nour.jpg', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', 'بالصحة والعافية أختي أم كريمة! فرحتيني بزاف بتطبيقك الممتاز 👌❤️', true, 'approved');

-- Insert Site Settings Seed
INSERT INTO public.site_settings (id, chef_name, chef_avatar, bio_ar, instagram_url, youtube_url, tiktok_url, facebook_url, whatsapp_number, email, announcement_banner_text, giveaway_active, giveaway_title, giveaway_description, giveaway_image_url) VALUES
(1, 'الشيف نور', '/chef-nour.jpg', 'منصة طهي مغربية أصيلة. وصفات مجربة وناجحة 100% بمقادير مضبوطة وأسرار احترافية من المطبخ مباشرةً إلى مائدتك.', 'https://instagram.com/chefnour', 'https://youtube.com/@chefnour', 'https://tiktok.com/@chefnour', 'https://facebook.com/chefnour', '+212600000000', 'contact@chefnour.ma', '📖 كتب وصفات الشيف نور الرقمية — قريباً جداً | وصفات مجربة وناجحة 100% بمقادير مضبوطة', true, '🎁 هدية مجتمعي الكبرى - عجانة كهربائية فاخرة + كتاب الحلويات مجاناً!', 'شاركي معنا في سحب العيد الكبير للفوز بعجانة احترافية ونسخة مجانية من كتاب الشيف نور الجديد. اضغطي للتسجيل والمشاركة!', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80')
ON CONFLICT (id) DO UPDATE SET
    chef_name = EXCLUDED.chef_name,
    instagram_url = EXCLUDED.instagram_url,
    youtube_url = EXCLUDED.youtube_url,
    tiktok_url = EXCLUDED.tiktok_url,
    facebook_url = EXCLUDED.facebook_url;

-- Insert Cooking Reels Seeds
INSERT INTO public.cooking_reels (id, title, duration, views_count, thumb_url, video_url) VALUES
('d1111111-1111-1111-1111-111111111111', 'سر الكسكس المغربي المثالي', '3:42', '842K', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80', 'https://www.youtube.com/embed/s_P-_EgMJuI?autoplay=1'),
('d2222222-2222-2222-2222-222222222222', 'طاجين الدجاج الأصيل خطوة بخطوة', '5:18', '1.2M', 'https://images.unsplash.com/photo-1541518763669-27fef04b14da?w=400&q=80', 'https://www.youtube.com/embed/q8Q3mJ_vSCo?autoplay=1'),
('d3333333-3333-3333-3333-333333333333', 'حلوى الشباكية المغربية السريعة', '4:05', '560K', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&q=80', 'https://www.youtube.com/embed/KFHyzmLsKEI?autoplay=1'),
('d4444444-4444-4444-4444-444444444444', 'كيكة البرتقال الرطبة والمحببة', '6:10', '980K', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80', 'https://www.youtube.com/embed/IWNVT3bGv4A?autoplay=1')
ON CONFLICT (id) DO NOTHING;

