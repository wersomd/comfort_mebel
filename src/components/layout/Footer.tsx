import { Link } from 'react-router';

const PHONE_DISPLAY = '+7 (775) 646 64 64';
const PHONE_TEL     = 'tel:+77756466464';
const WHATSAPP_URL  = 'https://api.whatsapp.com/send/?phone=77756466464';
const INSTAGRAM_URL = 'https://www.instagram.com/comfortmebel.kz';
const TIKTOK_URL    = 'https://www.tiktok.com/@comfortmebel_kz';
const ADDRESS       = 'Улица Рыскулова, 102/1';
const HOURS         = 'Ежедневно с 09:00 до 18:59';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#3D2C25]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">

          {/* Brand */}
          <div>
            <div className="font-['Playfair_Display'] text-xl tracking-[5px] text-[#3D2C25] font-medium">COMFORT</div>
            <div className="text-[8px] tracking-[4px] text-[#9A8070] font-['Inter'] uppercase mt-1.5">JIHAZ ÜII</div>
            <p className="mt-5 text-[12px] text-[#9A8070] font-['Inter'] leading-relaxed">
              Мебель для дома и офиса. Качество и стиль для вашего интерьера.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[10px] tracking-[1.5px] uppercase text-[#3D2C25] font-['Inter'] font-semibold mb-4">Навигация</p>
            <nav className="flex flex-col gap-2.5">
              <Link to="/catalog"  className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">Каталог</Link>
              <Link to="/about"    className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">О нас</Link>
              <Link to="/compare"  className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">Сравнение</Link>
              <Link to="/cart"     className="text-[12px] text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">Корзина</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-[10px] tracking-[1.5px] uppercase text-[#3D2C25] font-['Inter'] font-semibold mb-4">Контакты</p>
            <div className="flex flex-col gap-2.5 text-[12px] font-['Inter']">
              <a href={PHONE_TEL} className="text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 font-medium">
                {PHONE_DISPLAY}
              </a>
              <span className="text-[#9A8070]">{HOURS}</span>
              <span className="text-[#9A8070]">{ADDRESS}</span>
            </div>
          </div>

          {/* Socials */}
          <div>
            <p className="text-[10px] tracking-[1.5px] uppercase text-[#3D2C25] font-['Inter'] font-semibold mb-4">Соцсети</p>
            <div className="flex items-center gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="w-10 h-10 border border-[#E8D9C6] text-[#3D2C25] flex items-center justify-center hover:bg-[#3D2C25] hover:text-white hover:border-[#3D2C25] transition-colors duration-200">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-10 h-10 border border-[#E8D9C6] text-[#3D2C25] flex items-center justify-center hover:bg-[#3D2C25] hover:text-white hover:border-[#3D2C25] transition-colors duration-200">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok"
                className="w-10 h-10 border border-[#E8D9C6] text-[#3D2C25] flex items-center justify-center hover:bg-[#3D2C25] hover:text-white hover:border-[#3D2C25] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.78 4.78 0 0 1-1.84-.31z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#3D2C25]/20 mt-12 pt-6">
          <p className="text-[11px] text-[#9A8070] font-['Inter']">© {new Date().getFullYear()} Comfort Mebel. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
