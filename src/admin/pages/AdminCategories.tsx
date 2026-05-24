import { useState, useRef } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../types';
import { slugify } from '../../lib/utils';
import { uploadImage } from '../../lib/upload';
import { T } from '../ui';

interface AddForm { name: string; background: string; parentId: string }
const EMPTY: AddForm = { name: '', background: '', parentId: '' };

const inputStyle: React.CSSProperties = {
  border: `1px solid ${T.border}`, background: T.card, padding: '10px 14px',
  fontSize: 13, color: T.ink, outline: 'none', fontFamily: T.font, borderRadius: T.radiusSm,
  width: '100%', boxSizing: 'border-box',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
  color: T.muted, fontWeight: 600, marginBottom: 7,
};

const primaryBtn: React.CSSProperties = {
  background: T.brand, color: '#FFFFFF', border: 'none', borderRadius: T.radiusSm,
  fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
  padding: '11px 22px', fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
  transition: 'background 0.2s', flexShrink: 0,
};

/* ── Background uploader ─────────────────────────────────────── */
interface BgUploaderProps {
  value: string;
  onChange: (url: string) => void;
  slug: string;
}

function BgUploader({ value, onChange, slug }: BgUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const url = await uploadImage(file, `categories/${slug || 'new'}`, 1800);
      onChange(url);
    } catch (ex) {
      console.error(ex);
      setErr('Не удалось загрузить. Войдите в админку и попробуйте снова.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{ display: 'none' }} />
      {value ? (
        <div style={{
          display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap',
        }}>
          <div style={{
            width: 220, height: 84, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            overflow: 'hidden', background: T.pageBg, flexShrink: 0,
          }}>
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button type="button" onClick={() => ref.current?.click()} disabled={busy}
              style={{
                background: T.card, color: T.brand, border: `1px solid ${T.brand}`,
                borderRadius: T.radiusSm, padding: '7px 13px', fontSize: 12, fontWeight: 600,
                cursor: busy ? 'not-allowed' : 'pointer', fontFamily: T.font,
                opacity: busy ? 0.6 : 1,
              }}>
              {busy ? 'Загрузка...' : 'Заменить'}
            </button>
            <button type="button" onClick={() => onChange('')}
              style={{ background: 'none', border: 'none', color: T.danger, fontSize: 12, cursor: 'pointer', fontFamily: T.font, textAlign: 'left', padding: '4px 0' }}>
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={busy}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', minHeight: 84, padding: '14px 20px',
            background: T.pageBg, border: `1px dashed ${T.border}`,
            borderRadius: T.radiusSm, color: busy ? T.faint : T.brand,
            fontSize: 12, fontWeight: 600, fontFamily: T.font, cursor: busy ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { if (!busy) e.currentTarget.style.borderColor = T.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {busy ? 'Загрузка...' : 'Загрузить фон с компьютера'}
        </button>
      )}
      {err && <p style={{ fontSize: 11, color: T.danger, marginTop: 6 }}>{err}</p>}
    </div>
  );
}

export function AdminCategories() {
  const { categories, create, update, remove, reorder } = useCategories();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Category>>({});
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const parents    = categories.filter(c => !c.parentId && !c.special).sort((a, b) => a.order - b.order);
  const special    = categories.filter(c => c.special);
  const childrenOf = (pid: string) => categories.filter(c => c.parentId === pid).sort((a, b) => a.order - b.order);

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setEditValues({ name: cat.name, background: cat.background, slug: cat.slug });
  };

  const saveEdit = (cat: Category) => {
    if (!editValues.name?.trim()) return;
    update(cat.id, {
      name: editValues.name.trim(),
      background: editValues.background ?? cat.background,
      slug: editValues.slug?.trim() || slugify(editValues.name),
    });
    setEditing(null);
    setEditValues({});
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const siblings = form.parentId ? childrenOf(form.parentId) : parents;
    create({
      slug: slugify(form.name),
      name: form.name.trim(),
      background: form.background || undefined,
      order: siblings.length + 1,
      parentId: form.parentId || undefined,
    });
    setForm(EMPTY);
    setAdding(false);
  };

  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const dragCat = categories.find(c => c.id === dragging);
    const targetCat = categories.find(c => c.id === targetId);
    if (!dragCat || !targetCat || dragCat.parentId !== targetCat.parentId) {
      setDragging(null); setDragOver(null); return;
    }
    const scope = dragCat.parentId ? childrenOf(dragCat.parentId) : parents;
    const list = [...scope];
    const from = list.findIndex(c => c.id === dragging);
    const to   = list.findIndex(c => c.id === targetId);
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    reorder(list);
    setDragging(null); setDragOver(null);
  };

  const thumb = (size: number): React.CSSProperties => ({
    width: size, height: size, flexShrink: 0, overflow: 'hidden',
    border: `1px solid ${T.line}`, borderRadius: T.radiusXs,
  });

  /* ── Row layouts ──────────────────────────────────────────────── */
  const renderRow = (cat: Category, isChild: boolean) => {
    const isEditing = editing === cat.id;
    return (
      <div key={cat.id}
        draggable={!isEditing}
        onDragStart={() => setDragging(cat.id)}
        onDragOver={e => { e.preventDefault(); setDragOver(cat.id); }}
        onDragLeave={() => setDragOver(null)}
        onDrop={() => handleDrop(cat.id)}
        style={{
          background: dragOver === cat.id ? T.pageBg : T.card,
          borderBottom: `1px solid ${T.line}`,
          paddingLeft: isChild ? 56 : 22,
          paddingRight: 22,
          transition: 'background 0.15s',
        }}>
        {isEditing ? (
          /* ── Edit view: vertical, no overflow ── */
          <div style={{ padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={label}>Название</label>
                <input value={editValues.name ?? ''} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(cat)} autoFocus style={inputStyle} />
              </div>
              <div>
                <label style={label}>Slug (URL)</label>
                <input value={editValues.slug ?? ''} onChange={e => setEditValues(v => ({ ...v, slug: e.target.value }))}
                  placeholder="например: divany" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={label}>Фон категории</label>
              <BgUploader
                value={editValues.background ?? ''}
                onChange={v => setEditValues(prev => ({ ...prev, background: v }))}
                slug={editValues.slug || cat.slug}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 4, borderTop: `1px solid ${T.line}` }}>
              <button onClick={() => saveEdit(cat)} style={primaryBtn}>Сохранить</button>
              <button onClick={() => { setEditing(null); setEditValues({}); }}
                style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          /* ── Read view ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isChild ? '11px 0' : '14px 0' }}>
            <span style={{ color: T.faint, cursor: 'grab', fontSize: 14, userSelect: 'none' }}>⠿</span>
            {cat.background ? (
              <div style={thumb(isChild ? 32 : 38)}>
                <img src={cat.background} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ ...thumb(isChild ? 32 : 38), background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: T.faint }}>нет</span>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: isChild ? 13 : 14, color: T.ink, fontWeight: 500 }}>{cat.name}</p>
              <p style={{ fontSize: 11, color: T.faint }}>{cat.slug}</p>
            </div>
            <button onClick={() => startEdit(cat)}
              style={{ fontSize: 12, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>
              Изменить
            </button>
            {confirmDelete === cat.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => { remove(cat.id); setConfirmDelete(null); }} style={{ fontSize: 12, color: T.danger, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>Да</button>
                <span style={{ color: T.faint }}>/</span>
                <button onClick={() => setConfirmDelete(null)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Нет</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(cat.id)}
                style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = T.danger)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                Удалить
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 40, maxWidth: 1000, fontFamily: T.font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 5, letterSpacing: -0.3 }}>Категории</h1>
          <p style={{ fontSize: 13.5, color: T.muted }}>Перетащите для сортировки · Поддерживаются подкатегории</p>
        </div>
        <button onClick={() => { setAdding(true); setForm(EMPTY); }} style={primaryBtn}
          onMouseEnter={e => (e.currentTarget.style.background = T.brandHover)}
          onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
          + Добавить
        </button>
      </div>

      {adding && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, padding: 26, marginBottom: 18 }}>
          <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 18 }}>Новая категория</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>Название *</label>
              <input type="text" placeholder="Например: Диваны" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                autoFocus style={inputStyle} />
            </div>
            <div>
              <label style={label}>Родительская категория</label>
              <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Верхний уровень —</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={label}>Фон категории</label>
            <BgUploader value={form.background} onChange={v => setForm(f => ({ ...f, background: v }))} slug={slugify(form.name) || 'new'} />
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
            <button onClick={handleAdd} style={primaryBtn}>Создать</button>
            <button onClick={() => { setAdding(false); setForm(EMPTY); }}
              style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, overflow: 'hidden' }}>
        {special.map(cat => (
          <div key={cat.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 22px',
            background: T.pageBg,
            borderLeft: `3px solid ${T.brand}`,
            borderBottom: `1px solid ${T.line}`,
          }}>
            {cat.background ? (
              <div style={thumb(38)}>
                <img src={cat.background} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ ...thumb(38), background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: T.faint }}>нет</span>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{cat.name}</p>
              <p style={{ fontSize: 11, color: T.faint }}>{cat.slug} · фиксированная</p>
            </div>
          </div>
        ))}

        {parents.length === 0 && special.length === 0 && (
          <div style={{ padding: '64px 16px', textAlign: 'center', color: T.muted, fontSize: 13 }}>Нет категорий</div>
        )}

        {parents.map(cat => (
          <div key={cat.id}>
            {renderRow(cat, false)}
            {childrenOf(cat.id).map(child => renderRow(child, true))}
          </div>
        ))}
      </div>
    </div>
  );
}
