import { useState, useMemo } from 'react';

// ============================================================================
// TYPES & DATA
// ============================================================================

type Category = 'divany' | 'stoly' | 'kresla' | 'shkaf' | 'krovati' | 'tumby' | 'polki' | 'office';
type Badge = 'new' | 'popular' | null;
type SortType = 'default' | 'price_asc' | 'price_desc' | 'new' | 'popular';

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  badge: Badge;
  material: string;
  color: string;
  size: string;
  img: string;
  desc: string;
  collection?: string;
}

const PRODUCTS: Product[] = [
  // Диваны
  { id: 1, name: 'Марсель', category: 'divany', price: 485000, badge: 'new', material: 'Велюр премиум', color: 'Серый', size: '240×95×85 см', img: 'https://images.unsplash.com/photo-1684261556324-a09b2cdf68b1?w=1200', desc: 'Элегантный трехместный диван с мягкой обивкой из премиального велюра и ортопедическим наполнением', collection: 'MODERN' },
  { id: 2, name: 'Ривьера', category: 'divany', price: 650000, badge: 'popular', material: 'Натуральная кожа', color: 'Бежевый', size: '280×100×90 см', img: 'https://images.unsplash.com/photo-1778731525372-0ec34ead8d08?w=1200', desc: 'Угловой диван премиум класса с натуральной кожаной обивкой и панорамным дизайном', collection: 'LUXE' },
  { id: 3, name: 'Лофт', category: 'divany', price: 390000, badge: null, material: 'Текстиль', color: 'Темно-синий', size: '220×90×80 см', img: 'https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?w=1200', desc: 'Современный диван в индустриальном стиле с текстильной обивкой и металлическими акцентами', collection: 'URBAN' },
  { id: 4, name: 'Классик', category: 'divany', price: 520000, badge: 'popular', material: 'Велюр премиум', color: 'Белый', size: '250×95×85 см', img: 'https://images.unsplash.com/photo-1762803841422-5b8cf8767cd9?w=1200', desc: 'Классический диван с элегантными формами и роскошной бархатной обивкой', collection: 'CLASSIC' },

  // Столы
  { id: 5, name: 'Скандинавия', category: 'stoly', price: 185000, badge: 'new', material: 'Массив дуба', color: 'Натуральный', size: '180×90×75 см', img: 'https://images.unsplash.com/photo-1758977404683-d04c315a005b?w=1200', desc: 'Обеденный стол из цельного массива дуба в скандинавском минимализме', collection: 'NORDIC' },
  { id: 6, name: 'Модерн', category: 'stoly', price: 220000, badge: 'popular', material: 'Массив дуба', color: 'Темный орех', size: '200×100×76 см', img: 'https://images.unsplash.com/photo-1758977403826-01e2c8a3f68f?w=1200', desc: 'Современный обеденный стол с комплектом мягких стульев премиум класса', collection: 'MODERN' },
  { id: 7, name: 'Прованс', category: 'stoly', price: 245000, badge: null, material: 'Массив дерева', color: 'Светлое дерево', size: '220×95×75 см', img: 'https://images.unsplash.com/photo-1758977405163-f2595de08dfe?w=1200', desc: 'Элегантный обеденный стол в стиле прованс с авторскими резными деталями', collection: 'CLASSIC' },

  // Кресла
  { id: 8, name: 'Комфорт', category: 'kresla', price: 95000, badge: 'new', material: 'Велюр премиум', color: 'Красный', size: '75×80×95 см', img: 'https://images.unsplash.com/photo-1763656070600-b67cd4f2908a?w=1200', desc: 'Мягкое кресло с высокой анатомической спинкой и велюровой обивкой', collection: 'MODERN' },
  { id: 9, name: 'Лаунж', category: 'kresla', price: 125000, badge: 'popular', material: 'Натуральная кожа', color: 'Черный', size: '80×85×100 см', img: 'https://images.unsplash.com/photo-1772665762866-8dcfff65b3f3?w=1200', desc: 'Дизайнерское кресло с кожаной обивкой для эксклюзивной зоны отдыха', collection: 'LUXE' },
  { id: 10, name: 'Винтаж', category: 'kresla', price: 110000, badge: null, material: 'Текстиль премиум', color: 'Бежевый', size: '70×75×90 см', img: 'https://images.unsplash.com/photo-1656386080035-494539b16898?w=1200', desc: 'Стильное кресло в винтажной эстетике с мягкими подлокотниками', collection: 'CLASSIC' },

  // Шкафы
  { id: 11, name: 'Минимал', category: 'shkaf', price: 285000, badge: 'new', material: 'МДФ премиум', color: 'Белый', size: '200×60×220 см', img: 'https://images.unsplash.com/photo-1765277789183-a08a084312bf?w=1200', desc: 'Встроенный шкаф в минималистичной эстетике с бесшумными механизмами', collection: 'MODERN' },
  { id: 12, name: 'Люкс', category: 'shkaf', price: 420000, badge: 'popular', material: 'Массив дуба', color: 'Темное дерево', size: '250×65×230 см', img: 'https://images.unsplash.com/photo-1765766600589-ddad380d6534?w=1200', desc: 'Премиальный шкаф из массива дуба с продуманной системой хранения', collection: 'LUXE' },

  // Кровати
  { id: 13, name: 'Престиж', category: 'krovati', price: 395000, badge: 'new', material: 'Велюр премиум', color: 'Серый', size: '180×200 см', img: 'https://images.unsplash.com/photo-1768946131535-b90bad125f16?w=1200', desc: 'Двуспальная кровать с каретной стяжкой и мягким изголовьем из велюра', collection: 'MODERN' },
  { id: 14, name: 'Элит', category: 'krovati', price: 520000, badge: 'popular', material: 'Натуральная кожа', color: 'Бежевый', size: '200×200 см', img: 'https://images.unsplash.com/photo-1583221742001-9ad88bf233ff?w=1200', desc: 'Королевская кровать с кожаным изголовьем и ортопедическим основанием', collection: 'LUXE' },

  // Тумбы
  { id: 15, name: 'Кубик', category: 'tumby', price: 45000, badge: null, material: 'МДФ премиум', color: 'Оранжевый', size: '40×40×40 см', img: 'https://images.unsplash.com/photo-1752061143360-623e42941ab4?w=1200', desc: 'Яркая дизайнерская прикроватная тумба геометричной формы', collection: 'URBAN' },
  { id: 16, name: 'Модерн', category: 'tumby', price: 65000, badge: 'new', material: 'Массив дерева', color: 'Светлое дерево', size: '50×45×55 см', img: 'https://images.unsplash.com/photo-1762856490803-8e200418973a?w=1200', desc: 'Современная прикроватная тумба с бесшумными направляющими', collection: 'NORDIC' },

  // Полки
  { id: 17, name: 'Библиотека', category: 'polki', price: 95000, badge: 'popular', material: 'Массив дерева', color: 'Натуральное дерево', size: '180×30×200 см', img: 'https://images.unsplash.com/photo-1771741975426-9775ed602cfe?w=1200', desc: 'Книжная полка из массива с открытыми полками и элегантной отделкой', collection: 'CLASSIC' },
  { id: 18, name: 'Декор', category: 'polki', price: 125000, badge: null, material: 'Металл и дерево', color: 'Белый/Дерево', size: '200×40×210 см', img: 'https://images.unsplash.com/photo-1778215251079-077e57ec0058?w=1200', desc: 'Декоративный стеллаж с комбинированными материалами в лофт-стиле', collection: 'URBAN' },

  // Офисная мебель
  { id: 19, name: 'Директор', category: 'office', price: 185000, badge: 'new', material: 'Массив дерева', color: 'Темное дерево', size: '160×80×75 см', img: 'https://images.unsplash.com/photo-1772761482020-3cea792b5de7?w=1200', desc: 'Представительский письменный стол с выдвижными ящиками и кожаной вставкой', collection: 'CLASSIC' },
  { id: 20, name: 'Эргономик', category: 'office', price: 145000, badge: 'popular', material: 'МДФ премиум', color: 'Черный/Дерево', size: '140×70×75 см', img: 'https://images.unsplash.com/photo-1603985585179-3d71c35a537c?w=1200', desc: 'Эргономичный рабочий стол с металлическим каркасом и регулировкой высоты', collection: 'MODERN' },
];

const CATEGORIES: Record<Category | 'all', string> = {
  all: 'Все товары',
  divany: 'Диваны',
  stoly: 'Столы',
  kresla: 'Кресла',
  shkaf: 'Шкафы',
  krovati: 'Кровати',
  tumby: 'Тумбы',
  polki: 'Полки',
  office: 'Офисная',
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'cart' | 'favorites'>('catalog');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [cart, setCart] = useState<Array<Product & { qty: number }>>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);

  // Filter logic
  const filtered = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (search.trim()) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      (p.collection && p.collection.toLowerCase().includes(search.toLowerCase()))
    );
    if (priceMin) result = result.filter(p => p.price >= Number(priceMin));
    if (priceMax) result = result.filter(p => p.price <= Number(priceMax));
    if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'new') result = result.filter(p => p.badge === 'new');
    if (sort === 'popular') result = result.filter(p => p.badge === 'popular');
    return result;
  }, [activeCategory, search, priceMin, priceMax, sort]);

  const favoriteProducts = useMemo(() =>
    PRODUCTS.filter(p => favorites.includes(p.id)),
    [favorites]
  );

  // Cart logic
  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const deliveryFee = cartTotal >= 500000 ? 0 : 15000;

  // Favorites logic
  const toggleFavorite = (id: number) => {
    setFavorites(favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    );
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setPriceMin('');
    setPriceMax('');
    setSort('default');
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('ru-RU') + ' ₸';

  const handlePrint = () => window.print();

  return (
    <>
      {/* Global Styles */}
      <style>{`
        :root {
          --black: #000000;
          --white: #FFFFFF;
          --off-white: #FAFAFA;
          --grey-50: #F5F5F5;
          --grey-100: #E8E8E8;
          --grey-400: #A0A0A0;
          --grey-600: #666666;
          --grey-900: #1A1A1A;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          background: var(--white);
          color: var(--black);
          -webkit-font-smoothing: antialiased;
          line-height: 1.5;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      {/* Header */}
      <header className="no-print" style={{
        position: 'sticky',
        top: 0,
        background: 'var(--white)',
        borderBottom: '1px solid var(--grey-100)',
        zIndex: 100,
        padding: '0',
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => { setActiveView('catalog'); setActiveCategory('all'); }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 300,
              letterSpacing: '4px',
              color: 'var(--black)',
            }}>COMFORT</div>
            <div style={{
              fontSize: '9px',
              color: 'var(--grey-600)',
              marginTop: '2px',
              letterSpacing: '2px',
              fontWeight: 400,
            }}>JIHAZ UII</div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'none',
            gap: '40px',
          }} className="desktop-nav">
            {Object.entries(CATEGORIES).slice(1).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setActiveCategory(key as Category); setActiveView('catalog'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeCategory === key ? 500 : 400,
                  color: activeCategory === key ? 'var(--black)' : 'var(--grey-600)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                  padding: '0',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--black)'}
                onMouseLeave={(e) => {
                  if (activeCategory !== key) e.currentTarget.style.color = 'var(--grey-600)';
                }}
              >{label}</button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button onClick={() => setShowConsultModal(true)} style={{
              background: 'none',
              border: '1px solid var(--black)',
              cursor: 'pointer',
              padding: '10px 20px',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: 500,
              display: 'none',
            }} className="desktop-consult">
              Консультация
            </button>

            <button onClick={() => setActiveView('favorites')} style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.length > 0 ? 'var(--black)' : 'none'} stroke="var(--black)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favorites.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--black)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '2px 5px',
                  fontSize: '9px',
                  fontWeight: 600,
                  minWidth: '16px',
                  textAlign: 'center',
                }}>{favorites.length}</span>
              )}
            </button>

            <button onClick={() => setActiveView('cart')} style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--black)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '2px 5px',
                  fontSize: '9px',
                  fontWeight: 600,
                  minWidth: '16px',
                  textAlign: 'center',
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (only on catalog + all categories) */}
      {activeView === 'catalog' && activeCategory === 'all' && (
        <section style={{
          background: 'var(--grey-50)',
          padding: '80px 40px',
          textAlign: 'center',
          borderBottom: '1px solid var(--grey-100)',
        }} className="no-print">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 300,
              letterSpacing: '2px',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>Мебель премиум класса</h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--grey-600)',
              marginBottom: '32px',
              lineHeight: 1.7,
            }}>Никогда не экономили на материалах. Каждая деталь создана с вниманием к качеству и эстетике.</p>
            <button onClick={() => setShowConsultModal(true)} style={{
              background: 'var(--black)',
              color: 'white',
              border: 'none',
              padding: '16px 40px',
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 500,
            }}>Получить консультацию</button>
          </div>
        </section>
      )}

      {/* Search & Filters */}
      {activeView === 'catalog' && (
        <div className="no-print" style={{
          background: 'var(--white)',
          padding: '32px 40px',
          borderBottom: '1px solid var(--grey-100)',
        }}>
          <div style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '16px',
            alignItems: 'center',
          }} className="filter-grid">
            <input
              type="text"
              placeholder="Поиск по названию, коллекции..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '12px 0',
                border: 'none',
                borderBottom: '1px solid var(--grey-100)',
                fontSize: '14px',
                background: 'transparent',
                outline: 'none',
              }}
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--grey-100)',
                fontSize: '12px',
                background: 'var(--white)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="default">По умолчанию</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="new">Новинки</option>
              <option value="popular">Популярные</option>
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="От"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--grey-100)',
                  fontSize: '12px',
                  background: 'var(--white)',
                  width: '100px',
                  outline: 'none',
                }}
              />
              <input
                type="number"
                placeholder="До"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--grey-100)',
                  fontSize: '12px',
                  background: 'var(--white)',
                  width: '100px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Active filters indicator */}
          {(activeCategory !== 'all' || search || priceMin || priceMax || sort !== 'default') && (
            <div style={{
              maxWidth: '1600px',
              margin: '24px auto 0',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--grey-600)' }}>Найдено: {filtered.length}</span>
              <button onClick={clearFilters} style={{
                padding: '6px 12px',
                background: 'none',
                border: '1px solid var(--grey-100)',
                fontSize: '11px',
                cursor: 'pointer',
                letterSpacing: '0.5px',
              }}>Сбросить</button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '60px 40px 120px' }}>
        {activeView === 'catalog' && (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 40px' }}>
                <div style={{ fontSize: '14px', color: 'var(--grey-600)', marginBottom: '24px' }}>
                  Товары не найдены
                </div>
                <button onClick={clearFilters} style={{
                  padding: '12px 32px',
                  background: 'var(--black)',
                  color: 'white',
                  border: 'none',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}>Сбросить фильтры</button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '40px 24px',
              }} className="product-grid">
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={addToCart}
                    onOpenDetail={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeView === 'cart' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 40px' }}>
                <div style={{ fontSize: '14px', color: 'var(--grey-600)', marginBottom: '24px' }}>
                  Корзина пуста
                </div>
                <button onClick={() => setActiveView('catalog')} style={{
                  padding: '12px 32px',
                  background: 'var(--black)',
                  color: 'white',
                  border: 'none',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}>Перейти в каталог</button>
              </div>
            ) : (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 300,
                  marginBottom: '48px',
                  letterSpacing: '1px',
                }}>Корзина</h2>

                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '24px',
                    padding: '24px 0',
                    borderBottom: '1px solid var(--grey-100)',
                  }}>
                    <img src={item.img} alt={item.name} style={{
                      width: '100%',
                      aspectRatio: '3/4',
                      objectFit: 'cover',
                    }} />
                    <div>
                      <div style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 400 }}>{item.name}</div>
                      {item.collection && (
                        <div style={{ fontSize: '11px', color: 'var(--grey-600)', marginBottom: '4px', letterSpacing: '1px' }}>
                          {item.collection}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: 'var(--grey-600)', marginBottom: '12px' }}>
                        {item.material} • {item.size}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <button onClick={() => removeFromCart(item.id)} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'var(--grey-600)',
                        textDecoration: 'underline',
                      }}>Удалить</button>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid var(--grey-100)',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}>−</button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid var(--grey-100)',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: '48px',
                  padding: '32px',
                  background: 'var(--grey-50)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                    <span>Подытог</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                    <span>Доставка</span>
                    <span>{deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--grey-600)', marginBottom: '16px' }}>
                      Бесплатная доставка от {formatPrice(500000)}
                    </div>
                  )}
                  <div style={{
                    borderTop: '1px solid var(--grey-100)',
                    paddingTop: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: 500,
                    marginBottom: '24px',
                  }}>
                    <span>Итого</span>
                    <span>{formatPrice(cartTotal + deliveryFee)}</span>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--black)',
                    color: 'white',
                    border: 'none',
                    fontSize: '12px',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}>Оформить заказ</button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button onClick={() => setActiveView('catalog')} style={{
                      background: 'none',
                      color: 'var(--grey-600)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textDecoration: 'underline',
                    }}>Продолжить покупки</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'favorites' && (
          <div>
            {favoriteProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 40px' }}>
                <div style={{ fontSize: '14px', color: 'var(--grey-600)', marginBottom: '24px' }}>
                  Нет избранных товаров
                </div>
                <button onClick={() => setActiveView('catalog')} style={{
                  padding: '12px 32px',
                  background: 'var(--black)',
                  color: 'white',
                  border: 'none',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}>Перейти в каталог</button>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: 300,
                  marginBottom: '48px',
                  letterSpacing: '1px',
                }}>Избранное</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '40px 24px',
                }} className="product-grid">
                  {favoriteProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isFavorite={true}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={addToCart}
                      onOpenDetail={setSelectedProduct}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="no-print" onClick={() => setSelectedProduct(null)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'var(--white)',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }} className="modal-layout">
            <button onClick={() => setSelectedProduct(null)} style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'white',
              border: 'none',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '24px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>×</button>

            <img src={selectedProduct.img} alt={selectedProduct.name} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }} />

            <div style={{ padding: '60px 48px' }}>
              {selectedProduct.collection && (
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '2px',
                  color: 'var(--grey-600)',
                  marginBottom: '12px',
                }}>{selectedProduct.collection}</div>
              )}

              <h2 style={{
                fontSize: '36px',
                marginBottom: '16px',
                fontWeight: 300,
                letterSpacing: '0.5px',
              }}>{selectedProduct.name}</h2>

              <div style={{ fontSize: '24px', marginBottom: '32px', fontWeight: 400 }}>
                {formatPrice(selectedProduct.price)}
              </div>

              <div style={{ marginBottom: '32px', lineHeight: 1.7, color: 'var(--grey-600)', fontSize: '14px' }}>
                {selectedProduct.desc}
              </div>

              <div style={{
                borderTop: '1px solid var(--grey-100)',
                borderBottom: '1px solid var(--grey-100)',
                padding: '24px 0',
                marginBottom: '32px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--grey-600)' }}>Материал</span>
                  <span>{selectedProduct.material}</span>
                  <span style={{ color: 'var(--grey-600)' }}>Цвет</span>
                  <span>{selectedProduct.color}</span>
                  <span style={{ color: 'var(--grey-600)' }}>Размер</span>
                  <span>{selectedProduct.size}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <button onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }} style={{
                  width: '100%',
                  padding: '16px',
                  background: 'var(--black)',
                  color: 'white',
                  border: 'none',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>В корзину</button>

                <button onClick={() => toggleFavorite(selectedProduct.id)} style={{
                  width: '100%',
                  padding: '16px',
                  background: 'white',
                  color: 'var(--black)',
                  border: '1px solid var(--grey-100)',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.includes(selectedProduct.id) ? 'var(--black)' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {favorites.includes(selectedProduct.id) ? 'В избранном' : 'В избранное'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="no-print" onClick={() => setShowConsultModal(false)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: 'var(--white)',
            maxWidth: '500px',
            width: '100%',
            padding: '48px',
            position: 'relative',
          }}>
            <button onClick={() => setShowConsultModal(false)} style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}>×</button>

            <h3 style={{ fontSize: '24px', fontWeight: 300, marginBottom: '16px', letterSpacing: '0.5px' }}>
              Получить консультацию
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--grey-600)', marginBottom: '32px', lineHeight: 1.6 }}>
              Наши специалисты помогут подобрать идеальную мебель для вашего интерьера
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Имя" style={{
                padding: '14px 0',
                border: 'none',
                borderBottom: '1px solid var(--grey-100)',
                fontSize: '14px',
                outline: 'none',
              }} />
              <input type="tel" placeholder="Телефон" style={{
                padding: '14px 0',
                border: 'none',
                borderBottom: '1px solid var(--grey-100)',
                fontSize: '14px',
                outline: 'none',
              }} />
              <textarea placeholder="Комментарий" rows={3} style={{
                padding: '14px 0',
                border: 'none',
                borderBottom: '1px solid var(--grey-100)',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
              }} />
              <button type="submit" style={{
                padding: '16px',
                background: 'var(--black)',
                color: 'white',
                border: 'none',
                fontSize: '12px',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginTop: '16px',
              }}>Отправить</button>
            </form>
          </div>
        </div>
      )}

      {/* Print-only header */}
      <div style={{ display: 'none' }} className="print-header">
        <style>{`
          @media print {
            .print-header {
              display: block !important;
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 1px solid var(--black);
              padding-bottom: 24px;
            }
            .product-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
            .desktop-consult { display: block !important; }
            .product-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .filter-grid {
              grid-template-columns: 1fr auto auto !important;
            }
            .modal-layout {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          @media (max-width: 767px) {
            .product-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            .filter-grid {
              grid-template-columns: 1fr !important;
            }
            .modal-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div style={{
          fontSize: '32px',
          fontWeight: 300,
          letterSpacing: '4px',
          marginBottom: '8px',
        }}>COMFORT JIHAZ UII</div>
        <div style={{ fontSize: '14px', color: 'var(--grey-600)' }}>
          Мебельный салон премиум класса
        </div>
      </div>
    </>
  );
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
  product: Product;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

function ProductCard({ product, index, isFavorite, onToggleFavorite, onAddToCart, onOpenDetail }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  return (
    <div
      style={{
        cursor: 'pointer',
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${Math.min(index * 50, 400)}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetail(product)}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        paddingTop: '133.33%',
        background: 'var(--grey-50)',
        marginBottom: '16px',
        overflow: 'hidden',
      }}>
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Badges */}
        {product.badge && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            padding: '6px 12px',
            background: 'var(--black)',
            color: 'white',
            fontSize: '9px',
            letterSpacing: '1px',
            fontWeight: 500,
          }}>
            {product.badge === 'new' ? 'НОВИНКА' : 'ПОПУЛЯРНОЕ'}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'white',
            border: 'none',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered || isFavorite ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'var(--black)' : 'none'} stroke="var(--black)" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Add to cart overlay */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
              setShowAdded(true);
              setTimeout(() => setShowAdded(false), 1500);
            }}
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              padding: '14px',
              background: 'var(--black)',
              color: 'white',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontWeight: 500,
              opacity: showAdded ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {showAdded ? '✓ Добавлено' : 'В корзину'}
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        {product.collection && (
          <div style={{
            fontSize: '10px',
            letterSpacing: '1.5px',
            color: 'var(--grey-600)',
            marginBottom: '4px',
          }}>{product.collection}</div>
        )}

        <div style={{
          fontSize: '16px',
          marginBottom: '4px',
          fontWeight: 400,
        }}>{product.name}</div>

        <div style={{ fontSize: '14px', color: 'var(--grey-600)', marginBottom: '12px' }}>
          {CATEGORIES[product.category]}
        </div>

        <div style={{ fontSize: '14px', fontWeight: 500 }}>
          {product.price.toLocaleString('ru-RU')} ₸
        </div>
      </div>
    </div>
  );
}
