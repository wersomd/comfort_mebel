/**
 * Плавающая кнопка WhatsApp.
 * Коричневая (в палитре сайта), а не классическая зелёная — чтобы не выбиваться из дизайна.
 */
const PHONE = '77756466464'; // +7 (775) 646 64 64 — без + и пробелов для wa.me
const PREFILL = 'Здравствуйте! Пишу с сайта Comfort Mebel. Хочу узнать подробнее о товаре.';

export function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="group fixed bottom-5 right-5 lg:bottom-7 lg:right-7 z-40 flex items-center"
    >
      {/* Подпись — выезжает при наведении (desktop) */}
      <span className="hidden lg:block overflow-hidden max-w-0 group-hover:max-w-[180px] transition-[max-width] duration-300 ease-out">
        <span className="mr-3 whitespace-nowrap rounded-full bg-[#3D2C25] px-4 py-2 text-[12px] font-medium text-white shadow-[0_6px_20px_rgba(61,44,37,0.25)] font-['Inter']">
          Написать в WhatsApp
        </span>
      </span>

      {/* Кнопка */}
      <span
        className="anim-wa-pulse flex h-14 w-14 items-center justify-center rounded-full bg-[#3D2C25] text-white shadow-[0_8px_24px_rgba(61,44,37,0.35)] transition-all duration-200 group-hover:bg-[#5A4136] group-hover:scale-105"
      >
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 5.83 2.42 8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </span>
    </a>
  );
}
