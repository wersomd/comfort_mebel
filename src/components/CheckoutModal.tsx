import { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CartItem } from '../types';
import { formatPrice } from '../lib/utils';

// Кириллица — Roboto (единая регистрация для всех PDF)
import RobotoRegularCyrillic from '@fontsource/roboto/files/roboto-cyrillic-400-normal.woff?url';
import RobotoBoldCyrillic    from '@fontsource/roboto/files/roboto-cyrillic-700-normal.woff?url';
import RobotoRegularLatin    from '@fontsource/roboto/files/roboto-latin-400-normal.woff?url';
import RobotoBoldLatin       from '@fontsource/roboto/files/roboto-latin-700-normal.woff?url';

// Guard: не регистрировать повторно
let fontRegistered = false;
function ensureFont() {
  if (fontRegistered) return;
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: RobotoRegularLatin,    fontWeight: 400 },
      { src: RobotoRegularCyrillic, fontWeight: 400 },
      { src: RobotoBoldLatin,       fontWeight: 700 },
      { src: RobotoBoldCyrillic,    fontWeight: 700 },
    ],
  });
  fontRegistered = true;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

interface OrderForm {
  name: string;
  phone: string;
  address: string;
  discount: string;
  comment: string;
}

// ——— PDF Коммерческое Предложение ———
const pdfStyles = StyleSheet.create({
  page: { padding: 48, backgroundColor: '#F8F4EF', fontFamily: 'Roboto' },
  header: { borderBottom: '1.5 solid #3B2419', paddingBottom: 18, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  brand: { fontSize: 20, letterSpacing: 5, color: '#3B2419' },
  brandSub: { fontSize: 7, letterSpacing: 3, color: '#C4A882', marginTop: 3 },
  kpTitle: { fontSize: 10, color: '#7A6458', letterSpacing: 1 },
  kpDate: { fontSize: 9, color: '#7A6458', marginTop: 3 },
  clientBox: { backgroundColor: '#EDE0D4', padding: 14, marginBottom: 22 },
  clientLabel: { fontSize: 8, color: '#7A6458', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  clientRow: { flexDirection: 'row', gap: 24, marginTop: 4 },
  clientField: { flex: 1 },
  clientFieldLabel: { fontSize: 7, color: '#7A6458', letterSpacing: 1, marginBottom: 2 },
  clientFieldValue: { fontSize: 11, color: '#3B2419' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #C4A882', paddingBottom: 6, marginBottom: 6 },
  thText: { fontSize: 8, color: '#7A6458', letterSpacing: 1, textTransform: 'uppercase' },
  colNum: { width: 28 },
  colName: { flex: 1 },
  colQty: { width: 40, textAlign: 'center' },
  colPrice: { width: 80, textAlign: 'right' },
  colTotal: { width: 90, textAlign: 'right' },
  row: { flexDirection: 'row', paddingVertical: 7, borderBottom: '0.5 solid #E8DDD4', alignItems: 'flex-start' },
  rowText: { fontSize: 10, color: '#1A0F0A' },
  rowSub: { fontSize: 8, color: '#7A6458', marginTop: 2 },
  totalsBox: { marginTop: 18, paddingTop: 14, borderTop: '1 solid #C4A882', alignItems: 'flex-end' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', width: 240, marginBottom: 5 },
  totalsLabel: { fontSize: 10, color: '#7A6458' },
  totalsValue: { fontSize: 10, color: '#3B2419' },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 240, marginTop: 6, paddingTop: 6, borderTop: '1 solid #3B2419' },
  totalFinalLabel: { fontSize: 13, color: '#3B2419', fontWeight: 700 },
  totalFinalValue: { fontSize: 13, color: '#3B2419', fontWeight: 700 },
  commentBox: { marginTop: 18, padding: 12, backgroundColor: '#fff', border: '0.5 solid #E8DDD4' },
  commentLabel: { fontSize: 8, color: '#7A6458', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  commentText: { fontSize: 10, color: '#3B2419', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, borderTop: '0.5 solid #E8DDD4', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#7A6458' },
});

function KPDocument({ form, items, subtotal, discountAmt, finalTotal }: {
  form: OrderForm;
  items: CartItem[];
  subtotal: number;
  discountAmt: number;
  finalTotal: number;
}) {
  const date = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  return (
    <Document title="Коммерческое предложение — Comfort Mebel">
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.brand}>COMFORT</Text>
            <Text style={pdfStyles.brandSub}>JIHAZ ÜII</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={pdfStyles.kpTitle}>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</Text>
            <Text style={pdfStyles.kpDate}>{date}</Text>
          </View>
        </View>

        {/* Client info */}
        <View style={pdfStyles.clientBox}>
          <Text style={pdfStyles.clientLabel}>Клиент</Text>
          <View style={pdfStyles.clientRow}>
            <View style={pdfStyles.clientField}>
              <Text style={pdfStyles.clientFieldLabel}>Имя</Text>
              <Text style={pdfStyles.clientFieldValue}>{form.name}</Text>
            </View>
            <View style={pdfStyles.clientField}>
              <Text style={pdfStyles.clientFieldLabel}>Телефон</Text>
              <Text style={pdfStyles.clientFieldValue}>{form.phone}</Text>
            </View>
          </View>
          {form.address ? (
            <View style={{ marginTop: 8 }}>
              <Text style={pdfStyles.clientFieldLabel}>Адрес доставки</Text>
              <Text style={pdfStyles.clientFieldValue}>{form.address}</Text>
            </View>
          ) : null}
        </View>

        {/* Table header */}
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.thText, pdfStyles.colNum]}>№</Text>
          <Text style={[pdfStyles.thText, pdfStyles.colName]}>Товар</Text>
          <Text style={[pdfStyles.thText, pdfStyles.colQty]}>Кол.</Text>
          <Text style={[pdfStyles.thText, pdfStyles.colPrice]}>Цена</Text>
          <Text style={[pdfStyles.thText, pdfStyles.colTotal]}>Сумма</Text>
        </View>

        {/* Items */}
        {items.map((item, i) => (
          <View key={item.product.id} style={pdfStyles.row}>
            <Text style={[pdfStyles.rowText, pdfStyles.colNum]}>{i + 1}</Text>
            <View style={pdfStyles.colName}>
              <Text style={pdfStyles.rowText}>{item.product.name}</Text>
              {item.product.sku ? <Text style={pdfStyles.rowSub}>{item.product.sku}</Text> : null}
              {item.product.material ? <Text style={pdfStyles.rowSub}>{item.product.material}</Text> : null}
            </View>
            <Text style={[pdfStyles.rowText, pdfStyles.colQty]}>{item.qty}</Text>
            <Text style={[pdfStyles.rowText, pdfStyles.colPrice]}>{formatPrice(item.product.price)}</Text>
            <Text style={[pdfStyles.rowText, pdfStyles.colTotal]}>{formatPrice(item.product.price * item.qty)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={pdfStyles.totalsBox}>
          <View style={pdfStyles.totalsRow}>
            <Text style={pdfStyles.totalsLabel}>Подытог</Text>
            <Text style={pdfStyles.totalsValue}>{formatPrice(subtotal)}</Text>
          </View>
          {discountAmt > 0 && (
            <View style={pdfStyles.totalsRow}>
              <Text style={[pdfStyles.totalsLabel, { color: '#C0392B' }]}>Скидка {form.discount}%</Text>
              <Text style={[pdfStyles.totalsValue, { color: '#C0392B' }]}>−{formatPrice(discountAmt)}</Text>
            </View>
          )}
          <View style={pdfStyles.totalFinalRow}>
            <Text style={pdfStyles.totalFinalLabel}>Итого к оплате</Text>
            <Text style={pdfStyles.totalFinalValue}>{formatPrice(finalTotal)}</Text>
          </View>
        </View>

        {/* Comment */}
        {form.comment && (
          <View style={pdfStyles.commentBox}>
            <Text style={pdfStyles.commentLabel}>Примечание</Text>
            <Text style={pdfStyles.commentText}>{form.comment}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>Comfort Mebel — Jihaz Üii</Text>
          <Text style={pdfStyles.footerText}>Действительно 14 дней с даты выставления</Text>
        </View>
      </Page>
    </Document>
  );
}

export function CheckoutModal({ open, onClose, items, total }: Props) {
  const [form, setForm] = useState<OrderForm>({ name: '', phone: '', address: '', discount: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!open) return null;

  const discountPct = parseFloat(form.discount) || 0;
  const discountAmt = Math.round(total * discountPct / 100);
  const finalTotal = total - discountAmt;

  const set = (k: keyof OrderForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDownloadKP = async () => {
    ensureFont();
    setGeneratingPdf(true);
    try {
      const blob = await pdf(
        <KPDocument form={form} items={items} subtotal={total} discountAmt={discountAmt} finalTotal={finalTotal} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KP-${form.name.replace(/\s+/g, '-') || 'client'}-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const inputCls = 'w-full border border-brand-cream bg-transparent py-2.5 px-0 text-[14px] text-brand-dark placeholder:text-brand-mid focus:outline-none focus:border-brand-mid transition-colors border-0 border-b';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" />
      <div
        className="relative bg-brand-off w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-brand-mid hover:text-brand-dark z-10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-3xl text-brand-dark mb-2">Заказ принят</h3>
            <p className="text-[13px] text-brand-mid mb-8">Мы свяжемся с вами в ближайшее время</p>
            {form.name && (
              <button
                onClick={handleDownloadKP}
                disabled={generatingPdf}
                className="bg-brand-dark text-brand-off text-[10px] tracking-[2px] uppercase px-6 py-3 hover:bg-brand-brown transition-colors font-['Jost'] flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {generatingPdf ? 'Генерация...' : '↓ Скачать КП (PDF)'}
              </button>
            )}
          </div>
        ) : (
          <div className="p-8 lg:p-10">
            <h3 className="font-['Cormorant_Garamond'] text-3xl text-brand-dark mb-1">Оформление заказа</h3>
            <p className="text-[13px] text-brand-mid mb-8">{items.length} позиций</p>

            {/* Order summary */}
            <div className="bg-brand-light p-4 mb-7 space-y-2 max-h-40 overflow-y-auto">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-[13px]">
                  <span className="text-brand-dark">{item.product.name} × {item.qty}</span>
                  <span className="text-brand-dark font-medium">{formatPrice(item.product.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[1.5px] uppercase text-brand-mid font-['Jost'] block mb-1.5">Имя *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Азат" className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] tracking-[1.5px] uppercase text-brand-mid font-['Jost'] block mb-1.5">Телефон *</label>
                  <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+7 (700) 000-00-00" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-brand-mid font-['Jost'] block mb-1.5">Адрес доставки</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="г. Алматы, ул. ..." className={inputCls} />
              </div>

              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-brand-mid font-['Jost'] block mb-1.5">Скидка (%)</label>
                <input type="number" min="0" max="100" value={form.discount} onChange={e => set('discount', e.target.value)} placeholder="0" className={inputCls} />
              </div>

              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-brand-mid font-['Jost'] block mb-1.5">Примечание</label>
                <textarea rows={2} value={form.comment} onChange={e => set('comment', e.target.value)} placeholder="Особые пожелания..." className={`${inputCls} resize-none`} />
              </div>

              {/* Total */}
              <div className="border-t border-brand-cream pt-4 space-y-2">
                <div className="flex justify-between text-[13px] text-brand-mid">
                  <span>Подытог</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-[13px] text-[#C0392B]">
                    <span>Скидка {discountPct}%</span>
                    <span>−{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[17px] font-medium text-brand-dark pt-1">
                  <span>Итого</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-brand-dark text-brand-off text-[10px] tracking-[2px] uppercase py-4 hover:bg-brand-brown transition-colors font-['Jost'] font-medium">
                  Оформить заказ
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!form.name || !form.phone) {
                      alert('Заполните имя и телефон');
                      return;
                    }
                    await handleDownloadKP();
                  }}
                  disabled={generatingPdf}
                  className="border border-brand-cream text-brand-brown text-[10px] tracking-[1.5px] uppercase px-5 py-4 hover:border-brand-mid transition-colors font-['Jost'] disabled:opacity-50"
                >
                  {generatingPdf ? '...' : '↓ КП'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
