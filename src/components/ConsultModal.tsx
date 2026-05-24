import { useState } from 'react';
import { createLead } from '../lib/store';

interface Props { open: boolean; onClose: () => void; productName?: string; }

export function ConsultModal({ open, onClose, productName }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      await createLead({
        type: 'consult',
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
        productName,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName(''); setPhone(''); setMessage('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('lead submit', err);
      setError('Не удалось отправить. Проверьте интернет и попробуйте снова.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#3D2C25]/40 backdrop-blur-sm" />
      <div className="relative bg-white w-full max-w-md p-10 shadow-2xl anim-scale-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-[#9A8070] hover:text-[#3D2C25] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-[#F5F5F5] flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4A07A" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl text-[#3D2C25] mb-2">Спасибо!</h3>
            <p className="text-[14px] text-[#9A8070]">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <>
            <h3 className="font-['Playfair_Display'] text-3xl text-[#3D2C25] mb-2">Консультация</h3>
            <p className="text-[13px] text-[#9A8070] mb-7 font-['Inter']">
              {productName ? `по товару: ${productName}` : 'Наши специалисты помогут подобрать идеальную мебель'}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Ваше имя" required value={name} onChange={e => setName(e.target.value)}
                className="border-b border-[#E8D9C6] py-3 text-[14px] text-[#3D2C25] placeholder:text-[#9A8070] focus:outline-none focus:border-[#C4A07A] transition-colors bg-transparent" />
              <input type="tel" placeholder="Телефон" required value={phone} onChange={e => setPhone(e.target.value)}
                className="border-b border-[#E8D9C6] py-3 text-[14px] text-[#3D2C25] placeholder:text-[#9A8070] focus:outline-none focus:border-[#C4A07A] transition-colors bg-transparent" />
              <textarea placeholder="Комментарий" rows={3} value={message} onChange={e => setMessage(e.target.value)}
                className="border-b border-[#E8D9C6] py-3 text-[14px] text-[#3D2C25] placeholder:text-[#9A8070] focus:outline-none focus:border-[#C4A07A] transition-colors bg-transparent resize-none" />
              {error && <p className="text-[12px] text-red-600 font-['Inter']">{error}</p>}
              <button type="submit" disabled={sending}
                className="mt-3 bg-[#3D2C25] text-white text-[11px] tracking-[2px] uppercase py-4 font-['Inter'] font-bold hover:bg-[#C4A07A] transition-colors duration-200 disabled:opacity-60">
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
