import { Link } from 'react-router';

const PHONE_DISPLAY = '+7 (775) 646 64 64';
const PHONE_TEL     = 'tel:+77756466464';
const WHATSAPP_URL  = 'https://api.whatsapp.com/send/?phone=77756466464';
const INSTAGRAM_URL = 'https://www.instagram.com/comfortmebel.kz';
const TIKTOK_URL    = 'https://www.tiktok.com/@comfortmebel_kz';
const ADDRESS       = 'Улица Рыскулова, 102/1';
const HOURS         = 'Ежедневно с 09:00 до 18:59';

export function AboutPage() {
  return (
    <div className="pt-16 lg:pt-[68px] min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E8D9C6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <nav className="flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase text-[#9A8070] font-['Inter'] mb-8">
            <Link to="/" className="hover:text-[#3D2C25] transition-colors">Главная</Link>
            <span className="text-[#E8D9C6]">/</span>
            <span className="text-[#3D2C25]">О нас</span>
          </nav>
          <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl text-[#3D2C25] leading-[0.95] tracking-tight">
            О нас
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] lg:text-[16px] text-[#9A8070] font-['Inter'] leading-relaxed">
            Comfort Mebel — мебельный салон в Алматы. Помогаем создавать интерьеры,
            в которых хочется возвращаться домой. Работаем напрямую с производителями,
            поэтому держим цены доступными при достойном качестве.
          </p>
        </div>
      </div>

      {/* Contact block */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Phone */}
          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-[#9A8070] font-['Inter'] mb-4">Телефон</p>
            <a href={PHONE_TEL} className="block font-['Playfair_Display'] text-3xl lg:text-4xl text-[#3D2C25] hover:text-[#9A8070] transition-colors mb-3">
              {PHONE_DISPLAY}
            </a>
            <p className="text-[13px] text-[#9A8070] font-['Inter']">{HOURS}</p>
          </div>

          {/* Address */}
          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-[#9A8070] font-['Inter'] mb-4">Адрес</p>
            <p className="font-['Playfair_Display'] text-3xl lg:text-4xl text-[#3D2C25] mb-3 leading-tight">
              {ADDRESS}
            </p>
            <p className="text-[13px] text-[#9A8070] font-['Inter']">Алматы</p>
          </div>

          {/* Socials */}
          <div>
            <p className="text-[10px] tracking-[2px] uppercase text-[#9A8070] font-['Inter'] mb-4">Соцсети</p>
            <div className="flex flex-col gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] text-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] text-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-[#3D2C25] hover:text-[#9A8070] transition-colors font-['Inter'] text-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.78 4.78 0 0 1-1.84-.31z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
