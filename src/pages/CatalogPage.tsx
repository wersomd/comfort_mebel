import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';
import { CatalogPDFButton } from '../components/CatalogPDFButton';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import type { SortOption } from '../types';

const PAGE_SIZE = 24;

function plural(n: number, forms: [string, string, string]) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

export function CatalogPage() {
  const { products }   = useProducts();
  const { categories } = useCategories();
  const [params]       = useSearchParams();
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = params.get('category') || 'all';
  const search   = (params.get('search') || '').toLowerCase();
  const sort     = (params.get('sort') as SortOption) || 'default';
  const priceMin = Number(params.get('priceMin')) || 0;
  const priceMax = Number(params.get('priceMax')) || Infinity;

  useEffect(() => { setPage(1); }, [activeCategory, search, sort, priceMin, priceMax]);

  const saleCategory = categories.find(c => c.special === 'sale');
  const isSaleView   = saleCategory && activeCategory === saleCategory.slug;

  const filtered = useMemo(() => {
    let r = products;
    if (isSaleView)                    r = r.filter(p => p.badges.includes('sale') || (p.oldPrice && p.oldPrice > p.price));
    else if (activeCategory !== 'all') r = r.filter(p => p.category === activeCategory);
    if (search)      r = r.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
    if (priceMin > 0)        r = r.filter(p => p.price >= priceMin);
    if (priceMax < Infinity) r = r.filter(p => p.price <= priceMax);
    if (sort === 'price_asc')  return [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') return [...r].sort((a, b) => b.price - a.price);
    if (sort === 'new')        return r.filter(p => p.badges.includes('new'));
    if (sort === 'popular')    return r.filter(p => p.badges.includes('popular'));
    return r;
  }, [products, activeCategory, search, priceMin, priceMax, sort, isSaleView]);

  const totalPages   = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCat    = activeCategory !== 'all' ? categories.find(c => c.slug === activeCategory) : undefined;
  const categoryName = activeCat?.name;
  const heroBg       = activeCat?.background;

  return (
    <div className="pt-16 lg:pt-[68px] bg-white min-h-screen">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="relative border-b border-[#E8D9C6]"
        style={heroBg ? { backgroundImage: `url('${heroBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        {heroBg && <div className="absolute inset-0 bg-[#3D2C25]/55" />}
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <nav className={`flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase font-['Inter'] mb-6 ${heroBg ? 'text-white/70' : 'text-[#9A8070]'}`}>
            <Link to="/" className={`transition-colors ${heroBg ? 'hover:text-white' : 'hover:text-[#3D2C25]'}`}>Главная</Link>
            <span className={heroBg ? 'text-white/40' : 'text-[#E8D9C6]'}>/</span>
            {categoryName ? (
              <>
                <Link to="/catalog" className={`transition-colors ${heroBg ? 'hover:text-white' : 'hover:text-[#3D2C25]'}`}>Каталог</Link>
                <span className={heroBg ? 'text-white/40' : 'text-[#E8D9C6]'}>/</span>
                <span className={heroBg ? 'text-white' : 'text-[#3D2C25]'}>{categoryName}</span>
              </>
            ) : (
              <span className="text-[#3D2C25]">Каталог</span>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className={`font-['Playfair_Display'] text-4xl lg:text-6xl leading-[1.05] ${heroBg ? 'text-white' : 'text-[#3D2C25]'}`}>
                {categoryName || 'Каталог'}
              </h1>
              <p className={`text-[12px] font-['Inter'] mt-3 tracking-[0.5px] ${heroBg ? 'text-white/75' : 'text-[#9A8070]'}`}>
                {search && <span>Поиск «{params.get('search')}» · </span>}
                {filtered.length} {plural(filtered.length, ['товар', 'товара', 'товаров'])}
              </p>
            </div>
            <CatalogPDFButton products={filtered} />
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Mobile filter toggle */}
        <button onClick={() => setFiltersOpen(v => !v)}
          className="lg:hidden flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] border border-[#E8D9C6] px-4 py-2.5 mb-6 font-['Inter'] font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          {filtersOpen ? 'Скрыть фильтры' : 'Фильтры'}
        </button>

        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-14">
          {/* Sidebar */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block mb-10 lg:mb-0`}>
            <div className="lg:sticky lg:top-[96px]">
              <FilterBar categories={categories} />
            </div>
          </aside>

          {/* Products */}
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-28 border border-dashed border-[#E8D9C6]">
                <p className="text-[13px] text-[#9A8070] mb-6 font-['Inter']">По вашему запросу ничего не найдено</p>
                <Link to="/catalog"
                  className="text-[11px] tracking-[2px] uppercase text-[#3D2C25] border-b border-[#3D2C25] pb-0.5 hover:text-[#9A8070] hover:border-[#9A8070] transition-colors font-['Inter']">
                  Сбросить фильтры
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                  {paginated.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-16">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 text-[#9A8070] hover:text-[#3D2C25] disabled:opacity-30 transition-colors font-['Inter'] text-lg">
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`w-9 h-9 text-[12px] font-['Inter'] transition-colors ${
                          n === page
                            ? 'bg-[#3D2C25] text-white'
                            : 'text-[#9A8070] hover:text-[#3D2C25]'
                        }`}>
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-9 h-9 text-[#9A8070] hover:text-[#3D2C25] disabled:opacity-30 transition-colors font-['Inter'] text-lg">
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
