import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#3D2C25]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div>
            <div className="font-['Playfair_Display'] text-xl tracking-[5px] text-[#3D2C25] font-medium">COMFORT</div>
            <div className="text-[8px] tracking-[4px] text-[#9A8070] font-['Inter'] uppercase mt-1.5">JIHAZ ÜII</div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-8">
            <Link to="/catalog" className="text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 font-['Inter']">Каталог</Link>
            <Link to="/about" className="text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 font-['Inter']">О нас</Link>
            <Link to="/cart" className="text-[11px] tracking-[1.5px] uppercase text-[#3D2C25] hover:text-[#9A8070] transition-colors duration-200 font-['Inter']">Корзина</Link>
          </nav>

          {/* Contacts */}
          <div className="flex flex-col gap-1.5 text-[12px] text-[#9A8070] font-['Inter'] md:text-right">
            <a href="tel:+77001234567" className="hover:text-[#3D2C25] transition-colors duration-200">+7 (700) 123-45-67</a>
            <a href="mailto:info@comfort.kz" className="hover:text-[#3D2C25] transition-colors duration-200">info@comfort.kz</a>
            <span>г. Алматы, ул. Абая 150</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#3D2C25]/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#9A8070] font-['Inter']">© {new Date().getFullYear()} Comfort Mebel. Все права защищены.</p>
          <Link to="/admin" className="text-[10px] tracking-[1px] uppercase text-[#9A8070] hover:text-[#3D2C25] transition-colors duration-200 font-['Inter']">Панель управления</Link>
        </div>
      </div>
    </footer>
  );
}
