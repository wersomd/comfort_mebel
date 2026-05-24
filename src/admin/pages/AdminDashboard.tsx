import { Link } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice } from '../../lib/utils';
import { T } from '../ui';

export function AdminDashboard() {
  const { products } = useProducts();
  const { categories } = useCategories();

  const stats = [
    { label: 'Всего товаров', value: products.length, to: '/admin/products' },
    { label: 'Категорий', value: categories.length, to: '/admin/categories' },
    { label: 'Новинки', value: products.filter(p => p.badges.includes('new')).length, to: '/admin/products' },
    { label: 'Со скидкой', value: products.filter(p => p.badges.includes('sale')).length, to: '/admin/products' },
  ];

  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const card: React.CSSProperties = {
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: T.radius, boxShadow: T.shadowSm,
  };

  return (
    <div style={{ padding: 40, fontFamily: T.font }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 5, letterSpacing: -0.3 }}>Дашборд</h1>
        <p style={{ fontSize: 13.5, color: T.muted }}>Обзор каталога Comfort Mebel</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {stats.map(s => (
          <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
            <div style={{ ...card, padding: '22px 24px', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <p style={{ fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, marginBottom: 12, fontWeight: 600 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 36, fontWeight: 600, color: T.ink, lineHeight: 1, letterSpacing: -0.5 }}>
                {s.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent */}
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>Последние товары</h3>
            <Link to="/admin/products/new" style={{ fontSize: 12.5, fontWeight: 600, color: T.brand, textDecoration: 'none' }}>
              + Добавить
            </Link>
          </div>
          <div>
            {recent.map(p => (
              <Link key={p.id} to={`/admin/products/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', margin: '0 -10px', borderRadius: T.radiusSm, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.pageBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 40, height: 40, background: T.pageBg, borderRadius: T.radiusXs, overflow: 'hidden', flexShrink: 0, border: `1px solid ${T.line}` }}>
                    {p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: T.ink, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: T.faint }}>{p.sku}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.brand, flexShrink: 0 }}>{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
            {recent.length === 0 && <p style={{ fontSize: 13, color: T.muted, padding: '16px 0', textAlign: 'center' }}>Нет товаров</p>}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ ...card, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 16 }}>Быстрые действия</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Добавить товар', desc: 'Новая позиция каталога', to: '/admin/products/new' },
              { label: 'Категории', desc: 'Редактировать структуру', to: '/admin/categories' },
              { label: 'Импорт Excel', desc: 'Загрузить файл МойСклад', to: '/admin/import' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  border: `1px solid ${T.border}`, borderRadius: T.radiusMd, transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.pageBg; e.currentTarget.style.boxShadow = T.shadowSm; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.card; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{a.label}</p>
                    <p style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{a.desc}</p>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.faint} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
