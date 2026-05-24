import type { Product, Category } from '../types';

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-sale', slug: 'aktsii', name: 'Акции', emoji: '🏷️', order: 0, special: 'sale' },
  { id: 'cat-1', slug: 'divany', name: 'Диваны', emoji: '🛋️', order: 1 },
  { id: 'cat-2', slug: 'kresla', name: 'Кресла', emoji: '🪑', order: 2 },
  { id: 'cat-3', slug: 'krovati', name: 'Кровати', emoji: '🛏️', order: 3 },
  { id: 'cat-4', slug: 'stoly', name: 'Столы', emoji: '🪵', order: 4 },
  { id: 'cat-5', slug: 'shkafy', name: 'Шкафы', emoji: '🗄️', order: 5 },
  { id: 'cat-6', slug: 'tumby', name: 'Тумбы', emoji: '📦', order: 6 },
  { id: 'cat-7', slug: 'polki', name: 'Полки', emoji: '📚', order: 7 },
  { id: 'cat-8', slug: 'office', name: 'Офисная', emoji: '💼', order: 8 },
];

const now = new Date().toISOString();

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p-1', sku: 'CM-001', name: 'Марсель', category: 'divany',
    price: 485000, description: 'Элегантный трёхместный диван с мягкой обивкой из премиального велюра и ортопедическим наполнением.',
    images: ['https://images.unsplash.com/photo-1684261556324-a09b2cdf68b1?w=1200'],
    material: 'Велюр премиум', color: 'Серый', dimensions: '240×95×85 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-2', sku: 'CM-002', name: 'Ривьера', category: 'divany',
    price: 650000, description: 'Угловой диван премиум-класса с натуральной кожаной обивкой и панорамным дизайном.',
    images: ['https://images.unsplash.com/photo-1778731525372-0ec34ead8d08?w=1200'],
    material: 'Натуральная кожа', color: 'Бежевый', dimensions: '280×100×90 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-3', sku: 'CM-003', name: 'Лофт', category: 'divany',
    price: 390000, description: 'Современный диван в индустриальном стиле с текстильной обивкой и металлическими акцентами.',
    images: ['https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?w=1200'],
    material: 'Текстиль', color: 'Тёмно-синий', dimensions: '220×90×80 см',
    inStock: true, badges: [], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-4', sku: 'CM-004', name: 'Классик', category: 'divany',
    price: 520000, description: 'Классический диван с элегантными формами и роскошной бархатной обивкой.',
    images: ['https://images.unsplash.com/photo-1762803841422-5b8cf8767cd9?w=1200'],
    material: 'Велюр премиум', color: 'Белый', dimensions: '250×95×85 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-5', sku: 'CM-005', name: 'Скандинавия', category: 'stoly',
    price: 185000, description: 'Обеденный стол из цельного массива дуба в скандинавском минимализме.',
    images: ['https://images.unsplash.com/photo-1758977404683-d04c315a005b?w=1200'],
    material: 'Массив дуба', color: 'Натуральный', dimensions: '180×90×75 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-6', sku: 'CM-006', name: 'Модерн', category: 'stoly',
    price: 220000, description: 'Современный обеденный стол с комплектом мягких стульев премиум-класса.',
    images: ['https://images.unsplash.com/photo-1758977403826-01e2c8a3f68f?w=1200'],
    material: 'Массив дуба', color: 'Тёмный орех', dimensions: '200×100×76 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-7', sku: 'CM-007', name: 'Комфорт', category: 'kresla',
    price: 95000, description: 'Мягкое кресло с высокой анатомической спинкой и велюровой обивкой.',
    images: ['https://images.unsplash.com/photo-1763656070600-b67cd4f2908a?w=1200'],
    material: 'Велюр премиум', color: 'Красный', dimensions: '75×80×95 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-8', sku: 'CM-008', name: 'Лаунж', category: 'kresla',
    price: 125000, description: 'Дизайнерское кресло с кожаной обивкой для эксклюзивной зоны отдыха.',
    images: ['https://images.unsplash.com/photo-1772665762866-8dcfff65b3f3?w=1200'],
    material: 'Натуральная кожа', color: 'Чёрный', dimensions: '80×85×100 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-9', sku: 'CM-009', name: 'Минимал', category: 'shkafy',
    price: 285000, description: 'Встроенный шкаф в минималистичной эстетике с бесшумными механизмами.',
    images: ['https://images.unsplash.com/photo-1765277789183-a08a084312bf?w=1200'],
    material: 'МДФ премиум', color: 'Белый', dimensions: '200×60×220 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-10', sku: 'CM-010', name: 'Люкс', category: 'shkafy',
    price: 420000, description: 'Премиальный шкаф из массива дуба с продуманной системой хранения.',
    images: ['https://images.unsplash.com/photo-1765766600589-ddad380d6534?w=1200'],
    material: 'Массив дуба', color: 'Тёмное дерево', dimensions: '250×65×230 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-11', sku: 'CM-011', name: 'Престиж', category: 'krovati',
    price: 395000, description: 'Двуспальная кровать с каретной стяжкой и мягким изголовьем из велюра.',
    images: ['https://images.unsplash.com/photo-1768946131535-b90bad125f16?w=1200'],
    material: 'Велюр премиум', color: 'Серый', dimensions: '180×200 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-12', sku: 'CM-012', name: 'Элит', category: 'krovati',
    price: 520000, description: 'Королевская кровать с кожаным изголовьем и ортопедическим основанием.',
    images: ['https://images.unsplash.com/photo-1583221742001-9ad88bf233ff?w=1200'],
    material: 'Натуральная кожа', color: 'Бежевый', dimensions: '200×200 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-13', sku: 'CM-013', name: 'Библиотека', category: 'polki',
    price: 95000, description: 'Книжная полка из массива с открытыми полками и элегантной отделкой.',
    images: ['https://images.unsplash.com/photo-1771741975426-9775ed602cfe?w=1200'],
    material: 'Массив дерева', color: 'Натуральное дерево', dimensions: '180×30×200 см',
    inStock: true, badges: ['popular'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-14', sku: 'CM-014', name: 'Директор', category: 'office',
    price: 185000, description: 'Представительский письменный стол с выдвижными ящиками и кожаной вставкой.',
    images: ['https://images.unsplash.com/photo-1772761482020-3cea792b5de7?w=1200'],
    material: 'Массив дерева', color: 'Тёмное дерево', dimensions: '160×80×75 см',
    inStock: true, badges: ['new'], createdAt: now, updatedAt: now,
  },
  {
    id: 'p-15', sku: 'CM-015', name: 'Кубик', category: 'tumby',
    price: 45000, description: 'Яркая дизайнерская прикроватная тумба геометричной формы.',
    images: ['https://images.unsplash.com/photo-1752061143360-623e42941ab4?w=1200'],
    material: 'МДФ премиум', color: 'Оранжевый', dimensions: '40×40×40 см',
    inStock: true, badges: [], createdAt: now, updatedAt: now,
  },
];
