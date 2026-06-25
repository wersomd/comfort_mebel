import { useState } from 'react';
import { Link } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice, nextSku } from '../../lib/utils';
import { exportProductsToExcel } from '../../lib/excel';
import type { Product } from '../../types';
import { T } from '../ui';

export function AdminProducts() {
  const { products, remove, removeMany, create } = useProducts();
  const { categories } = useCategories();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const catName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug;

  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  const handleDeleteSelected = () => { removeMany([...selected]); setSelected(new Set()); };
  const handleDelete = (id: string) => { remove(id); setConfirmDelete(null); };

  const handleDuplicate = async (p: Product) => {
    if (duplicating) return;
    setDuplicating(p.id);
    try {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = p;
      void _id; void _c; void _u;
      await create({ ...rest, name: `${p.name} (копия)`, sku: nextSku(products.map(x => x.sku)) });
    } catch (err) {
      console.error('duplicate failed', err);
      alert('Не удалось дублировать товар.');
    } finally {
      setDuplicating(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    border: `1px solid ${T.border}`, background: T.card, padding: '10px 14px',
    fontSize: 13, color: T.ink, outline: 'none', fontFamily: T.font, borderRadius: T.radiusSm,
  };
  const th: React.CSSProperties = {
    padding: '13px 18px', textAlign: 'left', fontSize: 10, letterSpacing: 1,
    textTransform: 'uppercase', color: T.muted, fontWeight: 600,
  };
  const td: React.CSSProperties = { padding: '12px 18px' };

  return (
    <div style={{ padding: 40, fontFamily: T.font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 5, letterSpacing: -0.3 }}>Товары</h1>
          <p style={{ fontSize: 13.5, color: T.muted }}>{products.length} позиций в каталоге</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => exportProductsToExcel(products, categories)}
            disabled={products.length === 0}
            style={{
              background: T.card, color: T.brand, border: `1px solid ${T.brand}`,
              borderRadius: T.radiusSm,
              fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
              padding: '11px 18px', fontWeight: 600,
              cursor: products.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: T.font, opacity: products.length === 0 ? 0.5 : 1,
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}
            title={`Скачать ${products.length} товаров в Excel`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Скачать Excel
          </button>
          <Link to="/admin/products/new" style={{
            background: T.brand, color: '#FFFFFF', textDecoration: 'none',
            fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
            padding: '12px 22px', fontWeight: 600, borderRadius: T.radiusSm, transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = T.brandHover)}
            onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
            + Добавить товар
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        <input type="text" placeholder="Поиск по названию или артикулу..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="all">Все категории</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        {selected.size > 0 && (
          <button onClick={handleDeleteSelected} style={{
            background: T.danger, color: '#FFFFFF', border: 'none', borderRadius: T.radiusSm,
            fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase',
            padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
          }}>
            Удалить ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.pageBg }}>
              <th style={{ ...th, width: 48 }}>
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} style={{ accentColor: T.brand }} />
              </th>
              {['Фото', 'Артикул', 'Название', 'Категория', 'Цена', 'Действия'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: T.muted, fontSize: 13 }}>Товары не найдены</td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} style={{
                borderBottom: `1px solid ${T.line}`,
                background: selected.has(p.id) ? T.pageBg : T.card,
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => { if (!selected.has(p.id)) e.currentTarget.style.background = T.pageBg; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected.has(p.id) ? T.pageBg : T.card; }}>
                <td style={td}>
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} style={{ accentColor: T.brand }} />
                </td>
                <td style={td}>
                  <div style={{ width: 44, height: 44, background: T.pageBg, borderRadius: T.radiusXs, overflow: 'hidden', border: `1px solid ${T.line}` }}>
                    {p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                </td>
                <td style={{ ...td, color: T.faint, fontSize: 12 }}>{p.sku}</td>
                <td style={{ ...td, color: T.ink, fontWeight: 500 }}>{p.name}</td>
                <td style={{ ...td, color: T.muted }}>{catName(p.category)}</td>
                <td style={{ ...td, color: T.ink, fontWeight: 600 }}>{formatPrice(p.price)}</td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Link to={`/admin/products/${p.id}`} style={{ color: T.brand, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                      Изменить
                    </Link>
                    <button onClick={() => handleDuplicate(p)} disabled={duplicating === p.id}
                      style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: duplicating === p.id ? 'wait' : 'pointer', fontFamily: T.font, transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.brand)}
                      onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                      {duplicating === p.id ? '...' : 'Дублировать'}
                    </button>
                    {confirmDelete === p.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => handleDelete(p.id)} style={{ fontSize: 12, color: T.danger, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>Да</button>
                        <span style={{ color: T.faint }}>/</span>
                        <button onClick={() => setConfirmDelete(null)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Нет</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(p.id)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.danger)}
                        onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                        Удалить
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
