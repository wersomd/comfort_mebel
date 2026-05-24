import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../types';
import { slugify } from '../../lib/utils';
import { T } from '../ui';

interface AddForm { name: string; image: string; background: string; parentId: string }
const EMPTY: AddForm = { name: '', image: '', background: '', parentId: '' };

const inputStyle: React.CSSProperties = {
  border: `1px solid ${T.border}`, background: T.card, padding: '9px 13px',
  fontSize: 13, color: T.ink, outline: 'none', fontFamily: T.font, borderRadius: T.radiusSm,
};

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

  const saveEdit = (cat: Category) => {
    if (editValues.name?.trim()) {
      update(cat.id, {
        name: editValues.name.trim(),
        image: editValues.image ?? cat.image,
        background: editValues.background ?? cat.background,
        slug: editValues.slug?.trim() || slugify(editValues.name),
      });
    }
    setEditing(null);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const siblings = form.parentId ? childrenOf(form.parentId) : parents;
    create({ slug: slugify(form.name), name: form.name.trim(), image: form.image || undefined, background: form.background || undefined, order: siblings.length + 1, parentId: form.parentId || undefined });
    setForm(EMPTY); setAdding(false);
  };

  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) return;
    const dragCat = categories.find(c => c.id === dragging);
    const targetCat = categories.find(c => c.id === targetId);
    if (!dragCat || !targetCat || dragCat.parentId !== targetCat.parentId) return;
    const scope = dragCat.parentId ? childrenOf(dragCat.parentId) : parents;
    const list = [...scope];
    const from = list.findIndex(c => c.id === dragging);
    const to   = list.findIndex(c => c.id === targetId);
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    reorder(list);
    setDragging(null); setDragOver(null);
  };

  const rowStyle = (id: string, indent = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 11,
    padding: indent ? '11px 22px 11px 50px' : '12px 22px',
    borderBottom: `1px solid ${T.line}`,
    background: dragOver === id ? T.pageBg : T.card,
    transition: 'background 0.15s',
  });

  const label: React.CSSProperties = {
    display: 'block', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
    color: T.muted, fontWeight: 600, marginBottom: 6,
  };
  const primaryBtn: React.CSSProperties = {
    background: T.brand, color: '#FFFFFF', border: 'none', borderRadius: T.radiusSm,
    fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
    padding: '11px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: T.font,
    transition: 'background 0.2s',
  };
  const thumb = (size: number): React.CSSProperties => ({
    width: size, height: size, flexShrink: 0, overflow: 'hidden',
    border: `1px solid ${T.line}`, borderRadius: T.radiusXs,
  });

  return (
    <div style={{ padding: 40, maxWidth: 720, fontFamily: T.font }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26 }}>
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
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, padding: 22, marginBottom: 16 }}>
          <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 14 }}>Новая категория</p>
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Название *</label>
            <input type="text" placeholder="Например: Диваны" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Фото категории (URL)</label>
            <input type="text" placeholder="https://..." value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            {form.image && (
              <div style={{ marginTop: 8, width: 84, height: 64, border: `1px solid ${T.border}`, borderRadius: T.radiusXs, overflow: 'hidden' }}>
                <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Фоновое изображение (URL)</label>
            <input type="text" placeholder="https://... — баннер на странице категории" value={form.background}
              onChange={e => setForm(f => ({ ...f, background: e.target.value }))}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            {form.background && (
              <div style={{ marginTop: 8, width: 150, height: 58, border: `1px solid ${T.border}`, borderRadius: T.radiusXs, overflow: 'hidden' }}>
                <img src={form.background} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Родительская категория</label>
            <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))}
              style={{ ...inputStyle, width: '100%', cursor: 'pointer', boxSizing: 'border-box' }}>
              <option value="">— Верхний уровень —</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={handleAdd} style={primaryBtn}>Создать</button>
            <button onClick={() => setAdding(false)} style={{ fontSize: 13, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm, overflow: 'hidden' }}>
        {special.map(cat => (
          <div key={cat.id} style={{ ...rowStyle(cat.id), background: T.pageBg, borderLeft: `3px solid ${T.brand}` }}>
            {cat.image && (
              <div style={thumb(34)}>
                <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{cat.name}</p>
              <p style={{ fontSize: 10.5, color: T.faint }}>{cat.slug} · фиксированная</p>
            </div>
          </div>
        ))}

        {parents.length === 0 && special.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: T.muted, fontSize: 13 }}>Нет категорий</div>
        )}

        {parents.map(cat => (
          <div key={cat.id}>
            <div draggable onDragStart={() => setDragging(cat.id)}
              onDragOver={e => { e.preventDefault(); setDragOver(cat.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(cat.id)}
              style={rowStyle(cat.id)}>
              {editing === cat.id ? (
                <>
                  <input value={editValues.name ?? ''} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(cat)} autoFocus
                    style={{ ...inputStyle, flex: 1 }} />
                  <input value={editValues.image ?? ''} onChange={e => setEditValues(v => ({ ...v, image: e.target.value }))}
                    placeholder="URL фото" style={{ ...inputStyle, flex: 1.6, fontSize: 11 }} />
                  <input value={editValues.background ?? ''} onChange={e => setEditValues(v => ({ ...v, background: e.target.value }))}
                    placeholder="URL фона" style={{ ...inputStyle, flex: 1.6, fontSize: 11 }} />
                  <input value={editValues.slug ?? ''} onChange={e => setEditValues(v => ({ ...v, slug: e.target.value }))}
                    style={{ ...inputStyle, width: 96, fontSize: 11 }} placeholder="slug" />
                  <button onClick={() => saveEdit(cat)} style={{ fontSize: 12, color: '#16A34A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>Сохранить</button>
                  <button onClick={() => setEditing(null)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Отмена</button>
                </>
              ) : (
                <>
                  <span style={{ color: T.faint, cursor: 'grab', fontSize: 14, userSelect: 'none' }}>⠿</span>
                  {cat.image ? (
                    <div style={thumb(34)}>
                      <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ ...thumb(34), background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, color: T.faint }}>нет</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{cat.name}</p>
                    <p style={{ fontSize: 10.5, color: T.faint }}>{cat.slug}</p>
                  </div>
                  <button onClick={() => { setEditing(cat.id); setEditValues({ name: cat.name, image: cat.image, background: cat.background, slug: cat.slug }); }}
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
                </>
              )}
            </div>

            {childrenOf(cat.id).map(child => (
              <div key={child.id} draggable onDragStart={() => setDragging(child.id)}
                onDragOver={e => { e.preventDefault(); setDragOver(child.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(child.id)}
                style={rowStyle(child.id, true)}>
                {editing === child.id ? (
                  <>
                    <input value={editValues.name ?? ''} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(child)} autoFocus
                      style={{ ...inputStyle, flex: 1 }} />
                    <input value={editValues.image ?? ''} onChange={e => setEditValues(v => ({ ...v, image: e.target.value }))}
                      placeholder="URL фото" style={{ ...inputStyle, flex: 1.5, fontSize: 11 }} />
                    <input value={editValues.background ?? ''} onChange={e => setEditValues(v => ({ ...v, background: e.target.value }))}
                      placeholder="URL фона" style={{ ...inputStyle, flex: 1.5, fontSize: 11 }} />
                    <button onClick={() => saveEdit(child)} style={{ fontSize: 12, color: '#16A34A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>Сохранить</button>
                    <button onClick={() => setEditing(null)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Отмена</button>
                  </>
                ) : (
                  <>
                    <span style={{ color: T.faint, cursor: 'grab', fontSize: 14, userSelect: 'none' }}>⠿</span>
                    {child.image ? (
                      <div style={thumb(30)}>
                        <img src={child.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <div style={{ ...thumb(30), background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, color: T.faint }}>нет</span>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: T.ink }}>{child.name}</p>
                      <p style={{ fontSize: 10.5, color: T.faint }}>{child.slug}</p>
                    </div>
                    <button onClick={() => { setEditing(child.id); setEditValues({ name: child.name, image: child.image, background: child.background, slug: child.slug }); }}
                      style={{ fontSize: 12, color: T.brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>
                      Изменить
                    </button>
                    {confirmDelete === child.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => { remove(child.id); setConfirmDelete(null); }} style={{ fontSize: 12, color: T.danger, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 600 }}>Да</button>
                        <span style={{ color: T.faint }}>/</span>
                        <button onClick={() => setConfirmDelete(null)} style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}>Нет</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(child.id)}
                        style={{ fontSize: 12, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.danger)}
                        onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                        Удалить
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
