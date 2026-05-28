import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useCompare } from '../hooks/useCompare';
import { useCategories } from '../hooks/useCategories';
import { ConsultModal } from '../components/ConsultModal';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { add } = useCart();
  const { has, toggle } = useCompare();
  const { categories } = useCategories();
  const [consultOpen, setConsultOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const product = products.find(p => p.id === id);

  // Инициализируем выбранный цвет когда product подгрузится
  useEffect(() => {
    if (product && (product.colors?.length ?? 0) > 0) {
      setSelectedColorId(prev => prev ?? product.colors![0].id);
    }
  }, [product]);

  // Пока товары грузятся — скелетон, чтобы не показывать "Товар не найден"
  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-[#9A8070] text-[13px] font-['Inter']">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6">
        <h1 className="font-['Playfair_Display'] text-4xl text-[#3D2C25]">Товар не найден</h1>
        <Link to="/catalog" className="text-[11px] tracking-[2px] uppercase text-[#C4A07A] border-b border-current font-['Inter']">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const boughtWith = (product.relatedIds || [])
    .map(rid => products.find(p => p.id === rid))
    .filter(Boolean) as Product[];
  const catName  = categories.find(c => c.slug === product.category)?.name;

  const productColors = product.colors || [];
  const hasVariants = productColors.length > 0;
  const activeColor = productColors.find(c => c.id === selectedColorId);
  const imgs = (() => {
    if (activeColor && activeColor.images.length > 0) return activeColor.images;
    return product.images.length ? product.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200'];
  })();
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  // При смене цвета — сбрасываем активное фото
  const pickColor = (cid: string) => {
    setSelectedColorId(cid);
    setActiveImg(0);
  };

  // Доступность
  const available = (() => {
    if (activeColor) return activeColor.stock == null || activeColor.stock > 0;
    if (hasVariants) return productColors.some(c => c.stock == null || c.stock > 0);
    if (product.stock == null) return true;
    return product.stock > 0;
  })();

  const stockHint = (() => {
    if (activeColor && activeColor.stock != null) {
      return activeColor.stock > 0 ? `В наличии: ${activeColor.stock} шт.` : 'Нет в наличии';
    }
    if (!hasVariants && product.stock != null) {
      return product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии';
    }
    return null;
  })();

  const handleAddToCart = () => {
    if (!available) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="pt-16 lg:pt-[70px]">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 border-b border-[#E8D9C6]">
          <nav className="flex items-center gap-2 text-[11px] tracking-[1px] uppercase font-['Inter'] text-[#9A8070]">
            <Link to="/" className="hover:text-[#3D2C25] transition-colors duration-200">Главная</Link>
            <span className="text-[#E8D9C6]">/</span>
            <Link to="/catalog" className="hover:text-[#3D2C25] transition-colors duration-200">Каталог</Link>
            {catName && (
              <>
                <span className="text-[#E8D9C6]">/</span>
                <Link to={`/catalog?category=${product.category}`} className="hover:text-[#3D2C25] transition-colors duration-200">{catName}</Link>
              </>
            )}
            <span className="text-[#E8D9C6]">/</span>
            <span className="text-[#3D2C25]">{product.name}</span>
          </nav>
        </div>

        {/* Product layout */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

            {/* Gallery */}
            <div className="anim-fade-in">
              <div className="relative overflow-hidden bg-[#F5F5F5] mb-3" style={{ aspectRatio: '4/5' }}>
                <img src={imgs[activeImg]} alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-[#3D2C25] text-white text-[10px] tracking-[1.5px] uppercase px-3 py-1.5 font-['Inter'] font-bold">
                    −{discount}%
                  </div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2">
                  {imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative w-20 overflow-hidden transition-all duration-200 ${
                        i === activeImg ? 'ring-1 ring-[#3D2C25] opacity-100' : 'opacity-40 hover:opacity-70'
                      }`} style={{ aspectRatio: '1' }}>
                      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4 anim-fade-up delay-100">
              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex gap-2 mb-5">
                  {product.badges.includes('new') && (
                    <span className="bg-[#E8D9C6] text-[#3D2C25] text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">Новинка</span>
                  )}
                  {product.badges.includes('popular') && (
                    <span className="bg-[#C4A07A] text-white text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">Хит</span>
                  )}
                  {product.badges.includes('sale') && (
                    <span className="bg-[#3D2C25] text-white text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">Sale</span>
                  )}
                </div>
              )}

              <p className="text-[11px] tracking-[2px] text-[#9A8070] mb-2 font-['Inter'] uppercase">{product.sku}</p>
              <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#3D2C25] font-medium mb-4 leading-tight">
                {product.name}
              </h1>

              {catName && (
                <Link to={`/catalog?category=${product.category}`}
                  className="inline-block text-[11px] tracking-[1.5px] uppercase text-[#9A8070] hover:text-[#C4A07A] transition-colors duration-200 mb-6 font-['Inter']">
                  {catName}
                </Link>
              )}

              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-['Inter'] font-bold text-[#3D2C25]">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xl text-[#9A8070] line-through font-['Inter']">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
              {stockHint && (
                <p className={`text-[12px] font-['Inter'] mb-8 ${available ? 'text-[#3D8059]' : 'text-[#C0392B]'}`}>
                  {stockHint}
                </p>
              )}
              {!stockHint && <div className="mb-8" />}

              <p className="text-[15px] text-[#9A8070] leading-relaxed mb-8 font-['Inter']">
                {product.description}
              </p>

              {/* Color picker */}
              {hasVariants && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] font-semibold">
                      Цвет
                    </p>
                    {activeColor && (
                      <p className="text-[12px] text-[#3D2C25] font-['Inter']">{activeColor.name}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {productColors.map(c => {
                      const isActive = c.id === selectedColorId;
                      const outOfStock = c.stock != null && c.stock <= 0;
                      return (
                        <button key={c.id} type="button"
                          onClick={() => pickColor(c.id)}
                          aria-label={c.name}
                          title={`${c.name}${outOfStock ? ' — нет в наличии' : ''}`}
                          className="relative w-9 h-9 rounded-full transition-transform duration-150 hover:scale-110"
                          style={{
                            background: c.hex,
                            boxShadow: isActive
                              ? '0 0 0 2px #fff, 0 0 0 4px #3D2C25'
                              : '0 0 0 1px rgba(0,0,0,0.18)',
                            opacity: outOfStock ? 0.45 : 1,
                          }}>
                          {outOfStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block w-full h-px bg-[#3D2C25] rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specs grid — без цвета (он выбирается ниже) */}
              <div className="border-t border-b border-[#E8D9C6] py-6 mb-8 grid grid-cols-2 gap-5">
                {[
                  { key: 'material',   label: 'Материал', value: activeColor?.material || product.material },
                  { key: 'dimensions', label: 'Размер',   value: product.dimensions },
                ].filter(s => s.value).map(s => (
                  <div key={s.key}>
                    <p className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] mb-1 font-['Inter'] font-semibold">{s.label}</p>
                    <p className="text-[14px] font-['Inter'] text-[#3D2C25]">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} disabled={!available}
                  className="group relative bg-[#3D2C25] text-white text-[11px] tracking-[2.5px] uppercase py-4 px-8 font-['Inter'] font-bold overflow-hidden disabled:bg-[#9A8070] disabled:cursor-not-allowed">
                  <span className="relative z-10 transition-colors duration-300">
                    {!available ? 'Нет в наличии' : added ? '✓ Добавлено в корзину' : 'В корзину'}
                  </span>
                  {available && (
                    <div className="absolute inset-0 bg-[#9A8070] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  )}
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => toggle(product)}
                    className={`flex-1 border text-[11px] tracking-[2px] uppercase py-4 px-6 transition-all duration-200 font-['Inter'] font-medium ${
                      has(product.id)
                        ? 'bg-[#3D2C25] border-[#3D2C25] text-white'
                        : 'border-[#E8D9C6] text-[#9A8070] hover:border-[#3D2C25] hover:text-[#3D2C25]'
                    }`}>
                    {has(product.id) ? '✓ В сравнении' : 'К сравнению'}
                  </button>
                  <button onClick={() => setConsultOpen(true)}
                    className="flex-1 border border-[#E8D9C6] text-[#9A8070] text-[11px] tracking-[2px] uppercase py-4 px-6 hover:border-[#3D2C25] hover:text-[#3D2C25] transition-all duration-200 font-['Inter'] font-medium">
                    Задать вопрос
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bought with this */}
          {boughtWith.length > 0 && (
            <div className="mt-24">
              <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl text-[#3D2C25] mb-10">Покупают с этим товаром</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {boughtWith.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-24">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-['Playfair_Display'] text-4xl text-[#3D2C25]">Похожие товары</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConsultModal open={consultOpen} onClose={() => setConsultOpen(false)} productName={product.name} />
    </>
  );
}
