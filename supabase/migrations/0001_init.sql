-- ============================================================================
-- Comfort Mebel — initial schema
-- Прогнать ОДИН РАЗ в Supabase Dashboard → SQL Editor → New query → Run.
-- ============================================================================

-- ── Categories ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          text primary key,
  slug        text not null unique,
  name        text not null,
  emoji       text,
  image       text,
  background  text,
  "order"     int  not null default 0,
  parent_id   text references public.categories(id) on delete set null,
  special     text,                     -- 'sale' или null
  created_at  timestamptz not null default now()
);

create index if not exists categories_parent_idx on public.categories(parent_id);
create index if not exists categories_order_idx  on public.categories("order");

-- ── Products ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id           text primary key,
  sku          text not null,
  name         text not null,
  category     text references public.categories(slug) on delete set null,
  price        int  not null,
  old_price    int,
  description  text not null default '',
  images       text[] not null default '{}',
  material     text,
  color        text,
  dimensions   text,
  badges       text[] not null default '{}',     -- 'new' | 'popular' | 'sale'
  related_ids  text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_sku_idx      on public.products(sku);

-- Авто-обновление updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ── Leads (заявки) ──────────────────────────────────────────────────────────
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  type          text not null,                   -- 'consult' | 'checkout'
  name          text not null,
  phone         text not null,
  message       text,
  product_name  text,
  address       text,
  cart          jsonb,                            -- массив { name, qty, price } для checkout
  total         int,
  discount      int default 0,
  status        text not null default 'new',     -- 'new' | 'in_progress' | 'done'
  created_at    timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads(created_at desc);
create index if not exists leads_status_idx  on public.leads(status);

-- ============================================================================
-- Row Level Security
-- Публичные read'ы для каталога; писать может только authenticated.
-- Заявки: insert разрешён всем (форма на сайте), read/update — только authenticated.
-- ============================================================================

alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.leads      enable row level security;

-- CATEGORIES
drop policy if exists "categories read"  on public.categories;
drop policy if exists "categories write" on public.categories;
create policy "categories read"  on public.categories for select using (true);
create policy "categories write" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- PRODUCTS
drop policy if exists "products read"  on public.products;
drop policy if exists "products write" on public.products;
create policy "products read"  on public.products for select using (true);
create policy "products write" on public.products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- LEADS
drop policy if exists "leads insert public"   on public.leads;
drop policy if exists "leads read auth"       on public.leads;
drop policy if exists "leads update auth"     on public.leads;
drop policy if exists "leads delete auth"     on public.leads;
create policy "leads insert public" on public.leads for insert with check (true);
create policy "leads read auth"     on public.leads for select using (auth.role() = 'authenticated');
create policy "leads update auth"   on public.leads for update using (auth.role() = 'authenticated');
create policy "leads delete auth"   on public.leads for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- Storage — bucket для фото товаров
-- Создаём bucket (public read) + политики.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images read"   on storage.objects;
drop policy if exists "product images insert" on storage.objects;
drop policy if exists "product images update" on storage.objects;
drop policy if exists "product images delete" on storage.objects;

create policy "product images read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product images insert" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and auth.role() = 'authenticated'
  );

create policy "product images update" on storage.objects
  for update using (
    bucket_id = 'product-images' and auth.role() = 'authenticated'
  );

create policy "product images delete" on storage.objects
  for delete using (
    bucket_id = 'product-images' and auth.role() = 'authenticated'
  );
