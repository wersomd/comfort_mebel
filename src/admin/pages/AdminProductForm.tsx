import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { uploadImage } from '../../lib/upload';
import { nextSku } from '../../lib/utils';
import type { Product, Category } from '../../types';
import { T } from '../ui';

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

  // Выбран ли parent (для текущего value)?
  const parent = categories.find(c => c.id === selParent);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <select value={selParent} onChange={e => {
        const pid = e.target.value;
        setSelParent(pid);
        // Сразу подставляем slug родителя — подкатегорию можно выбрать опционально
        const p = categories.find(c => c.id === pid);
        onChange(p ? p.slug : '');
      }} style={sel}>
        <option value="">Выберите раздел...</option>
        {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {children.length > 0 && (
        <select
          value={parent && value === parent.slug ? '' : value}
          onChange={e => onChange(e.target.value || (parent ? parent.slug : ''))}
          style={sel}>
          <option value="">Подкатегория (опционально)</option>
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
  images: [], material: '', color: '', dimensions: '', badges: [], relatedIds: [],
  stock: null, colors: [], sizes: [],
};

function newColorId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function newSizeId(): string {
  return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Sortable image grid (drag-and-drop) ───────────────────── */
interface SortableImageGridProps {
  images: string[];
  onChange: (next: string[]) => void;
  thumbSize?: number;
  hint?: string;
}

function SortableImageGrid({ images, onChange, thumbSize = 84, hint }: SortableImageGridProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {images.map((img, i) => (
          <div key={`${img}-${i}`}
            draggable
            onDragStart={e => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move'; }}
            onDragOver={e => { e.preventDefault(); setOverIdx(i); }}
            onDragLeave={() => setOverIdx(null)}
            onDrop={() => { if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            style={{
              position: 'relative',
              cursor: 'grab',
              opacity: dragIdx === i ? 0.4 : 1,
              outline: overIdx === i && dragIdx !== i ? `2px solid ${T.brand}` : 'none',
              outlineOffset: 2,
              borderRadius: T.radiusXs,
              transition: 'opacity 0.15s, outline-color 0.15s',
            }}
            onMouseEnter={e => { const btn = e.currentTarget.querySelector('button') as HTMLButtonElement | null; if (btn) btn.style.opacity = '1'; }}
            onMouseLeave={e => { const btn = e.currentTarget.querySelector('button') as HTMLButtonElement | null; if (btn) btn.style.opacity = '0'; }}>
            <img src={img} alt="" draggable={false}
              style={{ width: thumbSize, height: thumbSize, objectFit: 'cover', background: T.pageBg, borderRadius: T.radiusXs, border: `1px solid ${T.line}`, display: 'block' }} />
            {/* Бейдж "1/N" — главное фото */}
            <span style={{
              position: 'absolute', top: 4, left: 4,
              background: i === 0 ? T.brand : 'rgba(255,255,255,0.92)',
              color: i === 0 ? '#fff' : T.ink,
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
              letterSpacing: 0.3,
            }}>
              {i === 0 ? 'Главное' : `${i + 1}`}
            </span>
            <button type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              onMouseDown={e => e.stopPropagation()}
              style={{ position: 'absolute', top: -7, right: -7, background: T.danger, color: '#fff', border: '2px solid #fff', width: 22, height: 22, borderRadius: '50%', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s', lineHeight: 1 }}>
              ×
            </button>
          </div>
        ))}
      </div>
      {(hint || images.length > 1) && (
        <p style={{ fontSize: 11, color: T.faint, marginTop: 8 }}>
          {hint || 'Перетаскивайте мышкой чтобы менять порядок. Первое фото — главное.'}
        </p>
      )}
    </div>
  );
}

/* ── Color variant row ─────────────────────────────────────── */
interface ColorRowProps {
  c: { id: string; name: string; hex: string; images: string[]; stock?: number | null; material?: string | null };
  uploading: boolean;
  onChange: (patch: Partial<ColorRowProps['c']>) => void;
  onRemove: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ColorRow({ c, uploading, onChange, onRemove, onFiles }: ColorRowProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputBase: React.CSSProperties = {
    border: `1px solid ${T.border}`, background: T.card,
    padding: '9px 12px', fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: T.font, borderRadius: T.radiusSm, width: '100%', boxSizing: 'border-box',
  };
  const tinyLabel: React.CSSProperties = {
    display: 'block', fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase',
    color: T.muted, marginBottom: 6, fontWeight: 600,
  };

  return (
    <div style={{
      background: T.pageBg, border: `1px solid ${T.border}`,
      borderRadius: T.radiusSm, padding: 16,
    }}>
      {/* Первый ряд: свотч + название + остаток + удалить */}
      <div style={{ display: 'grid', gridTemplateColumns: '52px 1.8fr 1fr auto', gap: 12, alignItems: 'end', marginBottom: 12 }}>
        <div>
          <label style={tinyLabel}>Цвет</label>
          <input type="color" value={c.hex || '#888888'}
            onChange={e => onChange({ hex: e.target.value })}
            title="Нажмите чтобы выбрать оттенок"
            style={{ width: 52, height: 36, border: `1px solid ${T.border}`, borderRadius: T.radiusXs, cursor: 'pointer', padding: 0, background: 'none' }} />
        </div>
        <div>
          <label style={tinyLabel}>Название цвета</label>
          <input type="text" value={c.name} onChange={e => onChange({ name: e.target.value })}
            placeholder="Серый" style={inputBase} />
        </div>
        <div>
          <label style={tinyLabel}>Остаток (шт.)</label>
          <input type="number" min="0" value={c.stock ?? ''}
            onChange={e => onChange({ stock: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Не учитываем" style={inputBase} />
        </div>
        <button type="button" onClick={onRemove}
          style={{ background: 'none', border: 'none', color: T.danger, fontSize: 12, cursor: 'pointer', fontFamily: T.font, padding: '9px 4px' }}>
          Удалить
        </button>
      </div>

      {/* Второй ряд: материал именно этого варианта */}
      <div style={{ marginBottom: 12 }}>
        <label style={tinyLabel}>Материал этого варианта (необязательно)</label>
        <input type="text"
          value={c.material ?? ''}
          onChange={e => onChange({ material: e.target.value || null })}
          placeholder="Например: Велюр. Если пусто — берётся материал товара выше."
          style={inputBase} />
      </div>

      {/* Images */}
      <div>
        <label style={tinyLabel}>Фото варианта</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
            padding: '7px 13px', fontSize: 12, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: T.font,
            opacity: uploading ? 0.6 : 1,
          }}>
            {uploading ? 'Загрузка...' : '+ Фото с компьютера'}
          </button>
          {c.images.length > 0 && (
            <span style={{ fontSize: 11.5, color: T.muted }}>{c.images.length} фото</span>
          )}
        </div>
        <SortableImageGrid
          images={c.images}
          thumbSize={68}
          onChange={next => onChange({ images: next })}
          hint="Перетаскивайте чтобы менять порядок. Первое фото показывается при выборе этого цвета."
        />
      </div>
    </div>
  );
}

/* ── Size variant row ──────────────────────────────────────── */
interface SizeRowProps {
  s: { id: string; label: string; dimensions?: string | null; price?: number | null; oldPrice?: number | null; images?: string[]; stock?: number | null };
  uploading: boolean;
  onChange: (patch: Partial<SizeRowProps['s']>) => void;
  onRemove: () => void;
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SizeRow({ s, uploading, onChange, onRemove, onFiles }: SizeRowProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputBase: React.CSSProperties = {
    border: `1px solid ${T.border}`, background: T.card,
    padding: '9px 12px', fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: T.font, borderRadius: T.radiusSm, width: '100%', boxSizing: 'border-box',
  };
  const tinyLabel: React.CSSProperties = {
    display: 'block', fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase',
    color: T.muted, marginBottom: 6, fontWeight: 600,
  };
  const images = s.images ?? [];

  return (
    <div style={{ background: T.pageBg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: 16 }}>
      {/* Первый ряд: название + габариты + остаток + удалить */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr auto', gap: 12, alignItems: 'end', marginBottom: 12 }}>
        <div>
          <label style={tinyLabel}>Название размера</label>
          <input type="text" value={s.label} onChange={e => onChange({ label: e.target.value })}
            placeholder="Угловой" style={inputBase} />
        </div>
        <div>
          <label style={tinyLabel}>Габариты</label>
          <input type="text" value={s.dimensions ?? ''} onChange={e => onChange({ dimensions: e.target.value || null })}
            placeholder="300×200×85 см" style={inputBase} />
        </div>
        <div>
          <label style={tinyLabel}>Остаток (шт.)</label>
          <input type="number" min="0" value={s.stock ?? ''}
            onChange={e => onChange({ stock: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Не учитываем" style={inputBase} />
        </div>
        <button type="button" onClick={onRemove}
          style={{ background: 'none', border: 'none', color: T.danger, fontSize: 12, cursor: 'pointer', fontFamily: T.font, padding: '9px 4px' }}>
          Удалить
        </button>
      </div>

      {/* Второй ряд: цена + старая цена */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={tinyLabel}>Цена этого размера (₸)</label>
          <input type="number" min="0" value={s.price ?? ''}
            onChange={e => onChange({ price: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Пусто = базовая цена товара" style={inputBase} />
        </div>
        <div>
          <label style={tinyLabel}>Старая цена (₸)</label>
          <input type="number" min="0" value={s.oldPrice ?? ''}
            onChange={e => onChange({ oldPrice: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Для скидки (опц.)" style={inputBase} />
        </div>
      </div>

      {/* Images (опционально) */}
      <div>
        <label style={tinyLabel}>Фото размера (опционально — иначе берутся фото цвета/товара)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
            padding: '7px 13px', fontSize: 12, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: T.font,
            opacity: uploading ? 0.6 : 1,
          }}>
            {uploading ? 'Загрузка...' : '+ Фото с компьютера'}
          </button>
          {images.length > 0 && <span style={{ fontSize: 11.5, color: T.muted }}>{images.length} фото</span>}
        </div>
        <SortableImageGrid
          images={images}
          thumbSize={68}
          onChange={next => onChange({ images: next })}
          hint="Перетаскивайте чтобы менять порядок. Первое фото показывается при выборе этого размера."
        />
      </div>
    </div>
  );
}

/* ── Палитра готовых цветов (клиенту не надо знать HEX) ─────── */
const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: 'Белый',       hex: '#FFFFFF' },
  { name: 'Бежевый',     hex: '#E8D9C6' },
  { name: 'Серый',       hex: '#9AA0A6' },
  { name: 'Тёмно-серый', hex: '#4A4A4A' },
  { name: 'Чёрный',      hex: '#1A1A1A' },
  { name: 'Коричневый',  hex: '#6B4226' },
  { name: 'Синий',       hex: '#3B5BA5' },
  { name: 'Зелёный',     hex: '#4E7C59' },
  { name: 'Жёлтый',      hex: '#E6B800' },
  { name: 'Красный',     hex: '#B3402F' },
  { name: 'Розовый',     hex: '#D9A7B0' },
  { name: 'Бирюзовый',   hex: '#3FA7A0' },
];

/* ── Сворачиваемый блок (прогрессивное раскрытие формы) ─────── */
function Collapsible({ title, hint, defaultOpen = false, children }: {
  title: string; hint?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, marginBottom: 16, overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'none', border: 'none', padding: '20px 26px', cursor: 'pointer', fontFamily: T.font, textAlign: 'left' }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{title}</p>
          {hint && <p style={{ fontSize: 11.5, color: T.faint, marginTop: 4 }}>{hint}</p>}
        </div>
        <span style={{ color: T.muted, fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', lineHeight: 1 }}>⌄</span>
      </button>
      {open && <div style={{ padding: '0 26px 26px' }}>{children}</div>}
    </div>
  );
}

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const { products, loading, create, update } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const existing = products.find(p => p.id === id);
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({ ...EMPTY });
  const [hydrated, setHydrated] = useState(isNew);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Когда товары загрузились — заполняем форму данными редактируемого товара
  useEffect(() => {
    if (isNew || hydrated) return;
    if (existing) {
      setForm({
        sku: existing.sku,
        name: existing.name,
        category: existing.category,
        price: existing.price,
        oldPrice: existing.oldPrice,
        description: existing.description,
        images: existing.images,
        material: existing.material || '',
        color: existing.color || '',
        dimensions: existing.dimensions || '',
        badges: existing.badges,
        relatedIds: existing.relatedIds || [],
        stock: existing.stock ?? null,
        colors: existing.colors ?? [],
        sizes: existing.sizes ?? [],
      });
      setHydrated(true);
    }
  }, [existing, isNew, hydrated]);

  const set = (key: keyof typeof form, value: unknown) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const addImage = () => {
    if (imageUrl.trim()) { set('images', [...form.images, imageUrl.trim()]); setImageUrl(''); }
  };

  const [uploading, setUploading] = useState(false);
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const folder = `products/${form.sku || existing?.id || 'new'}`;
      const urls = await Promise.all(files.map(f => uploadImage(f, folder, 1400)));
      set('images', [...form.images, ...urls]);
    } catch (err) {
      console.error('upload failed', err);
      alert('Не удалось загрузить фото. Войдите в админку и попробуйте снова.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addRelated = (rid: string) => {
    if (rid && !(form.relatedIds || []).includes(rid)) set('relatedIds', [...(form.relatedIds || []), rid]);
  };
  const removeRelated = (rid: string) => set('relatedIds', (form.relatedIds || []).filter(x => x !== rid));

  /* ── Цветовые варианты ───────────────────────────────────── */
  const colors = form.colors || [];
  const updateColor = (cid: string, patch: Partial<typeof colors[number]>) =>
    set('colors', colors.map(c => c.id === cid ? { ...c, ...patch } : c));
  const addColor = (preset?: { name: string; hex: string }) =>
    set('colors', [...colors, { id: newColorId(), name: preset?.name ?? '', hex: preset?.hex ?? '#888888', images: [], stock: null, material: null }]);
  const removeColor = (cid: string) => set('colors', colors.filter(c => c.id !== cid));

  const [uploadingColor, setUploadingColor] = useState<string | null>(null);
  const handleColorFiles = async (cid: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingColor(cid);
    try {
      const folder = `products/${form.sku || existing?.id || 'new'}/colors/${cid}`;
      const urls = await Promise.all(files.map(f => uploadImage(f, folder, 1400)));
      const current = colors.find(c => c.id === cid);
      if (current) updateColor(cid, { images: [...current.images, ...urls] });
    } catch (err) {
      console.error('color upload failed', err);
      alert('Не удалось загрузить фото варианта.');
    } finally {
      setUploadingColor(null);
      e.target.value = '';
    }
  };

  /* ── Размерные варианты ──────────────────────────────────── */
  const sizes = form.sizes || [];
  const updateSize = (sid: string, patch: Partial<typeof sizes[number]>) =>
    set('sizes', sizes.map(s => s.id === sid ? { ...s, ...patch } : s));
  const addSize = () => set('sizes', [...sizes, { id: newSizeId(), label: '', dimensions: null, price: null, oldPrice: null, images: [], stock: null }]);
  const removeSize = (sid: string) => set('sizes', sizes.filter(s => s.id !== sid));

  const [uploadingSize, setUploadingSize] = useState<string | null>(null);
  const handleSizeFiles = async (sid: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingSize(sid);
    try {
      const folder = `products/${form.sku || existing?.id || 'new'}/sizes/${sid}`;
      const urls = await Promise.all(files.map(f => uploadImage(f, folder, 1400)));
      const current = sizes.find(s => s.id === sid);
      if (current) updateSize(sid, { images: [...(current.images ?? []), ...urls] });
    } catch (err) {
      console.error('size upload failed', err);
      alert('Не удалось загрузить фото размера.');
    } finally {
      setUploadingSize(null);
      e.target.value = '';
    }
  };

  const toggleBadge = (b: 'new' | 'popular' | 'sale') => {
    set('badges', form.badges.includes(b) ? form.badges.filter(x => x !== b) : [...form.badges, b]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
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
    try {
      // Артикул вручную не вводится — если пуст, генерируем автоматически
      const sku = form.sku.trim() || nextSku(products.map(p => p.sku));
      const payload = { ...form, sku };
      if (isNew) await create(payload);
      else await update(id!, payload);
      navigate('/admin/products');
    } catch (err) {
      console.error('save failed', err);
      alert('Не удалось сохранить. Проверьте подключение и права доступа.');
    } finally {
      setSaving(false);
    }
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

  // При редактировании: пока товары грузятся (или ещё не нашли нужный) — скелетон
  if (!isNew && !hydrated) {
    return (
      <div style={{ padding: 40, maxWidth: 780, fontFamily: T.font }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
          <Link to="/admin/products" style={{ color: T.muted, textDecoration: 'none', fontSize: 13 }}>← Назад</Link>
          <h1 style={{ fontSize: 25, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Загрузка...</h1>
        </div>
        {!loading && !existing ? (
          <p style={{ color: T.muted, fontSize: 13 }}>
            Товар не найден. <Link to="/admin/products" style={{ color: T.brand }}>Вернуться к списку</Link>
          </p>
        ) : (
          <div style={{ height: 200, background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, animation: 'pulse 1.4s ease-in-out infinite' }} />
        )}
      </div>
    );
  }

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
        {/* Главное */}
        <div style={card}>
          <p style={sectionHead}>Главное</p>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Название товара *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              style={{ ...input(errors.name), fontSize: 15, padding: '12px 14px' }} placeholder="Диван Марсель" />
            {errors.name && <p style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Категория *</label>
            <CategorySelect categories={categories} value={form.category} onChange={v => set('category', v)} err={errors.category} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={label}>Цена (₸) *</label>
              <input type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} style={input(errors.price)} placeholder="485000" />
              {errors.price && <p style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors.price}</p>}
            </div>
            <div>
              <label style={label}>Старая цена (₸)</label>
              <input type="number" value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value ? Number(e.target.value) : undefined)} style={input()} placeholder="Если есть скидка" />
            </div>
            <div>
              <label style={label}>Остаток (шт.)</label>
              <input type="number" min="0" value={form.stock ?? ''} onChange={e => set('stock', e.target.value === '' ? null : Number(e.target.value))} style={input()} placeholder="Пусто = всегда в наличии" />
              <p style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>0 — нет в наличии. Игнорируется если есть цвета.</p>
            </div>
          </div>

          <div>
            <label style={label}>Описание</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
              style={{ ...input(), resize: 'vertical' }} placeholder="Описание товара..." />
          </div>
        </div>

        {/* Фото */}
        <div style={card}>
          <p style={sectionHead}>Фото товара</p>
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
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
              padding: '9px 16px', fontSize: 12, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: T.font,
              display: 'flex', alignItems: 'center', gap: 7, opacity: uploading ? 0.6 : 1,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {uploading ? 'Загрузка...' : 'Загрузить с компьютера'}
            </button>
            <span style={{ fontSize: 12, color: T.muted }}>можно выбрать несколько</span>
          </div>
          <SortableImageGrid
            images={form.images}
            thumbSize={92}
            onChange={next => set('images', next)}
          />
        </div>

        {/* Цвета */}
        <Collapsible
          title={`Цвета товара${colors.length ? ` · ${colors.length}` : ''}`}
          hint="Нажмите готовый цвет ниже, чтобы добавить. У клиента появятся кружочки-свотчи с фото."
          defaultOpen={colors.length > 0}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {PRESET_COLORS.map(p => (
              <button key={p.name} type="button" onClick={() => addColor(p)} title={`Добавить «${p.name}»`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 7px', border: `1px solid ${T.border}`, borderRadius: 999, background: T.card, cursor: 'pointer', fontFamily: T.font, fontSize: 12, color: T.ink }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: p.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }} />
                {p.name}
              </button>
            ))}
            <button type="button" onClick={() => addColor()}
              style={{ padding: '6px 12px', border: `1px dashed ${T.brand}`, borderRadius: 999, background: T.card, color: T.brand, cursor: 'pointer', fontFamily: T.font, fontSize: 12, fontWeight: 600 }}>
              + Свой цвет
            </button>
          </div>

          {colors.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: T.faint, fontSize: 12.5, border: `1px dashed ${T.border}`, borderRadius: T.radiusSm }}>
              Цветов нет. Будут использоваться остаток выше и общие фото товара.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {colors.map(c => (
                <ColorRow key={c.id}
                  c={c}
                  uploading={uploadingColor === c.id}
                  onChange={patch => updateColor(c.id, patch)}
                  onRemove={() => removeColor(c.id)}
                  onFiles={e => handleColorFiles(c.id, e)} />
              ))}
            </div>
          )}
        </Collapsible>

        {/* Размеры */}
        <Collapsible
          title={`Размеры${sizes.length ? ` · ${sizes.length}` : ''}`}
          hint="Если у дивана несколько размеров — у каждого своя цена, габариты и фото. Цвет и размер выбираются независимо."
          defaultOpen={sizes.length > 0}>
          <div style={{ marginBottom: 14 }}>
            <button type="button" onClick={addSize} style={{
              background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
              padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
            }}>
              + Добавить размер
            </button>
          </div>

          {sizes.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: T.faint, fontSize: 12.5, border: `1px dashed ${T.border}`, borderRadius: T.radiusSm }}>
              Размеров нет. Будут использоваться цена и габариты из «Дополнительно».
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sizes.map(s => (
                <SizeRow key={s.id}
                  s={s}
                  uploading={uploadingSize === s.id}
                  onChange={patch => updateSize(s.id, patch)}
                  onRemove={() => removeSize(s.id)}
                  onFiles={e => handleSizeFiles(s.id, e)} />
              ))}
            </div>
          )}
        </Collapsible>

        {/* Дополнительно */}
        <Collapsible
          title="Дополнительно"
          hint="Материал, габариты, метки, артикул, сопутствующие товары"
          defaultOpen={false}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={label}>Материал</label>
              <input value={form.material || ''} onChange={e => set('material', e.target.value)} style={input()} placeholder="Велюр" />
            </div>
            <div>
              <label style={label}>Габариты (если один размер)</label>
              <input value={form.dimensions || ''} onChange={e => set('dimensions', e.target.value)} style={input()} placeholder="240×95×85 см" />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={label}>Метки</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                { key: 'new',     label: 'Новинка',       checked: form.badges.includes('new') },
                { key: 'popular', label: 'Популярный',    checked: form.badges.includes('popular') },
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

          <div style={{ marginBottom: 18 }}>
            <label style={label}>Артикул</label>
            <input value={form.sku} onChange={e => set('sku', e.target.value)} style={input()} placeholder="Сгенерируется автоматически (CM-0001)" />
            <p style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>Можно не заполнять — присвоится сам.</p>
          </div>

          <div>
            <label style={label}>Покупают с этим товаром</label>
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
        </Collapsible>

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
