# Comfort Mebel — Редизайн + Админка + Excel + PDF

**Дата:** 2026-05-20  
**Стек:** React 18, Vite, Tailwind v4, React Router 7, shadcn/ui, Radix UI

---

## 1. Архитектура

### Хранилище данных
- **localStorage** как единственное хранилище (клиентская сторона, без сервера)
- Абстракция через `src/lib/store.ts` — функции `getProducts()`, `saveProducts()`, `getCategories()`, `saveCategories()`
- При первом запуске — сид с демо-данными (20 товаров)
- Ключи: `comfort_products`, `comfort_categories`

### Маршруты (React Router)
```
/                    → HomePage (Hero + каталог превью)
/catalog             → CatalogPage (полный каталог с фильтрами)
/product/:id         → ProductPage (детальная страница)
/admin               → AdminLoginPage (пароль: env var VITE_ADMIN_PASSWORD, default: "admin123")
/admin/dashboard     → AdminDashboard
/admin/products      → AdminProducts (таблица + CRUD)
/admin/products/new  → AdminProductForm
/admin/products/:id  → AdminProductForm (редактирование)
/admin/categories    → AdminCategories
/admin/import        → AdminImport (Excel)
```

### Зависимости (новые)
- `xlsx` — SheetJS для Excel импорта/экспорта
- `@react-pdf/renderer` — генерация PDF каталога
- `react-router` — уже есть v7.13.0
- `playfair-display` — Google Fonts (через CSS @import)

---

## 2. Дизайн-система (boca.su вдохновение)

### Цвета
```css
--brand-dark:    #3B2419;   /* тёмно-коричневый (из логотипа) */
--brand-cream:   #EDE0D4;   /* кремовый (из логотипа) */
--brand-light:   #F8F4EF;   /* светло-кремовый фон */
--brand-mid:     #C4A882;   /* средний тёплый */
--text-primary:  #1A0F0A;   /* почти чёрный тёплый */
--text-muted:    #7A6458;   /* приглушённый коричневый */
--border:        #E8DDD4;   /* тёплый бордер */
```

### Типографика
- **Заголовки:** Playfair Display (serif, Google Fonts)
- **Текст:** Inter (sans-serif, уже часть системы)
- H1: 64px / weight 400 / Playfair Display
- H2: 40px / weight 400 / Playfair Display
- Body: 15px / weight 400 / Inter
- Label/caption: 11px / weight 500 / Inter / letter-spacing 1.5px / uppercase

### Компоненты
- **Header:** sticky, прозрачный → белый при скролле, логотип SVG, навигация по категориям
- **Hero:** full-viewport, большое изображение с текстом поверх, кнопка "Смотреть каталог"
- **ProductCard:** квадратное изображение (aspect-square), hover → тёмный оверлей с кнопками
- **ProductGrid:** 4 колонки на desktop, 2 на tablet, 1 на mobile
- **FilterBar:** sticky, горизонтальные теги категорий + select сортировки
- **Footer:** минималистичный, логотип + контакты

---

## 3. Публичная часть

### HomePage (`/`)
- Hero секция: full-viewport, фоновое фото, текст "Comfort — Мебель для жизни", кнопка
- Популярные товары: 8 карточек (badge popular)
- Новинки: 4 карточки (badge new)
- Кнопка "Скачать каталог PDF" — генерирует PDF через @react-pdf/renderer

### CatalogPage (`/catalog`)
- Фильтры: категории (теги), сортировка, поиск, цена (min/max)
- Пагинация: 24 товара на странице
- Кнопка "Скачать каталог PDF"

### ProductPage (`/product/:id`)
- Большое фото + галерея (если несколько)
- Характеристики: материал, цвет, размер, артикул
- Кнопка "В корзину" (корзина — в localStorage)
- Кнопка "Консультация" (модал с формой)

### PDF Каталог
- Генерируется из текущих товаров с учётом активных фильтров (или всех)
- Страница: A4, логотип вверху, товары 2×3 на страницу
- Поля: фото, название, артикул, цена, материал, размер

---

## 4. Админ-панель (`/admin/*`)

### Авторизация
- Простая: форма с паролем, пароль сравнивается с `VITE_ADMIN_PASSWORD` (env)
- Сессия хранится в `sessionStorage`

### AdminProducts
- Таблица: артикул, название, категория, цена, наличие, действия
- Поиск/фильтр по категории
- Кнопки: Добавить, Редактировать, Удалить
- Массовое удаление (чекбоксы)

### AdminProductForm
- Поля: артикул*, название*, категория*, цена*, описание, материал, цвет, размер, URL изображения, наличие (toggle)
- Badge: новинка / популярное
- Валидация: обязательные поля отмечены *

### AdminCategories
- Список категорий: иконка (emoji), название, slug, порядок
- Inline редактирование названия
- Drag-and-drop порядок (react-dnd уже есть)

### AdminImport (`/admin/import`)
- Drag-and-drop зона для .xlsx / .xls файла
- Предпросмотр первых 10 строк перед импортом
- Mapping колонок: если названия не совпадают — пользователь выбирает что есть что
- Режим: "Добавить к существующим" или "Заменить всё"
- После импорта — сводка: добавлено X, обновлено Y, пропущено Z

**Ожидаемый формат Excel:**
| Артикул | Название | Категория | Цена | Описание | Материал | Цвет | Размер | Изображение | Наличие |
|---------|----------|-----------|------|----------|----------|------|--------|-------------|---------|
| CM-001  | Диван Модерн | Диваны | 485000 | ... | Велюр | Серый | 240×95×85 | https://... | 1 |

---

## 5. Данные

### Тип Product (расширенный)
```typescript
interface Product {
  id: string;           // UUID
  sku: string;          // артикул
  name: string;
  category: string;     // slug категории
  price: number;        // в тенге
  oldPrice?: number;
  description: string;
  images: string[];     // массив URL (первый — главное фото)
  material?: string;
  color?: string;
  dimensions?: string;
  inStock: boolean;
  badges: ('new' | 'popular')[];
  createdAt: string;    // ISO date
  updatedAt: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;         // "Диваны"
  emoji?: string;       // "🛋️"
  order: number;
}
```

---

## 6. Что НЕ входит в скоуп
- Настоящий бэкенд / база данных
- Система заказов (только корзина в localStorage)
- Авторизация пользователей
- Загрузка изображений на сервер (только URL)
- SEO / SSR
