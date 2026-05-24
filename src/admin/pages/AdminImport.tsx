import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { parseExcelFile, excelRowsToProducts, getExcelTemplate, type ExcelRow } from '../../lib/excel';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../lib/utils';
import { T } from '../ui';

type ImportMode = 'append' | 'replace';

export function AdminImport() {
  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<ImportMode>('append');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ added: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { importProducts } = useProducts();
  const navigate = useNavigate();

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) { setError('Принимаются только .xlsx и .xls'); return; }
    setLoading(true); setError(''); setRows([]); setFileName(file.name);
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.length === 0) setError('Файл пустой. Убедитесь, что первая строка — заголовки.');
      else setRows(parsed);
    } catch { setError('Ошибка чтения файла. Проверьте формат.'); }
    finally { setLoading(false); }
  };

  const handleImport = () => {
    if (!rows.length) return;
    importProducts(excelRowsToProducts(rows), mode);
    setDone({ added: rows.length });
  };

  const card: React.CSSProperties = {
    background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: T.shadowSm,
  };
  const primaryBtn: React.CSSProperties = {
    background: T.brand, color: '#FFFFFF', border: 'none', fontSize: 11, borderRadius: T.radiusSm,
    letterSpacing: 1.2, textTransform: 'uppercase', padding: '13px 32px', fontWeight: 600,
    cursor: 'pointer', fontFamily: T.font, transition: 'background 0.2s',
  };

  if (done) return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', fontFamily: T.font }}>
      <div style={{ width: 60, height: 60, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontSize: 24, color: T.ink, marginBottom: 8, fontWeight: 600 }}>Импорт завершён</h2>
      <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>
        Добавлено / обновлено: <strong style={{ color: T.ink }}>{done.added}</strong> товаров
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => navigate('/admin/products')} style={primaryBtn}>Смотреть товары</button>
        <button onClick={() => { setDone(null); setRows([]); setFileName(''); }} style={{
          background: T.card, color: T.brand, border: `1px solid ${T.border}`, fontSize: 11, borderRadius: T.radiusSm,
          letterSpacing: 1.2, textTransform: 'uppercase', padding: '13px 32px', fontWeight: 600,
          cursor: 'pointer', fontFamily: T.font,
        }}>Ещё импорт</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 40, maxWidth: 780, fontFamily: T.font }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 5, letterSpacing: -0.3 }}>Импорт из Excel</h1>
        <p style={{ fontSize: 13.5, color: T.muted }}>Загрузите файл .xlsx с товарами (МойСклад или шаблон)</p>
      </div>

      {/* Template */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, marginBottom: 2 }}>Скачать шаблон</p>
          <p style={{ fontSize: 12, color: T.muted }}>Готовый Excel-шаблон для правильного формата данных</p>
        </div>
        <button onClick={getExcelTemplate} style={{
          background: T.card, color: T.brand, border: `1px solid ${T.brand}`, borderRadius: T.radiusSm,
          fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', padding: '10px 18px',
          fontWeight: 600, cursor: 'pointer', fontFamily: T.font, flexShrink: 0, transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = T.brand; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.card; e.currentTarget.style.color = T.brand; }}>
          ↓ Шаблон
        </button>
      </div>

      {/* Columns */}
      <div style={{ ...card, padding: 20, marginBottom: 16 }}>
        <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 12 }}>Ожидаемые колонки</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Артикул', 'Название *', 'Категория', 'Цена *', 'Описание', 'Материал', 'Цвет', 'Размер', 'Изображение'].map(col => (
            <span key={col} style={{
              fontSize: 11, padding: '5px 11px', fontFamily: T.font, borderRadius: T.radiusXs,
              background: col.includes('*') ? T.brand : T.pageBg,
              color: col.includes('*') ? '#FFFFFF' : T.brand,
              border: col.includes('*') ? 'none' : `1px solid ${T.border}`,
              fontWeight: 600,
            }}>{col}</span>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? T.brand : T.border}`,
          borderRadius: T.radius,
          padding: '56px 24px', textAlign: 'center', cursor: 'pointer',
          background: dragging ? T.pageBg : T.card,
          marginBottom: 16, transition: 'all 0.2s',
        }}>
        <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} style={{ display: 'none' }} />
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <svg className="animate-spin" style={{ color: T.muted }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <p style={{ fontSize: 13, color: T.muted }}>Обработка файла...</p>
          </div>
        ) : (
          <>
            <svg style={{ margin: '0 auto 14px', color: T.muted, display: 'block' }} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p style={{ fontSize: 14, color: T.ink, fontWeight: 500, marginBottom: 4 }}>
              {fileName || 'Перетащите файл или нажмите для выбора'}
            </p>
            <p style={{ fontSize: 12, color: T.muted }}>Поддерживаются .xlsx и .xls</p>
          </>
        )}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: T.radiusSm, padding: '12px 16px', fontSize: 13, color: T.danger, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div style={{ ...card, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: `1px solid ${T.line}` }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>Предпросмотр — {rows.length} записей</p>
              <p style={{ fontSize: 11, color: T.muted }}>первые 10</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: T.pageBg }}>
                    {['Артикул', 'Название', 'Категория', 'Цена', 'Материал'].map(h => (
                      <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${T.line}` }}>
                      <td style={{ padding: '10px 18px', color: T.faint }}>{row.sku}</td>
                      <td style={{ padding: '10px 18px', color: T.ink, fontWeight: 500 }}>{row.name}</td>
                      <td style={{ padding: '10px 18px', color: T.muted }}>{row.category}</td>
                      <td style={{ padding: '10px 18px', color: T.ink, fontWeight: 600 }}>{formatPrice(row.price)}</td>
                      <td style={{ padding: '10px 18px', color: T.muted }}>{row.material || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mode */}
          <div style={{ ...card, padding: 20, marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 14 }}>Режим импорта</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { value: 'append', label: 'Добавить к существующим', desc: 'Новые добавятся, совпадения по артикулу — обновятся.' },
                { value: 'replace', label: 'Заменить весь каталог', desc: 'Все текущие товары будут удалены и заменены.' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                  border: `1px solid ${mode === opt.value ? T.brand : T.border}`, borderRadius: T.radiusMd,
                  background: mode === opt.value ? T.pageBg : T.card,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <input type="radio" name="mode" value={opt.value} checked={mode === opt.value}
                    onChange={() => setMode(opt.value as ImportMode)}
                    style={{ marginTop: 2, accentColor: T.brand }} />
                  <div>
                    <p style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>{opt.label}</p>
                    <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleImport} style={primaryBtn}
            onMouseEnter={e => (e.currentTarget.style.background = T.brandHover)}
            onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
            Импортировать {rows.length} товаров
          </button>
        </>
      )}
    </div>
  );
}
