-- ============================================================================
-- Comfort Mebel — seed data
-- Прогнать ПОСЛЕ 0001_init.sql, тоже в SQL Editor.
-- Безопасно прогонять повторно — используются ON CONFLICT DO UPDATE.
-- ============================================================================

-- ── Categories ──────────────────────────────────────────────────────────────
insert into public.categories (id, slug, name, emoji, "order", special) values
  ('cat-sale', 'aktsii',  'Акции',     '🏷️', 0, 'sale'),
  ('cat-1',    'divany',  'Диваны',    '🛋️', 1, null),
  ('cat-2',    'kresla',  'Кресла',    '🪑', 2, null),
  ('cat-3',    'krovati', 'Кровати',   '🛏️', 3, null),
  ('cat-4',    'stoly',   'Столы',     '🪵', 4, null),
  ('cat-5',    'shkafy',  'Шкафы',     '🗄️', 5, null),
  ('cat-6',    'tumby',   'Тумбы',     '📦', 6, null),
  ('cat-7',    'polki',   'Полки',     '📚', 7, null),
  ('cat-8',    'office',  'Офисная',   '💼', 8, null)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  emoji = excluded.emoji,
  "order" = excluded."order",
  special = excluded.special;

-- ── Products ────────────────────────────────────────────────────────────────
insert into public.products (id, sku, name, category, price, description, images, material, color, dimensions, badges) values
  ('p-1',  'CM-001', 'Марсель',      'divany',  485000, 'Элегантный трёхместный диван с мягкой обивкой из премиального велюра и ортопедическим наполнением.', array['https://images.unsplash.com/photo-1684261556324-a09b2cdf68b1?w=1200'], 'Велюр премиум',     'Серый',             '240×95×85 см', array['new']),
  ('p-2',  'CM-002', 'Ривьера',      'divany',  650000, 'Угловой диван премиум-класса с натуральной кожаной обивкой и панорамным дизайном.',                array['https://images.unsplash.com/photo-1778731525372-0ec34ead8d08?w=1200'], 'Натуральная кожа',  'Бежевый',           '280×100×90 см', array['popular']),
  ('p-3',  'CM-003', 'Лофт',         'divany',  390000, 'Современный диван в индустриальном стиле с текстильной обивкой и металлическими акцентами.',       array['https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?w=1200'], 'Текстиль',          'Тёмно-синий',       '220×90×80 см',  array[]::text[]),
  ('p-4',  'CM-004', 'Классик',      'divany',  520000, 'Классический диван с элегантными формами и роскошной бархатной обивкой.',                          array['https://images.unsplash.com/photo-1762803841422-5b8cf8767cd9?w=1200'], 'Велюр премиум',     'Белый',             '250×95×85 см',  array['popular']),
  ('p-5',  'CM-005', 'Скандинавия',  'stoly',   185000, 'Обеденный стол из цельного массива дуба в скандинавском минимализме.',                             array['https://images.unsplash.com/photo-1758977404683-d04c315a005b?w=1200'], 'Массив дуба',       'Натуральный',       '180×90×75 см',  array['new']),
  ('p-6',  'CM-006', 'Модерн',       'stoly',   220000, 'Современный обеденный стол с комплектом мягких стульев премиум-класса.',                           array['https://images.unsplash.com/photo-1758977403826-01e2c8a3f68f?w=1200'], 'Массив дуба',       'Тёмный орех',       '200×100×76 см', array['popular']),
  ('p-7',  'CM-007', 'Комфорт',      'kresla',   95000, 'Мягкое кресло с высокой анатомической спинкой и велюровой обивкой.',                               array['https://images.unsplash.com/photo-1763656070600-b67cd4f2908a?w=1200'], 'Велюр премиум',     'Красный',           '75×80×95 см',   array['new']),
  ('p-8',  'CM-008', 'Лаунж',        'kresla',  125000, 'Дизайнерское кресло с кожаной обивкой для эксклюзивной зоны отдыха.',                              array['https://images.unsplash.com/photo-1772665762866-8dcfff65b3f3?w=1200'], 'Натуральная кожа',  'Чёрный',            '80×85×100 см',  array['popular']),
  ('p-9',  'CM-009', 'Минимал',      'shkafy',  285000, 'Встроенный шкаф в минималистичной эстетике с бесшумными механизмами.',                             array['https://images.unsplash.com/photo-1765277789183-a08a084312bf?w=1200'], 'МДФ премиум',       'Белый',             '200×60×220 см', array['new']),
  ('p-10', 'CM-010', 'Люкс',         'shkafy',  420000, 'Премиальный шкаф из массива дуба с продуманной системой хранения.',                                array['https://images.unsplash.com/photo-1765766600589-ddad380d6534?w=1200'], 'Массив дуба',       'Тёмное дерево',     '250×65×230 см', array['popular']),
  ('p-11', 'CM-011', 'Престиж',      'krovati', 395000, 'Двуспальная кровать с каретной стяжкой и мягким изголовьем из велюра.',                            array['https://images.unsplash.com/photo-1768946131535-b90bad125f16?w=1200'], 'Велюр премиум',     'Серый',             '180×200 см',    array['new']),
  ('p-12', 'CM-012', 'Элит',         'krovati', 520000, 'Королевская кровать с кожаным изголовьем и ортопедическим основанием.',                            array['https://images.unsplash.com/photo-1583221742001-9ad88bf233ff?w=1200'], 'Натуральная кожа',  'Бежевый',           '200×200 см',    array['popular']),
  ('p-13', 'CM-013', 'Библиотека',   'polki',    95000, 'Книжная полка из массива с открытыми полками и элегантной отделкой.',                              array['https://images.unsplash.com/photo-1771741975426-9775ed602cfe?w=1200'], 'Массив дерева',     'Натуральное дерево','180×30×200 см', array['popular']),
  ('p-14', 'CM-014', 'Директор',     'office',  185000, 'Представительский письменный стол с выдвижными ящиками и кожаной вставкой.',                       array['https://images.unsplash.com/photo-1772761482020-3cea792b5de7?w=1200'], 'Массив дерева',     'Тёмное дерево',     '160×80×75 см',  array['new']),
  ('p-15', 'CM-015', 'Кубик',        'tumby',    45000, 'Яркая дизайнерская прикроватная тумба геометричной формы.',                                        array['https://images.unsplash.com/photo-1752061143360-623e42941ab4?w=1200'], 'МДФ премиум',       'Оранжевый',         '40×40×40 см',   array[]::text[])
on conflict (id) do update set
  sku = excluded.sku,
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  description = excluded.description,
  images = excluded.images,
  material = excluded.material,
  color = excluded.color,
  dimensions = excluded.dimensions,
  badges = excluded.badges;
