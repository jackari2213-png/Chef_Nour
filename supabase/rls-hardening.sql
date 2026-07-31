-- ============================================================================
-- Chef Nour — RLS Hardening Migration
-- Run this in Supabase SQL Editor (once).
--
-- Fixes:
--   1. Anyone could INSERT/UPDATE/DELETE recipes, reviews, ingredients, steps
--   2. orders table had RLS disabled (anyone could read/write all orders)
--   3. profiles had no INSERT policy (signup auto-profile creation failed)
--   4. Category/Product writes were blocked for admins (no write policies)
--
-- New model:
--   - Public reads stay open (recipes, categories, products, site_settings...)
--   - ALL writes are restricted to admins via a security-definer is_admin()
--   - Guest review comments may still be inserted (core feature)
--   - Orders: users see/insert their own; admins see/manage all
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Admin helper (bypasses RLS; safe: only checks the caller's own profile)
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to public;

-- ----------------------------------------------------------------------------
-- 2. Drop the dangerous "anyone can write" policies
-- ----------------------------------------------------------------------------
drop policy if exists "Anyone can insert recipes" on public.recipes;
drop policy if exists "Anyone can update recipes" on public.recipes;
drop policy if exists "Anyone can delete recipes" on public.recipes;

drop policy if exists "Anyone can insert ingredients" on public.ingredients;
drop policy if exists "Anyone can insert steps" on public.steps;

drop policy if exists "Anyone can insert review" on public.reviews;
drop policy if exists "Anyone can update reviews" on public.reviews;
drop policy if exists "Anyone can delete reviews" on public.reviews;
drop policy if exists "Authenticated users can post reviews" on public.reviews;

drop policy if exists "Admin can update site_settings" on public.site_settings;

-- ----------------------------------------------------------------------------
-- 3. profiles — allow users to create their own profile row on signup
-- ----------------------------------------------------------------------------
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to public
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 4. recipes — writes are admin-only (reads stay public)
-- ----------------------------------------------------------------------------
create policy "Admin can insert recipes"
  on public.recipes
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update recipes"
  on public.recipes
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete recipes"
  on public.recipes
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. ingredients / steps — writes are admin-only (reads stay public)
-- ----------------------------------------------------------------------------
create policy "Admin can insert ingredients"
  on public.ingredients
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update ingredients"
  on public.ingredients
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete ingredients"
  on public.ingredients
  for delete
  to public
  using (public.is_admin());

create policy "Admin can insert steps"
  on public.steps
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update steps"
  on public.steps
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete steps"
  on public.steps
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. reviews — anyone may comment (guest comments are a core feature);
--    update/delete are admin-only; users can delete their own reviews
-- ----------------------------------------------------------------------------
create policy "Anyone can post review comments"
  on public.reviews
  for insert
  to public
  with check (true);

create policy "Admin can update reviews"
  on public.reviews
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins or authors can delete reviews"
  on public.reviews
  for delete
  to public
  using (public.is_admin() or auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 7. categories — reads stay public, writes admin-only (fixes broken admin CRUD)
-- ----------------------------------------------------------------------------
create policy "Admin can insert categories"
  on public.categories
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update categories"
  on public.categories
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete categories"
  on public.categories
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. products — reads stay public, writes admin-only
-- ----------------------------------------------------------------------------
create policy "Admin can insert products"
  on public.products
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update products"
  on public.products
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete products"
  on public.products
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 9. site_settings — reads stay public, writes admin-only
-- ----------------------------------------------------------------------------
create policy "Admin can update site_settings"
  on public.site_settings
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 10. cooking_reels — reads stay public, writes admin-only
-- ----------------------------------------------------------------------------
create policy "Admin can insert cooking_reels"
  on public.cooking_reels
  for insert
  to public
  with check (public.is_admin());

create policy "Admin can update cooking_reels"
  on public.cooking_reels
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete cooking_reels"
  on public.cooking_reels
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 11. newsletter_subscriptions — anyone may subscribe, only admins read
-- ----------------------------------------------------------------------------
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscriptions
  for insert
  to public
  with check (true);

create policy "Admins can read newsletter subscriptions"
  on public.newsletter_subscriptions
  for select
  to public
  using (public.is_admin());

create policy "Admins can delete newsletter subscriptions"
  on public.newsletter_subscriptions
  for delete
  to public
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 12. orders — ENABLE RLS + users own their rows, admins manage all
-- ----------------------------------------------------------------------------
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders
  for select
  to public
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own orders"
  on public.orders
  for insert
  to public
  with check (auth.uid() = user_id or public.is_admin());

create policy "Admins can update orders"
  on public.orders
  for update
  to public
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete orders"
  on public.orders
  for delete
  to public
  using (public.is_admin());

-- ============================================================================
-- 13. Rating recalculation through a safe security-definer function.
--     The app calls recalc_recipe_rating() instead of directly updating
--     recipes, so non-admins can no longer spoof rating fields.
-- ============================================================================
create or replace function public.recalc_recipe_rating(p_recipe_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_avg numeric;
  v_count integer;
begin
  select coalesce(avg(rating), 0)::numeric, count(rating)
    into v_avg, v_count
  from public.reviews
  where recipe_id = p_recipe_id
    and rating is not null
    and rating > 0
    and moderation_status = 'approved';

  update public.recipes
     set rating_avg = round(coalesce(v_avg, 0), 2),
         rating_count = coalesce(v_count, 0)
   where id = p_recipe_id;
end;
$$;

grant execute on function public.recalc_recipe_rating(uuid) to public;
