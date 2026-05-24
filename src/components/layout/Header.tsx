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
  const searchRef = useRef<HTMLInputElement>(null);
  const { count } = useCart();
  const { count: compareCount } = useCompare();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const logoVisible = location.pathname !== '/' || scrolled;

  const topCats = categories.filter(c => !c.parentId && !c.special).sort((a, b) => a.order - b.order);
  const subsOf  = (id: string) => categories.filter(c => c.parentId === id).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 40);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLink = "text-[11px] lg:text-[12px] tracking-[1.5px] uppercase font-['Inter'] font-medium text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 whitespace-nowrap";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 border-b ${
      scrolled ? 'border-[#E8D9C6] shadow-[0_1px_16px_rgba(0,0,0,0.05)]' : 'border-[#F0F0F0]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 h-16 lg:h-[68px] grid grid-cols-[1fr_auto_1fr] items-center">

        {/* LEFT — nav */}
        <nav className="flex items-center gap-5 lg:gap-8">
          {/* Каталог + mega-menu */}
          <div className="relative"
            onMouseEnter={() => setCatMenu(true)}
            onMouseLeave={() => setCatMenu(false)}>
            <Link to="/catalog" className={navLink}>Каталог</Link>

            {catMenu && topCats.length > 0 && (
              <div className="hidden lg:block absolute left-0 top-full pt-3.5">
                <div className="bg-white border border-[#E8D9C6] shadow-[0_12px_40px_rgba(61,44,37,0.12)] p-8"
                  style={{ width: 'min(720px, calc(100vw - 48px))' }}>
                  <div className="grid grid-cols-3 gap-x-10 gap-y-7">
                    {topCats.map(cat => {
                      const subs = subsOf(cat.id);
                      return (
                        <div key={cat.id}>
                          <Link to={`/catalog?category=${cat.slug}`} onClick={() => setCatMenu(false)}
                            className="block text-[12px] tracking-[1px] uppercase font-['Inter'] font-semibold text-[#3D2C25] hover:text-[#9A8070] transition-colors">
                            {cat.name}
                          </Link>
                          {subs.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-3">
                              {subs.map(sub => (
                                <Link key={sub.id} to={`/catalog?category=${sub.slug}`} onClick={() => setCatMenu(false)}
                                  className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors font-['Inter']">
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
            )}
          </div>

          <Link to="/about" className={navLink}>О нас</Link>
        </nav>

        {/* CENTER — logo: always on inner pages, on scroll on home */}
        <Link to="/"
          className="flex flex-col items-center leading-none justify-self-center transition-opacity duration-300"
          style={{
            opacity: logoVisible ? 1 : 0,
            pointerEvents: logoVisible ? 'auto' : 'none',
          }}>
          <span className="font-['Playfair_Display'] text-lg lg:text-[22px] font-medium tracking-[6px] text-[#3D2C25]">
            COMFORT
          </span>
          <span className="text-[7px] tracking-[4px] uppercase mt-1 text-[#9A8070] font-['Inter']">
            JIHAZ ÜII
          </span>
        </Link>

        {/* RIGHT — search + compare + cart */}
        <div className="flex items-center gap-0.5 justify-self-end">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input ref={searchRef} type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                placeholder="Поиск мебели..."
                className="w-32 lg:w-56 bg-[#F5F5F5] border-0 text-[#3D2C25] text-[12px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#E8D9C6] placeholder:text-[#9A8070] transition-all" />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1.5 text-[#9A8070] hover:text-[#3D2C25] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)}
              className="p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}

          <Link to="/compare" className="relative p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200" title="Сравнение">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>
            </svg>
            {compareCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#3D2C25] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 font-['Inter']">
                {compareCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2.5 text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200">
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
  );
}
