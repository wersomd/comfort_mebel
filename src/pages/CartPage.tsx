import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';
import { cartLineKey, cartUnitPrice, resolveImages } from '../lib/variants';
import { CheckoutModal } from '../components/CheckoutModal';

export function CartPage() {
  const { items, remove, updateQty, total, clear } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const delivery = total >= 500000 ? 0 : 15000;

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-16 py-12">
        <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#3D2C25] mb-12">Корзина</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 border border-[#E8D9C6] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9A8070" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-[15px] text-[#9A8070] mb-8 font-['Inter']">Корзина пуста</p>
            <Link to="/catalog"
              className="text-[11px] tracking-[2.5px] uppercase bg-[#3D2C25] text-white px-9 py-4 hover:bg-[#C4A07A] transition-colors duration-200 font-['Inter'] font-bold">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-0">
              {items.map(item => {
                const key = cartLineKey(item);
                const color = item.colorId ? item.product.colors?.find(c => c.id === item.colorId) : undefined;
                const size = item.sizeId ? item.product.sizes?.find(s => s.id === item.sizeId) : undefined;
                const img = resolveImages(item.product, color, size)[0]
                  || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400';
                return (
                <div key={key} className="flex gap-5 py-6 border-b border-[#E8D9C6]">
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover bg-[#F5F5F5]"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}
                      className="font-['Playfair_Display'] text-xl text-[#3D2C25] hover:text-[#C4A07A] transition-colors duration-200 block">
                      {item.product.name}
                    </Link>
                    {item.variantLabel && (
                      <p className="text-[12px] text-[#9A8070] mt-1 font-['Inter']">{item.variantLabel}</p>
                    )}
                    {!item.variantLabel && item.product.material && (
                      <p className="text-[12px] text-[#9A8070] mt-1 font-['Inter']">{item.product.material}</p>
                    )}
                    <p className="text-[14px] font-semibold text-[#3D2C25] mt-2 font-['Inter']">
                      {formatPrice(cartUnitPrice(item))}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <button onClick={() => remove(key)}
                      className="text-[11px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">
                      Удалить
                    </button>
                    <div className="flex items-center border border-[#E8D9C6]">
                      <button onClick={() => updateQty(key, -1)}
                        className="w-8 h-8 flex items-center justify-center text-[#9A8070] hover:text-[#3D2C25] hover:bg-[#F5F5F5] transition-colors text-lg">−</button>
                      <span className="w-10 text-center text-[14px] text-[#3D2C25] font-['Inter']">{item.qty}</span>
                      <button onClick={() => updateQty(key, 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#9A8070] hover:text-[#3D2C25] hover:bg-[#F5F5F5] transition-colors text-lg">+</button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#F5F5F5] p-7 sticky top-28">
                <h3 className="font-['Playfair_Display'] text-2xl text-[#3D2C25] mb-6">Итого</h3>
                <div className="space-y-3 mb-6 text-[13px] font-['Inter']">
                  <div className="flex justify-between text-[#9A8070]">
                    <span>Подытог</span>
                    <span className="text-[#3D2C25]">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#9A8070]">
                    <span>Доставка</span>
                    <span className="text-[#3D2C25]">{delivery === 0 ? 'Бесплатно' : formatPrice(delivery)}</span>
                  </div>
                  {delivery > 0 && (
                    <p className="text-[11px] text-[#9A8070]">Бесплатная доставка от {formatPrice(500000)}</p>
                  )}
                  <div className="border-t border-[#E8D9C6] pt-4 flex justify-between font-bold text-[#3D2C25] text-[16px]">
                    <span>Всего</span>
                    <span>{formatPrice(total + delivery)}</span>
                  </div>
                </div>
                <button onClick={() => setCheckoutOpen(true)}
                  className="group relative w-full bg-[#3D2C25] text-white text-[11px] tracking-[2.5px] uppercase py-4 font-['Inter'] font-bold mb-4 overflow-hidden">
                  <span className="relative z-10 transition-colors duration-300">Оформить заказ</span>
                  <div className="absolute inset-0 bg-[#C4A07A] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </button>
                <Link to="/catalog"
                  className="block text-center text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">
                  Продолжить покупки
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} items={items} total={total} />
    </div>
  );
}
