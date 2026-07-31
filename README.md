# 🍳 Chef Nour (الشيف نور) — Recipe Platform

Chef Nour is a modern, high-performance Moroccan & international culinary platform built with Next.js 15, Supabase, and Tailwind CSS. It features multi-language support (Arabic, French, English), real-time user ratings and reviews, an interactive cooking store, admin management dashboard, cooking reels, and full SEO optimization.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- npm / yarn / pnpm
- Supabase project

### 2. Installation
```bash
git clone https://github.com/jackari2213-png/Chef_Nour.git
cd Chef_Nour
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Database Setup (Supabase SQL Editor)
Run the SQL scripts located in the `supabase/` folder in your Supabase SQL Editor in the following order:

1. **`supabase/schema.sql`** — Initial tables, schemas, indexes, and seed categories/recipes.
2. **`supabase/rls-hardening.sql`** — Row Level Security policies, admin authorization helper `is_admin()`, and rating calculation stored procedure `recalc_recipe_rating`.
3. **`supabase/missing-tables.sql`** — Contact messages, newsletter subscriptions, cooking reels, user favorites tables and policies.

---

## ⚡ Deployment on Vercel

### 1. Environment Variables in Vercel
When deploying to Vercel, navigate to **Project Settings > Environment Variables** and add:

| Key | Value | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Public anon API key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | Service role key for admin operations |

### 2. Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

---

## 🎨 Key Features

- **Recipe Discovery**: Filtering by categories, difficulty, search, and sorting (popular, newest, rating, prep time).
- **Web Share & Print**: Web Share API integration with clipboard fallback and custom `@media print` print styling.
- **Interactive Store**: Equipment, spices, and books store with cart management.
- **Admin Dashboard**: Manage recipes, categories, cooking reels, products, and review moderation (`/admin`).
- **Multilingual UI**: Arabic (RTL default), French, and English language switching.
- **PWA & Mobile First**: Fully responsive across mobile screens and high-resolution desktop displays.

---

## 🛠️ License & Credits
Developed for **Chef Nour**. All rights reserved.
