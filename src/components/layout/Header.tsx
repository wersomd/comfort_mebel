import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';
import { useCategories } from '../../hooks/useCategories';

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catMenu, setCatMenu]         = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mobileSub, setMobileSub]     = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { count } = useCart();
  const { count: compareCount } = useCompare();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const logoVisible = location.pathname !== '/' || scrolled;

  const topCats    = categories.filter(c => !c.parentId && !c.special).sort((a, b) => a.order - b.order);
  const saleCategory = categories.find(c => c.special === 'sale');
  const subsOf  = (id: string) => categories.filter(c => c.parentId === id).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 40);
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMobileSub(null);
  }, [location.pathname, location.search]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLink = "text-[11px] xl:text-[12px] tracking-[1.5px] uppercase font-['Inter'] font-medium text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 whitespace-nowrap";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 border-b ${
        scrolled ? 'border-[#E8D9C6] shadow-[0_1px_16px_rgba(0,0,0,0.05)]' : 'border-[#F0F0F0]'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-10 h-16 lg:h-[68px] grid grid-cols-[1fr_auto_1fr] items-center">

          {/* LEFT — burger on mobile / nav on desktop */}
          <div className="flex items-center gap-4 lg:gap-7">
            {/* Burger — mobile only */}
            <button onClick={() => setMobileOpen(true)} aria-label="Меню"
              className="lg:hidden p-2 -ml-2 text-[#3D2C25] hover:text-[#9A8070] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <line x1="3"  y1="6"  x2="21" y2="6"/>
                <line x1="3"  y1="12" x2="21" y2="12"/>
                <line x1="3"  y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Каталог + mega-menu */}
              <div className="relative"
                onMouseEnter={() => setCatMenu(true)}
                onMouseLeave={() => setCatMenu(false)}>
                <Link to="/catalog" className={`${navLink} inline-flex items-center gap-1.5`}>
                  Каталог
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                    className={`transition-transform duration-200 ${catMenu ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </Link>

                {/* Mega-menu */}
                <div className={`absolute left-0 top-full pt-4 transition-all duration-200 ${
                  catMenu && topCats.length > 0
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white border border-[#E8D9C6] shadow-[0_20px_60px_rgba(61,44,37,0.15)]"
                    style={{ width: 'min(820px, calc(100vw - 48px))' }}>
                    {/* Header strip */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-[#F0E6D9]">
                      <p className="text-[10px] tracking-[2px] uppercase text-[#9A8070] font-['Inter'] font-semibold">
                        Все категории
                      </p>
                      <Link to="/catalog" onClick={() => setCatMenu(false)}
                        className="text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] font-medium flex items-center gap-1.5">
                        Смотреть весь каталог
                        <span aria-hidden>→</span>
                      </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-3 gap-x-10 gap-y-8 p-8">
                      {topCats.map(cat => {
                        const subs = subsOf(cat.id);
                        return (
                          <div key={cat.id} className="group">
                            <Link to={`/catalog?category=${cat.slug}`} onClick={() => setCatMenu(false)}
                              className="inline-flex items-center gap-2 text-[13px] tracking-[0.5px] font-['Inter'] font-semibold text-[#3D2C25] hover:text-[#9A8070] transition-colors mb-3">
                              {cat.emoji && <span className="text-[15px]">{cat.emoji}</span>}
                              <span>{cat.name}</span>
                            </Link>
                            {subs.length > 0 && (
                              <div className="flex flex-col gap-1.5">
                                {subs.slice(0, 6).map(sub => (
                                  <Link key={sub.id} to={`/catalog?category=${sub.slug}`} onClick={() => setCatMenu(false)}
                                    className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] hover:translate-x-0.5 transition-all duration-150 font-['Inter']">
                                    {sub.name}
                                  </Link>
                                ))}
                                {subs.length > 6 && (
                                  <Link to={`/catalog?category=${cat.slug}`} onClick={() => setCatMenu(false)}
                                    className="text-[11px] text-[#C4A07A] hover:text-[#3D2C25] transition-colors font-['Inter'] mt-1">
                                    + ещё {subs.length - 6}
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {saleCategory && (
                <Link to={`/catalog?category=${saleCategory.slug}`} className={`${navLink} text-[#C0392B] hover:text-[#9A2A1F]`}>
                  Акции
                </Link>
              )}
              <Link to="/about" className={navLink}>О нас</Link>
            </nav>
          </div>

          {/* CENTER — logo */}
          <Link to="/"
            className="flex flex-col items-center leading-none justify-self-center transition-opacity duration-300"
            style={{
              opacity: logoVisible ? 1 : 0,
              pointerEvents: logoVisible ? 'auto' : 'none',
            }}>
            <span className="font-['Playfair_Display'] text-base sm:text-lg lg:text-[22px] font-medium tracking-[5px] sm:tracking-[6px] text-[#3D2C25]">
              COMFORT
            </span>
            <span className="text-[6.5px] sm:text-[7px] tracking-[3.5px] sm:tracking-[4px] uppercase mt-1 text-[#9A8070] font-['Inter']">
              JIHAZ ÜII
            </span>
          </Link>

          {/* RIGHT — search + compare + cart */}
          <div className="flex items-center gap-0 sm:gap-0.5 justify-self-end">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1.5">
                <input ref={searchRef} type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                  placeholder="Поиск..."
                  className="w-28 sm:w-44 lg:w-56 bg-[#F5F5F5] border-0 text-[#3D2C25] text-[12px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#E8D9C6] placeholder:text-[#9A8070] transition-all" />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-1.5 text-[#9A8070] hover:text-[#3D2C25] transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} aria-label="Поиск"
                className="p-2 sm:p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            )}

            <Link to="/compare" aria-label="Сравнение" title="Сравнение"
              className="hidden sm:block relative p-2 sm:p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>
              </svg>
              {compareCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3D2C25] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 font-['Inter']">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link to="/cart" aria-label="Корзина"
              className="relative p-2 sm:p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3D2C25] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 font-['Inter']">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      {/* Overlay */}
      <div onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-[#3D2C25]/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} />

      {/* Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-[70] w-[85%] max-w-sm bg-white lg:hidden shadow-2xl transition-transform duration-300 ease-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#E8D9C6]">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex flex-col items-start leading-none">
              <span className="font-['Playfair_Display'] text-lg font-medium tracking-[5px] text-[#3D2C25]">COMFORT</span>
              <span className="text-[7px] tracking-[3.5px] uppercase mt-1 text-[#9A8070] font-['Inter']">JIHAZ ÜII</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Закрыть"
              className="p-2 -mr-2 text-[#9A8070] hover:text-[#3D2C25] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 px-6 py-6">
            {/* Каталог expandable */}
            <div className="mb-1">
              <button onClick={() => setMobileSub(mobileSub === '__cat' ? null : '__cat')}
                className="w-full flex items-center justify-between py-3.5 text-[13px] tracking-[1.5px] uppercase text-[#3D2C25] font-['Inter'] font-semibold">
                <span>Каталог</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  className={`transition-transform ${mobileSub === '__cat' ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
                mobileSub === '__cat' ? 'max-h-[800px]' : 'max-h-0'
              }`}>
                <div className="pl-2 pb-2 flex flex-col gap-0.5">
                  <Link to="/catalog"
                    className="py-2 text-[12px] tracking-[1px] uppercase text-[#3D2C25] hover:text-[#9A8070] font-['Inter'] font-medium">
                    Весь каталог
                  </Link>
                  {topCats.map(cat => {
                    const subs = subsOf(cat.id);
                    return (
                      <div key={cat.id} className="border-t border-[#F0E6D9]/70 pt-1.5 pb-1.5">
                        <Link to={`/catalog?category=${cat.slug}`}
                          className="flex items-center gap-2 py-2 text-[12px] text-[#3D2C25] hover:text-[#9A8070] font-['Inter'] font-medium">
                          {cat.emoji && <span>{cat.emoji}</span>}
                          {cat.name}
                        </Link>
                        {subs.length > 0 && (
                          <div className="pl-6 flex flex-col gap-1">
                            {subs.map(sub => (
                              <Link key={sub.id} to={`/catalog?category=${sub.slug}`}
                                className="py-1 text-[12px] text-[#9A8070] hover:text-[#3D2C25] font-['Inter']">
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {saleCategory && (
              <Link to={`/catalog?category=${saleCategory.slug}`}
                className="block py-3.5 text-[13px] tracking-[1.5px] uppercase text-[#C0392B] font-['Inter'] font-semibold border-t border-[#F0E6D9]">
                Акции
              </Link>
            )}

            <Link to="/about"
              className="block py-3.5 text-[13px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] font-['Inter'] font-semibold border-t border-[#F0E6D9]">
              О нас
            </Link>
            <Link to="/compare"
              className="flex items-center justify-between py-3.5 text-[13px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] font-['Inter'] font-semibold border-t border-[#F0E6D9]">
              <span>Сравнение</span>
              {compareCount > 0 && (
                <span className="bg-[#3D2C25] text-white text-[10px] px-1.5 py-0.5 font-bold">{compareCount}</span>
              )}
            </Link>
            <Link to="/cart"
              className="flex items-center justify-between py-3.5 text-[13px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] font-['Inter'] font-semibold border-t border-[#F0E6D9]">
              <span>Корзина</span>
              {count > 0 && (
                <span className="bg-[#3D2C25] text-white text-[10px] px-1.5 py-0.5 font-bold">{count}</span>
              )}
            </Link>
          </nav>

          {/* Drawer contacts */}
          <div className="px-6 py-5 border-t border-[#E8D9C6] bg-[#FAFAFA]">
            <p className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] font-semibold mb-3">Связаться</p>
            <a href="tel:+77756466464" className="block text-[14px] text-[#3D2C25] font-['Inter'] font-medium mb-2">
              +7 (775) 646 64 64
            </a>
            <p className="text-[11px] text-[#9A8070] font-['Inter']">Улица Рыскулова, 102/1</p>
            <p className="text-[11px] text-[#9A8070] font-['Inter']">Ежедневно с 09:00 до 18:59</p>
          </div>
        </div>
      </aside>
    </>
  );
}
