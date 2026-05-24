# Comfort Mebel

E-commerce витрина мебельного салона.
React 18 + Vite + Tailwind v4 + Supabase.

## Локальный запуск

```bash
pnpm install
cp .env.example .env.local   # вписать VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
pnpm dev                     # → http://localhost:5173
```

## Сборка

```bash
pnpm build       # → dist/
pnpm preview     # локальный просмотр прод-сборки
```

## База данных

Supabase. Миграция и сиды лежат в `supabase/`:

- `supabase/migrations/0001_init.sql` — схема + RLS + storage bucket
- `supabase/seed.sql` — начальные категории и товары

Прогон: Supabase Dashboard → SQL Editor → вставить файл → Run.

## Деплой

Vercel — авто-деплой при push в `main`. SPA rewrites — в `vercel.json`.
В Vercel Project Settings → Environment Variables прописать:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Админка

`/admin` — вход по email/паролю через Supabase Auth.
Пользователей создавать в Supabase Dashboard → Authentication → Users.
