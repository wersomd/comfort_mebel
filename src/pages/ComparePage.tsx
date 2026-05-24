import { Link } from 'react-router';
import { useCompare } from '../hooks/useCompare';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

type SpecKey = 'price' | 'sku' | 'category' | 'material' | 'color' | 'dimensions';

interface SpecDef {
  key: SpecKey;
  label: string;
  value: (p: Product) => string;
  raw:   (p: Product) => string | number;
}

export function ComparePage() {
  const { items, remove, clear } = useCompare();
  const { add } = useCart();
  const { categories } = useCategories();

  const catName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug;

  const specs: SpecDef[] = [
    { key: 'price',      label: 'Цена',      value: p => formatPrice(p.price), raw: p => p.price },
    { key: 'sku',        label: 'Артикул',   value: p => p.sku,                raw: p => p.sku },
    { key: 'category',   label: 'Категория', value: p => catName(p.category),  raw: p => p.category },
    { key: 'material',   label: 'Материал',  value: p => p.material   || '—',  raw: p => p.material   || '' },
    { key: 'color',      label: 'Цвет',      value: p => p.color      || '—',  raw: p => p.color      || '' },
    { key: 'dimensions', label: 'Размер',    value: p => p.dimensions || '—',  raw: p => p.dimensions || '' },
  ];

  // Различающиеся характеристики помечаем — чтобы было видно где разница
  const isDifferent = (def: SpecDef) => {
    if (items.length < 2) return false;
    const first = def.raw(items[0]);
    return items.some(p => def.raw(p) !== first);
  };

  const empty = items.length === 0;

  // Адаптивная сетка: 1 на mob, 2 на sm, до 4 на lg
  const gridCols =
    items.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
    items.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' :
    items.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' :
    'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="pt-16 lg:pt-[68px] bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-[#E8D9C6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <nav className="flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] mb-8">
            <Link to="/" className="hover:text-[#3D2C25] transition-colors">Главная</Link>
            <span className="text-[#E8D9C6]">/</span>
            <span className="text-[#3D2C25]">Сравнение</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[3px] uppercase text-[#9A8070] font-['Inter'] mb-4">
                {items.length} / 4
              </p>
              <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl text-[#3D2C25] leading-[0.95] tracking-tight">
                Сравнение
              </h1>
              <p className="text-[14px] text-[#9A8070] font-['Inter'] mt-5 max-w-md">
                Сопоставьте характеристики и выберите идеальный вариант для вашего интерьера.
              </p>
            </div>
            {!empty && (
              <button onClick={clear}
                className="self-start lg:self-end text-[11px] tracking-[2px] uppercase text-[#3D2C25] py-3 px-5 border border-[#3D2C25] hover:bg-[#3D2C25] hover:text-white transition-colors font-['Inter'] font-medium">
                Очистить всё
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        {empty ? (
          <div className="max-w-md mx-auto text-center py-24">
            <div className="mx-auto mb-8 w-20 h-20 border border-[#E8D9C6] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9A8070" strokeWidth="1.5">
                <path d="M16 3l4 4-4 4"/>
                <path d="M20 7H4"/>
                <path d="M8 21l-4-4 4-4"/>
                <path d="M4 17h16"/>
              </svg>
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl text-[#3D2C25] mb-3">
              Список пуст
            </h2>
            <p className="text-[13px] text-[#9A8070] mb-8 font-['Inter'] leading-relaxed">
              Добавьте до четырёх товаров из каталога, чтобы сравнить характеристики бок о бок.
            </p>
            <Link to="/catalog"
              className="inline-block bg-[#3D2C25] text-white text-[11px] tracking-[2px] uppercase py-4 px-8 font-['Inter'] font-bold hover:bg-[#9A8070] transition-colors">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${gridCols} gap-6 lg:gap-8`}>
            {items.map(p => (
              <article key={p.id} className="group flex flex-col bg-white border border-[#E8D9C6] hover:border-[#3D2C25] transition-colors duration-300">
                {/* Image */}
                <div className="relative bg-[#F5F5F5] overflow-hidden" style={{ aspectRatio: '4/5' }}>
                  <button onClick={() => remove(p.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm text-[#9A8070] hover:text-[#3D2C25] hover:bg-white flex items-center justify-center transition-colors"
                    aria-label="Убрать">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                  <Link to={`/product/${p.id}`} className="block w-full h-full">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9A8070" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="1"/>
                          <path d="m3 9 4-4 4 4 4-4 4 4"/>
                          <circle cx="8.5" cy="13.5" r="1.5"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 lg:p-6">
                  <Link to={`/product/${p.id}`} className="block mb-1">
                    <p className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] mb-2">{p.sku}</p>
                    <h3 className="font-['Playfair_Display'] text-[20px] lg:text-[22px] text-[#3D2C25] group-hover:text-[#9A8070] transition-colors leading-tight">
                      {p.name}
                    </h3>
                  </Link>

                  {/* Specs */}
                  <dl className="mt-5 mb-6 space-y-3 flex-1">
                    {specs.filter(s => s.key !== 'sku').map(s => {
                      const different = isDifferent(s);
                      return (
                        <div key={s.key} className="grid grid-cols-[88px_1fr] items-baseline gap-3 pb-3 border-b border-[#F0E6D9] last:border-b-0">
                          <dt className="text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] font-semibold">
                            {s.label}
                          </dt>
                          <dd className={`text-[13px] font-['Inter'] leading-snug ${
                            different ? 'text-[#3D2C25] font-semibold' : 'text-[#3D2C25]/70'
                          }`}>
                            {s.key === 'price'
                              ? <span className={different ? 'text-[16px]' : 'text-[15px]'}>{s.value(p)}</span>
                              : s.value(p)}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>

                  {/* Action */}
                  <button onClick={() => add(p)}
                    className="w-full bg-[#3D2C25] text-white text-[10px] tracking-[2px] uppercase py-3.5 font-['Inter'] font-bold hover:bg-[#9A8070] transition-colors">
                    В корзину
                  </button>
                </div>
              </article>
            ))}

            {/* Empty slots — placeholders to fill up to 4 */}
            {items.length > 0 && items.length < 4 && Array.from({ length: Math.min(4 - items.length, 4 - items.length) }).map((_, i) => (
              <Link key={`slot-${i}`} to="/catalog"
                className="hidden lg:flex flex-col items-center justify-center border border-dashed border-[#E8D9C6] hover:border-[#3D2C25] transition-colors group min-h-[420px]">
                <div className="w-12 h-12 border border-[#E8D9C6] group-hover:border-[#3D2C25] flex items-center justify-center mb-4 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A8070" strokeWidth="1.5" className="group-hover:stroke-[#3D2C25] transition-colors">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <p className="text-[11px] tracking-[2px] uppercase text-[#9A8070] group-hover:text-[#3D2C25] font-['Inter'] transition-colors">
                  Добавить товар
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Hint about highlighted differences */}
        {!empty && items.length >= 2 && (
          <p className="mt-10 text-center text-[12px] text-[#9A8070] font-['Inter']">
            Отличающиеся характеристики выделены тёмным
          </p>
        )}
      </div>
    </div>
  );
}
