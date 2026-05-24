import { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import type { Product, Category } from '../../types';
import { T } from '../ui';

/* Resize an uploaded image and return a JPEG data URL (keeps localStorage light) */
function fileToDataURL(file: File, maxDim = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        let { width, height } = image;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas unavailable')); return; }
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      image.onerror = reject;
      image.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── Two-level category selector ─────────────────────────── */
function CategorySelect({ categories, value, onChange, err }: {
  categories: Category[]; value: string; onChange: (v: string) => void; err?: string;
}) {
  const parents       = categories.filter(c => !c.parentId && !c.special);
  const parentOfValue = categories.find(c => c.slug === value && !c.parentId);
  const childOfValue  = categories.find(c => c.slug === value && c.parentId);

  const [selParent, setSelParent] = useState<string>(
    parentOfValue?.id ?? childOfValue?.parentId ?? ''
  );
  const children = categories.filter(c => c.parentId === selParent);

  const sel: React.CSSProperties = {
    width: '100%', border: `1px solid ${err ? '#FCA5A5' : T.border}`,
    background: T.card, padding: '10px 14px', fontSize: 13, color: T.ink,
    outline: 'none', fontFamily: T.font, cursor: 'pointer', borderRadius: T.radiusSm,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <select value={selParent} onChange={e => {
        setSelParent(e.target.value);
        const kids = categories.filter(c => c.parentId === e.target.value);
        const parent = categories.find(c => c.id === e.target.value);
        if (kids.length === 0 && parent) onChange(parent.slug);
        else onChange('');
      }} style={sel}>
        <option value="">Выберите раздел...</option>
        {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {children.length > 0 && (
        <select value={value} onChange={e => onChange(e.target.value)} style={sel}>
          <option value="">Подкатегория...</option>
          {children.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      )}
      {err && <p style={{ fontSize: 11, color: T.danger }}>{err}</p>}
    </div>
  );
}

/* ── Form ─────────────────────────────────────────────────── */
const EMPTY: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
  sku: '', name: '', category: '', price: 0, description: '',
  images: [], material: '', color: '', dimensions: '', inStock: true, badges: [], relatedIds: [],
};

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const { products, create, update } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const existing = products.find(p => p.id === id);
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>(
    existing ? {
      sku: existing.sku, name: existing.name, category: existing.category,
      price: existing.price, oldPrice: existing.oldPrice, description: existing.description,
      images: existing.images, material: existing.material || '',
      color: existing.color || '', dimensions: existing.dimensions || '',
      inStock: existing.inStock, badges: existing.badges, relatedIds: existing.relatedIds || [],
    } : { ...EMPTY }
  );
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: unknown) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const addImage = () => {
    if (imageUrl.trim()) { set('images', [...form.images, imageUrl.trim()]); setImageUrl(''); }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(f => fileToDataURL(f)));
    set('images', [...form.images, ...urls]);
    e.target.value = '';
  };

  const addRelated = (rid: string) => {
    if (rid && !(form.relatedIds || []).includes(rid)) set('relatedIds', [...(form.relatedIds || []), rid]);
  };
  const removeRelated = (rid: string) => set('relatedIds', (form.relatedIds || []).filter(x => x !== rid));

  const toggleBadge = (b: 'new' | 'popular' | 'sale') => {
    set('badges', form.badges.includes(b) ? form.badges.filter(x => x !== b) : [...form.badges, b]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.sku.trim()) e.sku = 'Обязательное';
    if (!form.name.trim()) e.name = 'Обязательное';
    if (!form.category) e.category = 'Выберите категорию';
    if (!form.price || form.price <= 0) e.price = 'Укажите цену';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try { isNew ? create(form) : update(id!, form); navigate('/admin/products'); }
    finally { setSaving(false); }
  };

  /* Styles */
  const card: React.CSSProperties = {
    background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
    boxShadow: T.shadowSm, padding: 26, marginBottom: 16,
  };
  const label: React.CSSProperties = { display: 'block', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, marginBottom: 7, fontWeight: 600 };
  const input = (err?: string): React.CSSProperties => ({
    width: '100%', border: `1px solid ${err ? '#FCA5A5' : T.border}`, background: T.card,
    padding: '10px 14px', fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: T.font, boxSizing: 'border-box', borderRadius: T.radiusSm,
  });
  const sectionHead: React.CSSProperties = {
    fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted,
    fontWeight: 600, borderBottom: `1px solid ${T.line}`, paddingBottom: 12, marginBottom: 18,
  };
  const primaryBtn: React.CSSProperties = {
    background: T.brand, color: '#FFFFFF', border: 'none', padding: '10px 18px',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.font, flexShrink: 0,
    borderRadius: T.radiusSm, transition: 'background 0.2s',
  };

  return (
    <div style={{ padding: 40, maxWidth: 780, fontFamily: T.font }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
        <Link to="/admin/products" style={{ color: T.muted, textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Назад
        </Link>
        <h1 style={{ fontSize: 25, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
          {isNew ? 'Новый товар' : `Редактировать: ${existing?.name}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main info */}
        <div style={card}>
          <p style={sectionHead}>Основная информация</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Артикул *</label>
              <input value={form.sku} onChange={e => set('sku', e.target.value)} style={input(errors.sku)} placeholder="CM-001" />
              {errors.sku && <p style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors.sku}</p>}
            </div>
            <div>
              <label style={label}>Категория *</label>
              <CategorySelect categories={categories} value={form.category} onChange={v => set('category', v)} err={errors.category} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Название *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} style={input(errors.name)} placeholder="Диван Марсель" />
            {errors.name && <p style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors.name}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Цена (₸) *</label>
              <input type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} style={input(errors.price)} placeholder="485000" />
              {errors.price && <p style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors.price}</p>}
            </div>
            <div>
              <label style={label}>Старая цена (₸)</label>
              <input type="number" value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value ? Number(e.target.value) : undefined)} style={input()} placeholder="Опционально" />
            </div>
          </div>

          <div>
            <label style={label}>Описание</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
              style={{ ...input(), resize: 'vertical' }} placeholder="Описание товара..." />
          </div>
        </div>

        {/* Specs */}
        <div style={card}>
          <p style={sectionHead}>Характеристики</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { key: 'material', label: 'Материал', ph: 'Велюр' },
              { key: 'color',    label: 'Цвет',     ph: 'Серый' },
              { key: 'dimensions', label: 'Размер', ph: '240×95×85 см' },
            ].map(f => (
              <div key={f.key}>
                <label style={label}>{f.label}</label>
                <input value={(form as Record<string, unknown>)[f.key] as string || ''}
                  onChange={e => set(f.key as keyof typeof form, e.target.value)}
                  style={input()} placeholder={f.ph} />
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div style={card}>
          <p style={sectionHead}>Изображения</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
              style={{ ...input(), flex: 1 }} placeholder="Вставьте ссылку https://..." />
            <button type="button" onClick={addImage} style={primaryBtn}
              onMouseEnter={e => (e.currentTarget.style.background = T.brandHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
              + Ссылка
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
              padding: '9px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Загрузить с компьютера
            </button>
            <span style={{ fontSize: 12, color: T.muted }}>можно выбрать несколько</span>
          </div>
          {form.images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}
                  onMouseEnter={e => { const btn = e.currentTarget.querySelector('button') as HTMLButtonElement; btn.style.opacity = '1'; }}
                  onMouseLeave={e => { const btn = e.currentTarget.querySelector('button') as HTMLButtonElement; btn.style.opacity = '0'; }}>
                  <img src={img} alt="" style={{ width: 84, height: 84, objectFit: 'cover', background: T.pageBg, borderRadius: T.radiusXs, border: `1px solid ${T.line}` }} />
                  <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                    style={{ position: 'absolute', top: -7, right: -7, background: T.danger, color: '#fff', border: '2px solid #fff', width: 22, height: 22, borderRadius: '50%', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={card}>
          <p style={sectionHead}>Метки</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {[
              { key: 'new',     label: 'Новинка',      checked: form.badges.includes('new') },
              { key: 'popular', label: 'Популярный',   checked: form.badges.includes('popular') },
              { key: 'sale',    label: 'Sale / Скидка', checked: form.badges.includes('sale') },
            ].map(cb => (
              <label key={cb.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={cb.checked}
                  onChange={() => toggleBadge(cb.key as 'new' | 'popular' | 'sale')}
                  style={{ accentColor: T.brand, width: 15, height: 15 }} />
                <span style={{ fontSize: 13, color: T.ink }}>{cb.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Related products */}
        <div style={card}>
          <p style={sectionHead}>Покупают с этим товаром</p>
          <select value="" onChange={e => addRelated(e.target.value)} style={{ ...input(), cursor: 'pointer' }}>
            <option value="">+ Добавить товар...</option>
            {products
              .filter(p => p.id !== id && !(form.relatedIds || []).includes(p.id))
              .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {(form.relatedIds || []).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {(form.relatedIds || []).map(rid => {
                const rp = products.find(p => p.id === rid);
                if (!rp) return null;
                return (
                  <div key={rid} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', border: `1px solid ${T.line}`, borderRadius: T.radiusSm }}>
                    <div style={{ width: 38, height: 38, borderRadius: T.radiusXs, overflow: 'hidden', background: T.pageBg, flexShrink: 0, border: `1px solid ${T.line}` }}>
                      {rp.images[0] && <img src={rp.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <span style={{ flex: 1, fontSize: 13, color: T.ink }}>{rp.name}</span>
                    <button type="button" onClick={() => removeRelated(rid)}
                      style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 18, fontFamily: T.font, lineHeight: 1 }}>
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button type="submit" disabled={saving} style={{
            background: T.brand, color: '#FFFFFF', border: 'none', borderRadius: T.radiusSm,
            fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
            padding: '13px 32px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: T.font, opacity: saving ? 0.6 : 1, transition: 'background 0.2s',
          }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = T.brandHover; }}
            onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
            {saving ? 'Сохранение...' : isNew ? 'Создать товар' : 'Сохранить'}
          </button>
          <Link to="/admin/products" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
            Отменить
          </Link>
        </div>
      </form>
    </div>
  );
}
