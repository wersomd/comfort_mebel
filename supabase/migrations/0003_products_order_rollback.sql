-- ============================================================================
-- ОТКАТ миграции 0003_products_order.sql
-- Прогнать ОДИН РАЗ в Supabase Dashboard → SQL Editor → New query → Run.
--
-- Безопасно: удаляется ТОЛЬКО колонка `order` и её индекс.
-- Все товары, их цены, фото, описания, заявки — НЕ затрагиваются.
-- ============================================================================

drop index if exists public.products_order_idx;
alter table public.products drop column if exists "order";
