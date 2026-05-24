import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../hooks/useCart';
import { useCompare } from '../hooks/useCompare';

interface Props { product: Product; index?: number; }

function discountPercent(price: number, oldPrice: number) {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function ProductCard({ product, index = 0 }: Props) {
  const [hovered, setHovered]   = useState(false);
  const [added, setAdded]       = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const { add } = useCart();
  const { has, toggle, isFull } = useCompare();
  const inCompare = has(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    add(product); setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggle(product);
  };

  const images   = product.images;
  const img      = images[imgIndex] || '';
  const discount = product.oldPrice ? discountPercent(product.price, product.oldPrice) : 0;

  const goImage = (e: React.MouseEvent, dir: number) => {
    e.preventDefault(); e.stopPropagation();
    setImgIndex(i => (i + dir + images.length) % images.length);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block"
      style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}>

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5F5F5] mb-4" style={{ paddingTop: '120%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {img ? (
          <img src={img} alt={product.name} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9A8070" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="1"/><path d="m3 9 4-4 4 4 4-4 4 4"/>
              <circle cx="8.5" cy="13.5" r="1.5"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#3D2C25]/10 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }} />

        {/* Compare toggle */}
        <button type="button" onClick={handleCompare}
          aria-label="Добавить к сравнению"
          title={inCompare ? 'В сравнении' : 'Добавить к сравнению'}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors duration-200"
          style={{
            background: inCompare ? '#3D2C25' : 'rgba(255,255,255,0.9)',
            color: inCompare ? '#FFFFFF' : '#3D2C25',
            opacity: !inCompare && isFull ? 0.4 : 1,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>
          </svg>
        </button>

        {/* Slider — arrows on hover, dots when idle */}
        {images.length > 1 && (
          <>
            <button type="button" onClick={e => goImage(e, -1)} aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/85 text-[#3D2C25] text-base transition-opacity duration-200 hover:bg-white"
              style={{ opacity: hovered ? 1 : 0 }}>‹</button>
            <button type="button" onClick={e => goImage(e, 1)} aria-label="Следующее фото"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/85 text-[#3D2C25] text-base transition-opacity duration-200 hover:bg-white"
              style={{ opacity: hovered ? 1 : 0 }}>›</button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-200"
              style={{ opacity: hovered ? 0 : 1 }}>
              {images.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i === imgIndex ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                    boxShadow: '0 0 2px rgba(0,0,0,0.45)',
                  }} />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {(discount > 0 || product.badges.includes('sale')) && (
            <span className="bg-[#3D2C25] text-white text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">
              {discount > 0 ? `−${discount}%` : 'SALE'}
            </span>
          )}
          {product.badges.includes('new') && (
            <span className="bg-[#E8D9C6] text-[#3D2C25] text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">
              Новинка
            </span>
          )}
          {product.badges.includes('popular') && (
            <span className="bg-[#9A8070] text-white text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 font-['Inter'] font-bold">
              Хит
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-[#3D2C25] text-white text-[10px] tracking-[2px] uppercase py-3.5 font-['Inter'] font-bold transition-all duration-300 hover:bg-[#9A8070]"
          style={{ transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}>
          {added ? '✓ Добавлено' : 'В корзину'}
        </button>
      </div>

      {/* Text */}
      <div>
        <p className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] mb-1">{product.sku}</p>
        <h3 className="text-[15px] font-['Playfair_Display'] text-[#3D2C25] group-hover:text-[#9A8070] transition-colors duration-200 leading-snug mb-1">
          {product.name}
        </h3>
        {product.material && <p className="text-[12px] text-[#9A8070] mb-1">{product.material}</p>}
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-['Inter'] font-semibold text-[#3D2C25]">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[12px] text-[#9A8070] line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
