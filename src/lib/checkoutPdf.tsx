import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CartItem } from '../types';

// Roboto — НЕ subset, один файл со всеми алфавитами (Latin + Cyrillic + Greek)
import RobotoRegular from 'roboto-fontface/fonts/roboto/Roboto-Regular.woff?url';
import RobotoBold    from 'roboto-fontface/fonts/roboto/Roboto-Bold.woff?url';

let fontRegistered = false;
function ensureFont() {
  if (fontRegistered) return;
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: RobotoRegular, fontWeight: 400 },
      { src: RobotoBold,    fontWeight: 700 },
    ],
  });
  // Отключаем переносы слов (по умолчанию @react-pdf режет длинные слова на буквы)
  Font.registerHyphenationCallback(word => [word]);
  fontRegistered = true;
}

export interface KPForm {
  name: string;
  phone: string;
  address: string;
  discount: string;
  comment: string;
}

/* ── Контакты в КП ─────────────────────────────────────────────── */
const COMPANY = {
  name:    'Comfort Mebel',
  tagline: 'Jihaz Üii',
  phone:   '+7 (775) 646 64 64',
  address: 'г. Алматы, ул. Рыскулова, 102/1',
  hours:   'Ежедневно с 09:00 до 18:59',
  insta:   'instagram.com/comfortmebel.kz',
};

/** PDF-безопасный формат цены: обычный пробел между тысячами + "тг".
 *  Группируем вручную, чтобы избежать NBSP/narrow-no-break из toLocaleString. */
function pdfPrice(n: number): string {
  const rounded = Math.round(n);
  const grouped = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (rounded < 0 ? '-' : '') + grouped + ' тг';
}

/** Дата без локали (избегаем кириллических месяцев в PDF, где субсет может не покрывать) */
function pdfDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function kpNumber(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const tail = String(d.getTime()).slice(-4);
  return `${y}${m}${day}-${tail}`;
}

// ——— PDF Коммерческое Предложение ———
const C = {
  ink:    '#2A1F1B',
  brand:  '#3D2C25',
  muted:  '#8E7B6F',
  accent: '#C4A07A',
  line:   '#E8D9C6',
  soft:   '#F7F1E9',
  danger: '#B0392B',
} as const;

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 70,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 10,
    color: C.ink,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 18,
    borderBottom: `1.2 solid ${C.brand}`,
    marginBottom: 26,
  },
  brand:     { fontSize: 22, fontWeight: 700, letterSpacing: 6, color: C.brand },
  brandSub:  { fontSize: 7,  letterSpacing: 3, color: C.accent, marginTop: 5 },
  companyContact: { fontSize: 8.5, color: C.muted, marginTop: 8, lineHeight: 1.5 },

  kpBadge: {
    fontSize: 7.5, letterSpacing: 1.5, color: C.muted,
    textTransform: 'uppercase',
  },
  kpTitle: { fontSize: 13, color: C.brand, fontWeight: 700, marginTop: 4 },
  kpMeta:  { fontSize: 9, color: C.muted, marginTop: 10, lineHeight: 1.55 },
  kpMetaLabel: { color: C.muted },
  kpMetaValue: { color: C.ink, fontWeight: 700 },

  // Client card
  clientCard: {
    border: `0.7 solid ${C.line}`,
    padding: 16,
    marginBottom: 22,
  },
  clientHeading: {
    fontSize: 7.5, letterSpacing: 1.5, textTransform: 'uppercase',
    color: C.muted, fontWeight: 700, marginBottom: 10,
  },
  clientGrid: { flexDirection: 'row', gap: 28 },
  clientField: { flex: 1, gap: 3 },
  clientLabel: { fontSize: 8, color: C.muted, letterSpacing: 0.5 },
  clientValue: { fontSize: 11, color: C.ink, fontWeight: 700 },

  // Items table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.brand,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  th: { fontSize: 8.5, color: '#FFFFFF', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 },
  row: {
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottom: `0.5 solid ${C.line}`,
    alignItems: 'flex-start',
  },
  rowAlt: { backgroundColor: C.soft },

  colNum:   { width: 24 },
  colName:  { flex: 1, paddingRight: 8 },
  colQty:   { width: 44, textAlign: 'center' },
  colPrice: { width: 90, textAlign: 'right' },
  colTotal: { width: 110, textAlign: 'right' },

  rowName: { fontSize: 10.5, color: C.ink, fontWeight: 700, lineHeight: 1.35 },
  rowSku:  { fontSize: 8, color: C.muted, marginTop: 3 },
  rowSpec: { fontSize: 8, color: C.muted, marginTop: 2 },
  rowQty:  { fontSize: 10.5, color: C.ink, fontWeight: 700 },
  rowPrice:{ fontSize: 10.5, color: C.ink },
  rowSum:  { fontSize: 10.5, color: C.ink, fontWeight: 700 },

  // Totals
  totalsWrap: {
    marginTop: 18,
    alignItems: 'flex-end',
  },
  totalsBox: {
    width: 280,
    border: `0.7 solid ${C.line}`,
    padding: 14,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  totalsLabel: { fontSize: 10, color: C.muted },
  totalsValue: { fontSize: 10, color: C.ink },
  totalsDiscount:    { fontSize: 10, color: C.danger },
  totalsDiscountVal: { fontSize: 10, color: C.danger, fontWeight: 700 },
  totalFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 9,
    borderTop: `1 solid ${C.brand}`,
  },
  totalFinalLabel: { fontSize: 11, color: C.brand, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' },
  totalFinalValue: { fontSize: 16, color: C.brand, fontWeight: 700 },

  // Comment
  commentBox: {
    marginTop: 22,
    padding: 14,
    backgroundColor: C.soft,
    borderLeft: `2 solid ${C.accent}`,
  },
  commentLabel: { fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', color: C.muted, fontWeight: 700, marginBottom: 5 },
  commentText:  { fontSize: 10, color: C.ink, lineHeight: 1.55 },

  // Note + signature
  noteBox: {
    marginTop: 26,
    paddingTop: 14,
    borderTop: `0.5 solid ${C.line}`,
  },
  noteText: { fontSize: 9, color: C.muted, lineHeight: 1.55 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    borderTop: `0.5 solid ${C.line}`,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: C.muted },
  pageNumber: { fontSize: 8, color: C.muted },
});

function KPDocument({ form, items, subtotal, discountAmt, finalTotal }: {
  form: KPForm;
  items: CartItem[];
  subtotal: number;
  discountAmt: number;
  finalTotal: number;
}) {
  const now = new Date();
  const dateStr = pdfDate(now);
  const number = kpNumber(now);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const validUntil = pdfDate(new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000));

  return (
    <Document title={`КП ${number} — ${COMPANY.name}`} author={COMPANY.name}>
      <Page size="A4" style={pdfStyles.page}>

        {/* ── Header ────────────────────────────────────────── */}
        <View style={pdfStyles.header}>
          <View style={{ maxWidth: 280 }}>
            <Text style={pdfStyles.brand}>COMFORT</Text>
            <Text style={pdfStyles.brandSub}>{COMPANY.tagline.toUpperCase()}</Text>
            <Text style={pdfStyles.companyContact}>
              {COMPANY.phone}{'\n'}
              {COMPANY.address}{'\n'}
              {COMPANY.hours}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end', minWidth: 200 }}>
            <Text style={pdfStyles.kpBadge}>Документ</Text>
            <Text style={pdfStyles.kpTitle}>Коммерческое предложение</Text>
            <View style={pdfStyles.kpMeta}>
              <Text>
                <Text style={pdfStyles.kpMetaLabel}>№  </Text>
                <Text style={pdfStyles.kpMetaValue}>{number}</Text>
              </Text>
              <Text>
                <Text style={pdfStyles.kpMetaLabel}>Дата:  </Text>
                <Text style={pdfStyles.kpMetaValue}>{dateStr}</Text>
              </Text>
              <Text>
                <Text style={pdfStyles.kpMetaLabel}>Действительно до:  </Text>
                <Text style={pdfStyles.kpMetaValue}>{validUntil}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── Client card ───────────────────────────────────── */}
        <View style={pdfStyles.clientCard}>
          <Text style={pdfStyles.clientHeading}>Получатель</Text>
          <View style={pdfStyles.clientGrid}>
            <View style={pdfStyles.clientField}>
              <Text style={pdfStyles.clientLabel}>Имя</Text>
              <Text style={pdfStyles.clientValue}>{form.name || '—'}</Text>
            </View>
            <View style={pdfStyles.clientField}>
              <Text style={pdfStyles.clientLabel}>Телефон</Text>
              <Text style={pdfStyles.clientValue}>{form.phone || '—'}</Text>
            </View>
          </View>
          {form.address ? (
            <View style={{ marginTop: 12 }}>
              <Text style={pdfStyles.clientLabel}>Адрес доставки</Text>
              <Text style={[pdfStyles.clientValue, { fontWeight: 400 }]}>{form.address}</Text>
            </View>
          ) : null}
        </View>

        {/* ── Items table ───────────────────────────────────── */}
        <View>
          {/* Table header */}
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.th, pdfStyles.colNum]}>№</Text>
            <Text style={[pdfStyles.th, pdfStyles.colName]}>Наименование</Text>
            <Text style={[pdfStyles.th, pdfStyles.colQty]}>Кол.</Text>
            <Text style={[pdfStyles.th, pdfStyles.colPrice]}>Цена</Text>
            <Text style={[pdfStyles.th, pdfStyles.colTotal]}>Сумма</Text>
          </View>

          {items.map((item, i) => (
            <View key={item.product.id}
              style={[pdfStyles.row, i % 2 === 1 ? pdfStyles.rowAlt : {}]}
              wrap={false}>
              <Text style={[pdfStyles.rowPrice, pdfStyles.colNum]}>{i + 1}</Text>
              <View style={pdfStyles.colName}>
                <Text style={pdfStyles.rowName}>{item.product.name}</Text>
                {item.product.sku ? <Text style={pdfStyles.rowSku}>Артикул: {item.product.sku}</Text> : null}
                {(item.product.material || item.product.color || item.product.dimensions) ? (
                  <Text style={pdfStyles.rowSpec}>
                    {[item.product.material, item.product.color, item.product.dimensions].filter(Boolean).join(' · ')}
                  </Text>
                ) : null}
              </View>
              <Text style={[pdfStyles.rowQty, pdfStyles.colQty]}>{item.qty}</Text>
              <Text style={[pdfStyles.rowPrice, pdfStyles.colPrice]}>{pdfPrice(item.product.price)}</Text>
              <Text style={[pdfStyles.rowSum, pdfStyles.colTotal]}>{pdfPrice(item.product.price * item.qty)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ────────────────────────────────────────── */}
        <View style={pdfStyles.totalsWrap}>
          <View style={pdfStyles.totalsBox}>
            <View style={pdfStyles.totalsRow}>
              <Text style={pdfStyles.totalsLabel}>Позиций</Text>
              <Text style={pdfStyles.totalsValue}>{items.length} (×{totalItems} шт.)</Text>
            </View>
            <View style={pdfStyles.totalsRow}>
              <Text style={pdfStyles.totalsLabel}>Подытог</Text>
              <Text style={pdfStyles.totalsValue}>{pdfPrice(subtotal)}</Text>
            </View>
            {discountAmt > 0 && (
              <View style={pdfStyles.totalsRow}>
                <Text style={pdfStyles.totalsDiscount}>Скидка {form.discount}%</Text>
                <Text style={pdfStyles.totalsDiscountVal}>− {pdfPrice(discountAmt)}</Text>
              </View>
            )}
            <View style={pdfStyles.totalFinalRow}>
              <Text style={pdfStyles.totalFinalLabel}>Итого</Text>
              <Text style={pdfStyles.totalFinalValue}>{pdfPrice(finalTotal)}</Text>
            </View>
          </View>
        </View>

        {/* ── Comment ───────────────────────────────────────── */}
        {form.comment && (
          <View style={pdfStyles.commentBox}>
            <Text style={pdfStyles.commentLabel}>Комментарий</Text>
            <Text style={pdfStyles.commentText}>{form.comment}</Text>
          </View>
        )}

        {/* ── Note ──────────────────────────────────────────── */}
        <View style={pdfStyles.noteBox}>
          <Text style={pdfStyles.noteText}>
            Цены указаны в тенге с учётом действующих условий. Предложение носит информационный характер.
            Окончательная стоимость, сроки и условия согласовываются при оформлении заказа.
            Для оформления свяжитесь с нами по телефону {COMPANY.phone}.
          </Text>
        </View>

        {/* ── Footer ────────────────────────────────────────── */}
        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>
            {COMPANY.name} · {COMPANY.phone} · {COMPANY.insta}
          </Text>
          <Text style={pdfStyles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/** Сформировать и скачать КП в PDF. */
export async function downloadCheckoutKP(
  form: KPForm,
  items: CartItem[],
  subtotal: number,
  discountAmt: number,
  finalTotal: number,
): Promise<void> {
  ensureFont();
  const blob = await pdf(
    <KPDocument form={form} items={items} subtotal={subtotal} discountAmt={discountAmt} finalTotal={finalTotal} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KP-${form.name.replace(/\s+/g, '-') || 'client'}-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
