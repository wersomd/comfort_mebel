import { useState } from 'react';
import type { CartItem } from '../types';
import { formatPrice } from '../lib/utils';
import { createLead } from '../lib/store';

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

export function CheckoutModal({ open, onClose, items, total }: Props) {
  const [form, setForm] = useState<OrderForm>({ name: '', phone: '', address: '', discount: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const discountPct = parseFloat(form.discount) || 0;
  const discountAmt = Math.round(total * discountPct / 100);
  const finalTotal = total - discountAmt;

  const set = (k: keyof OrderForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createLead({
        type: 'checkout',
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        message: form.comment.trim() || undefined,
        cart: items.map(it => ({
          name: it.product.name,
          qty: it.qty,
          price: it.product.price,
        })),
        total: finalTotal,
        discount: discountAmt,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('checkout submit', err);
      setSubmitError('Не удалось отправить заказ. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadKP = async () => {
    setGeneratingPdf(true);
    try {
      // @react-pdf/renderer — тяжёлый, грузим лениво только при скачивании КП
      const { downloadCheckoutKP } = await import('../lib/checkoutPdf');
      await downloadCheckoutKP(form, items, total, discountAmt, finalTotal);
    } catch (err) {
      console.error('kp pdf', err);
      alert('Не удалось сформировать КП. Попробуйте ещё раз.');
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
                  <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+7 (___) ___-__-__" className={inputCls} />
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

              {submitError && (
                <p className="text-[12px] text-red-600 -mt-1">{submitError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="flex-1 bg-brand-dark text-brand-off text-[10px] tracking-[2px] uppercase py-4 hover:bg-brand-brown transition-colors font-['Jost'] font-medium disabled:opacity-60">
                  {submitting ? 'Отправка...' : 'Оформить заказ'}
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
