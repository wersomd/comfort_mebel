import { useSearchParams } from 'react-router';
import type { Category, SortOption } from '../types';

interface Props { categories: Category[]; }

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default',    label: 'По умолчанию' },
  { value: 'price_asc',  label: 'Сначала дешёвые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'new',        label: 'Новинки' },
  { value: 'popular',    label: 'Популярные' },
];

export function FilterBar({ categories }: Props) {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || 'all';
  const activeSort     = (params.get('sort') as SortOption) || 'default';
  const priceMin       = params.get('priceMin') || '';
  const priceMax       = params.get('priceMax') || '';

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'default') next.delete(key);
    else next.set(key, value);
    setParams(next);
  };
  const clearAll = () => setParams({});
  const hasFilters =
    activeCategory !== 'all' || !!priceMin || !!priceMax ||
    activeSort !== 'default' || !!params.get('search');

  const special    = categories.filter(c => c.special);
  const topLevel   = categories.filter(c => !c.parentId && !c.special).sort((a, b) => a.order - b.order);
  const childrenOf = (id: string) => categories.filter(c => c.parentId === id).sort((a, b) => a.order - b.order);
  const activeCat  = categories.find(c => c.slug === activeCategory);
  const activeRoot = activeCat?.parentId ?? activeCat?.id;

  const heading = "text-[10px] tracking-[2.5px] uppercase text-[#9A8070] font-['Inter'] font-semibold";
  const itemBtn = (active: boolean, small = false) =>
    `text-left ${small ? 'text-[12px]' : 'text-[13px]'} font-['Inter'] transition-colors duration-150 ${
      active ? 'text-[#3D2C25] font-semibold' : 'text-[#9A8070] hover:text-[#3D2C25]'
    }`;
  const priceInput =
    "w-full bg-transparent border-b border-[#E8D9C6] pb-1.5 text-[13px] text-[#3D2C25] " +
    "placeholder:text-[#9A8070] focus:outline-none focus:border-[#3D2C25] transition-colors font-['Inter']";

  return (
    <div className="flex flex-col gap-9">
      {/* Categories */}
      <div>
        <h3 className={heading}>Категории</h3>
        <ul className="flex flex-col gap-2.5 mt-4">
          <li>
            <button onClick={() => setParam('category', 'all')} className={itemBtn(activeCategory === 'all')}>
              Все товары
            </button>
          </li>
          {special.map(cat => (
            <li key={cat.id}>
              <button onClick={() => setParam('category', cat.slug)} className={itemBtn(activeCategory === cat.slug)}>
                {cat.name}
              </button>
            </li>
          ))}
          {topLevel.map(cat => {
            const subs = childrenOf(cat.id);
            const showSubs = subs.length > 0 && activeRoot === cat.id;
            return (
              <li key={cat.id} className="flex flex-col gap-2.5">
                <button onClick={() => setParam('category', cat.slug)} className={itemBtn(activeCategory === cat.slug)}>
                  {cat.name}
                </button>
                {showSubs && (
                  <ul className="flex flex-col gap-2.5 ml-3 pl-3 border-l border-[#E8D9C6]">
                    {subs.map(sub => (
                      <li key={sub.id}>
                        <button onClick={() => setParam('category', sub.slug)} className={itemBtn(activeCategory === sub.slug, true)}>
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className={heading}>Цена, ₸</h3>
        <div className="flex items-center gap-3 mt-4">
          <input type="number" inputMode="numeric" placeholder="От" value={priceMin}
            onChange={e => setParam('priceMin', e.target.value)} className={priceInput} />
          <span className="text-[#9A8070] text-xs">—</span>
          <input type="number" inputMode="numeric" placeholder="До" value={priceMax}
            onChange={e => setParam('priceMax', e.target.value)} className={priceInput} />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className={heading}>Сортировка</h3>
        <ul className="flex flex-col gap-2.5 mt-4">
          {SORT_OPTIONS.map(o => (
            <li key={o.value}>
              <button onClick={() => setParam('sort', o.value)} className={itemBtn(activeSort === o.value)}>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hasFilters && (
        <button onClick={clearAll}
          className="self-start text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] border-b border-[#3D2C25] pb-0.5 hover:text-[#9A8070] hover:border-[#9A8070] transition-colors duration-200 font-['Inter']">
          Сбросить всё
        </button>
      )}
    </div>
  );
}
