import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import heroSofa from '../assets/hero-bg.png';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(20px)',
      transition: `opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)`,
      transitionDelay: `${delay}ms`,
    }}>{children}</div>
  );
}

export function HomePage() {
  const { products }   = useProducts();
  const { categories } = useCategories();
  const [heroAnim, setHeroAnim]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroAnim(true), 120);
    return () => clearTimeout(t);
  }, []);

  const newProducts     = products.filter(p => p.badges.includes('new')).slice(0, 4);
  const popularProducts = products.filter(p => p.badges.includes('popular')).slice(0, 8);
  const topCats         = categories.filter(c => !c.parentId && !c.special).slice(0, 8);

  return (
    <>
      {/* HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="relative flex flex-col items-center w-full">
            {/* COMFORT — behind, drops in from above */}
            <h1
              className="font-['Playfair_Display'] font-medium select-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(56px, 13.5vw, 208px)',
                lineHeight: 1,
                letterSpacing: '0.05em',
                paddingLeft: '0.05em',
                marginBottom: '-0.25em',
                color: '#3D2C25',
                position: 'relative',
                zIndex: 1,
                opacity: heroAnim ? 1 : 0,
                transform: heroAnim ? 'translateY(0)' : 'translateY(-70px)',
                transition: 'opacity 1s ease 0.35s, transform 1.15s cubic-bezier(0.22,1,0.36,1) 0.35s',
              }}
            >
              COMFORT
            </h1>

            {/* Sofa — in front, rises from below; covers the lower edge of the text */}
            <img
              src={heroSofa}
              alt="Comfort Mebel"
              className="relative select-none pointer-events-none"
              style={{
                zIndex: 2,
                width: 'min(94vw, 1200px)',
                opacity: heroAnim ? 1 : 0,
                transform: heroAnim ? 'translateY(0)' : 'translateY(130px)',
                transition: 'opacity 1.1s ease, transform 1.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES ───────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <Reveal className="flex items-end justify-between mb-10">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#3D2C25]">Коллекции</h2>
          <Link to="/catalog" className="text-[11px] tracking-[2px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] border-b border-[#E8D9C6] pb-0.5">
            Все категории
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
          {topCats.map((cat, i) => {
            const photo = cat.background || cat.image;
            return (
              <Reveal key={cat.id} delay={i * 60}>
                <Link to={`/catalog?category=${cat.slug}`} className="group flex flex-col items-center">
                  <div className="w-full h-48 lg:h-64 overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
                    {photo ? (
                      <img src={photo} alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                    ) : (
                      <img src={heroSofa} alt={cat.name}
                        className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]" />
                    )}
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[15px] lg:text-[17px] text-[#3D2C25] font-semibold mt-4 group-hover:text-[#9A8070] transition-colors duration-200">
                    {cat.name}
                  </h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* POPULAR ──────────────────────────────────────────── */}
      {popularProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <Reveal className="flex items-end justify-between mb-10">
              <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#3D2C25]">Популярное</h2>
              <Link to="/catalog?sort=popular" className="text-[11px] tracking-[2px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] border-b border-[#E8D9C6] pb-0.5">
                Все
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {popularProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* NEW PRODUCTS ─────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <Reveal className="flex items-end justify-between mb-10">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#3D2C25]">Новинки</h2>
            <Link to="/catalog?sort=new" className="text-[11px] tracking-[2px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] border-b border-[#E8D9C6] pb-0.5">
              Все
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* FEATURES ─────────────────────────────────────────── */}
      <section className="border-t border-[#E8D9C6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Гарантия 18 месяцев', desc: 'На каждое изделие — официальная гарантия от производителя на полтора года.' },
              { title: 'Без посредников',    desc: 'Работаем напрямую с фабриками Китая, Турции, Европы и СНГ — поэтому держим честные цены.' },
              { title: 'Доставка и сборка',  desc: 'Профессиональная доставка и сборка по всему Казахстану — рассчитываются индивидуально.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="flex gap-4">
                  <div className="w-1 bg-[#E8D9C6] shrink-0 mt-1" style={{ height: 40 }} />
                  <div>
                    <h4 className="text-[14px] font-['Inter'] font-semibold text-[#3D2C25] mb-2">{f.title}</h4>
                    <p className="text-[13px] text-[#9A8070] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
