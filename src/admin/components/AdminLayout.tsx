import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { T } from '../ui';
import mainLogo from '../../assets/main-logo.png';

const NAV = [
  {
    to: '/admin/dashboard', label: 'Дашборд',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    to: '/admin/products', label: 'Товары',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    to: '/admin/categories', label: 'Категории',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1.3" fill="currentColor"/><circle cx="3.5" cy="12" r="1.3" fill="currentColor"/><circle cx="3.5" cy="18" r="1.3" fill="currentColor"/></svg>,
  },
  {
    to: '/admin/leads', label: 'Заявки',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M22 16.92V19a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h2.09a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L7.6 8.5a16 16 0 0 0 6 6l1.86-1.86a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>,
  },
  {
    to: '/admin/import', label: 'Импорт Excel',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
];

function NavItem({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <NavLink to={to}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '10px 12px', borderRadius: T.radiusSm,
        fontSize: 13.5, fontWeight: isActive ? 600 : 500,
        color: isActive ? '#FFFFFF' : T.ink,
        background: isActive ? T.brand : hover ? T.pageBg : 'transparent',
        textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
      })}>
      <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const footLink: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
    borderRadius: T.radiusSm, fontSize: 13, color: T.muted, textDecoration: 'none',
    background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font,
    textAlign: 'left', width: '100%', transition: 'background 0.15s, color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: T.font, background: T.pageBg }}>
      {/* Sidebar */}
      <aside style={{
        width: 248, flexShrink: 0, background: '#FFFFFF',
        borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '26px 22px 20px' }}>
          <img
            src={mainLogo}
            alt="Comfort — салон мебели"
            style={{ height: 30, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
          <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: T.faint, marginTop: 8 }}>
            Панель управления
          </div>
        </div>

        <nav style={{ flex: 1, padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(item => <NavItem key={item.to} {...item} />)}
        </nav>

        <div style={{ padding: 14, borderTop: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <a href="/" target="_blank" rel="noreferrer" style={footLink}
            onMouseEnter={e => { e.currentTarget.style.background = T.pageBg; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = T.muted; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Открыть сайт
          </a>
          <button onClick={logout} style={footLink}
            onMouseEnter={e => { e.currentTarget.style.background = '#FDECEC'; e.currentTarget.style.color = T.danger; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = T.muted; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
