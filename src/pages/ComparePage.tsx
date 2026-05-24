import { Link } from 'react-router';
import { useCompare } from '../hooks/useCompare';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import { formatPrice } from '../lib/utils';

export function ComparePage() {
  const { items, remove, clear } = useCompare();
  const { add } = useCart();
  const { categories } = useCategories();

  const catName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug;

  const rows: { label: string; value: (p: typeof items[number]) => string }[] = [
    { label: 'Цена',      value: p => formatPrice(p.price) },
    { label: 'Артикул',   value: p => p.sku },
    { label: 'Категория', value: p => catName(p.category) },
    { label: 'Материал',  value: p => p.material || '—' },
    { label: 'Цвет',      value: p => p.color || '—' },
    { label: 'Размер',    value: p => p.dimensions || '—' },
  ];

  return (
    <div className="pt-16 lg:pt-[68px] bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-[#E8D9C6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] mb-6">
            <Link to="/" className="hover:text-[#3D2C25] transition-colors">Главная</Link>
            <span className="text-[#E8D9C6]">/</span>
            <span className="text-[#3D2C25]">Сравнение</span>
          </nav>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="font-['Playfair_Display'] text-4xl lg:text-6xl text-[#3D2C25] leading-[1.05]">Сравнение</h1>
              <p className="text-[12px] text-[#9A8070] font-['Inter'] mt-3 tracking-[0.5px]">{items.length} из 4 товаров</p>
            </div>
            {items.length > 0 && (
              <button onClick={clear}
                className="text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] border-b border-[#3D2C25] pb-0.5 hover:text-[#9A8070] hover:border-[#9A8070] transition-colors font-['Inter']">
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        {items.length === 0 ? (
          <div className="text-center py-28 border border-dashed border-[#E8D9C6]">
            <p className="text-[13px] text-[#9A8070] mb-6 font-['Inter']">Список сравнения пуст</p>
            <Link to="/catalog"
              className="text-[11px] tracking-[2px] uppercase text-[#3D2C25] border-b border-[#3D2C25] pb-0.5 hover:text-[#9A8070] hover:border-[#9A8070] transition-colors font-['Inter']">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="border-collapse" style={{ minWidth: 'min-content' }}>
              <tbody>
                {/* Product header row */}
                <tr>
                  <td className="align-bottom border-b border-[#E8D9C6] p-4" style={{ width: 150 }} />
                  {items.map(p => (
                    <td key={p.id} className="align-bottom border-b border-l border-[#E8D9C6] p-4" style={{ width: 250 }}>
                      <div className="flex justify-end mb-2">
                        <button onClick={() => remove(p.id)}
                          className="text-[#9A8070] hover:text-[#3D2C25] transition-colors"
                          aria-label="Убрать">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <Link to={`/product/${p.id}`} className="group block">
                        <div className="bg-[#F5F5F5] overflow-hidden mb-3" style={{ aspectRatio: '4/5' }}>
                          {p.images[0] && (
                            <img src={p.images[0]} alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          )}
                        </div>
                        <h3 className="font-['Playfair_Display'] text-[15px] text-[#3D2C25] group-hover:text-[#9A8070] transition-colors leading-snug">
                          {p.name}
                        </h3>
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Attribute rows */}
                {rows.map(row => (
                  <tr key={row.label}>
                    <td className="border-b border-[#E8D9C6] p-4 text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] font-semibold align-top">
                      {row.label}
                    </td>
                    {items.map(p => (
                      <td key={p.id} className="border-b border-l border-[#E8D9C6] p-4 text-[13px] text-[#3D2C25] font-['Inter'] align-top">
                        {row.value(p)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Action row */}
                <tr>
                  <td className="p-4" />
                  {items.map(p => (
                    <td key={p.id} className="border-l border-[#E8D9C6] p-4">
                      <button onClick={() => add(p)}
                        className="w-full bg-[#3D2C25] text-white text-[10px] tracking-[2px] uppercase py-3 font-['Inter'] font-bold hover:bg-[#9A8070] transition-colors">
                        В корзину
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
