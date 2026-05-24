Build a full mobile-first React furniture catalog app for "Comfort jihaz uii" — a premium furniture showroom. 
Use only React with useState/useMemo hooks and inline styles. No external libraries except Google Fonts.

---

FONTS (import via @import in a style tag or global CSS):
- Cormorant Garamond (300, 400, 600) — for headings and product names
- Jost (300, 400, 500, 600) — for UI, prices, labels

---

COLOR PALETTE (use CSS variables):
--cream: #F7F4EF
--warm-white: #FDFBF8
--charcoal: #1C1C1A
--muted: #8A8780
--border: #E5E1DA
--accent: #C4873A
--green: #2D6A4F
--red: #B5451B

---

PRODUCT DATA STRUCTURE:
Each product has: id, name, category, price (number, in KZT tenge), badge ("new" | "popular" | null), 
material, color, size, img (unsplash URL), desc.

Categories: divany (Диваны), stoly (Столы), kresla (Кресла), shkaf (Шкафы), 
krovati (Кровати), tumby (Тумбы), polki (Полки), office (Офисная мебель).

Create 20 realistic products across all categories with Unsplash image URLs.
Format prices as: "485 000 ₸" (ru-RU locale).

---

APP STRUCTURE — 3 views (controlled by activeView state: "catalog" | "cart" | "favorites"):

1. HEADER (sticky, no-print):
   - Left: logo "Comfort" in Cormorant Garamond italic + subtitle "мебельный салон"
   - Center (desktop only): horizontal category pills
   - Right: icon buttons for Favorites (heart + count badge), Cart (bag + count badge), Print button
   - On mobile: hamburger opens a bottom drawer with category list

2. FILTER BAR (no-print):
   - Search input (searches name + desc)
   - Category filter (horizontal scroll pills on mobile, matches header selection)
   - Sort dropdown: По умолчанию | Цена ↑ | Цена ↓ | Новинки | Популярные
   - Price range: two number inputs (min / max)
   - Active filter chips showing current filters with × remove button
   - Result count: "Найдено товаров: N"

3. PRODUCT GRID (catalog view):
   - Mobile: 2 columns
   - Tablet (≥768px): 3 columns
   - Desktop (≥1200px): 4 columns
   - Each card has:
     * Product image (aspect ratio 3:4, object-fit: cover, lazy loading)
     * Badge chips top-left: "Новинка" (green) and/or "Популярное" (amber)
     * Heart icon top-right (toggle favorite, filled = saved)
     * Product name in Cormorant Garamond
     * Category label in muted color
     * Material + Size info
     * Price in bold accent color
     * "В корзину" button — on click shows quantity selector (+/-)
     * Subtle hover: translateY(-4px) + deeper shadow
     * fadeUp animation on mount with staggered delay by index

4. CART VIEW (activeView === "cart"):
   - List of cart items with image thumbnail, name, price, quantity +/- controls, remove button
   - Order summary card: subtotal, delivery (free above 500,000 ₸, else 15,000 ₸), total
   - "Оформить заказ" CTA button (amber, full width)
   - "Продолжить покупки" link back to catalog
   - Empty state with icon and message

5. FAVORITES VIEW (activeView === "favorites"):
   - Same 2/3/4 column grid as catalog but only favorited items
   - Each card has "Убрать из избранного" button
   - "Добавить в корзину" button
   - Empty state with heart icon and message

6. PRODUCT DETAIL MODAL:
   - Opens on card click (not on button clicks)
   - Full-screen overlay on mobile, centered modal (max-width 900px) on desktop
   - Left: large image
   - Right: name, category, price, material, color, size, description
   - Quantity selector
   - "В корзину" + "В избранное" buttons
   - Close button (×)

---

FILTER LOGIC (useMemo):
const filtered = useMemo(() => {
  let result = PRODUCTS;
  if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
  if (search.trim()) result = result.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );
  if (priceMin) result = result.filter(p => p.price >= Number(priceMin));
  if (priceMax) result = result.filter(p => p.price <= Number(priceMax));
  if (sort === "price_asc")  result = [...result].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") result = [...result].sort((a, b) => b.price - a.price);
  if (sort === "new")        result = result.filter(p => p.badge === "new");
  if (sort === "popular")    result = result.filter(p => p.popular);
  return result;
}, [activeCategory, search, priceMin, priceMax, sort]);

---

CART LOGIC:
- cart state: array of { ...product, qty: number }
- addToCart(product): if exists → qty++, else push with qty:1
- removeFromCart(id): filter out
- updateQty(id, delta): qty + delta, remove if qty reaches 0
- cartTotal: sum of price * qty
- cartCount: sum of qty

---

FAVORITES LOGIC:
- favorites state: Set of product ids (use array for useState)
- toggleFavorite(id): add or remove from set
- isFavorite(id): favorites.includes(id)

---

PRINT FEATURE:
- "Печать каталога" button calls window.print()
- Add @media print CSS rules:
  * Hide header, filter bar, buttons (.no-print { display: none })
  * Show all 20 products regardless of filters
  * 3-column grid layout for print
  * Each card: image, name, price, size, material — clean minimal style
  * Company name "Comfort jihaz uii — Мебельный салон премиум класса" as print header
  * Page: A4, margins 15mm

---

MOBILE UX DETAILS:
- Sticky bottom navigation bar (mobile only, no-print):
  * 3 tabs: Каталог (grid icon) | Избранное (heart + count) | Корзина (bag + count)
  * Active tab highlighted in charcoal
- Category drawer: slides up from bottom on mobile when filter icon tapped
- All touch targets minimum 44×44px
- Search bar full-width on mobile

---

ANIMATIONS:
@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
@keyframes slideUp { from { opacity:0; transform:translateY(100%) } to { opacity:1; transform:translateY(0) } }
@keyframes slideIn { from { opacity:0; transform:translateX(100%) } to { opacity:1; transform:translateX(0) } }

Cards: animation: fadeUp 0.35s ease both; animation-delay: index * 40ms (max 400ms)
Panels/drawers: slideUp or slideIn

---

EMPTY STATES:
- No filter results: large icon + "Товары не найдены" + "Сбросить фильтры" button
- Empty cart: shopping bag icon + "Корзина пуста" + "Перейти в каталог" button  
- Empty favorites: heart icon + "Нет избранных товаров" + "Перейти в каталог" button

---

DESIGN RULES:
- Luxury-minimal aesthetic: generous whitespace, refined typography, subtle shadows
- No external UI libraries, no Tailwind
- All styles via inline style objects or injected <style> tag
- Fully responsive: mobile 320px → desktop 1440px
- Default export: function App()