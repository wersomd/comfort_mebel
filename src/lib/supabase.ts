import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    'Supabase env переменные не заданы. Создайте .env.local с VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const PRODUCT_BUCKET = 'product-images';
