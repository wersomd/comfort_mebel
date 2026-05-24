import { useState } from 'react';
import { useNavigate } from 'react-router';
import { T } from '../ui';

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export function AdminLogin() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem('comfort_admin', '1');
      navigate('/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: T.font }}>
      <div style={{ width: '100%', maxWidth: 384 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 27, letterSpacing: 6, color: T.ink, fontWeight: 500, marginBottom: 7 }}>
            COMFORT
          </div>
          <p style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: T.muted }}>
            Панель управления
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
          boxShadow: T.shadow, padding: '36px 34px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
                Пароль
              </label>
              <input
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                autoFocus
                placeholder="Введите пароль"
                style={{
                  width: '100%',
                  background: T.pageBg,
                  border: `1px solid ${error ? '#FCA5A5' : T.border}`,
                  borderRadius: T.radiusSm,
                  color: T.ink,
                  fontSize: 14,
                  padding: '12px 14px',
                  outline: 'none',
                  fontFamily: T.font,
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <p style={{ fontSize: 11.5, color: T.danger, marginTop: 8 }}>Неверный пароль</p>
              )}
            </div>
            <button type="submit" style={{
              width: '100%',
              background: T.brand,
              color: '#FFFFFF',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '13px 0',
              border: 'none',
              borderRadius: T.radiusSm,
              cursor: 'pointer',
              fontFamily: T.font,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = T.brandHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
