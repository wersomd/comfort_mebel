import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { T } from '../ui';
import mainLogo from '../../assets/main-logo.png';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Если уже залогинен — сразу в дашборд
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Неверный email или пароль'
        : err.message);
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: T.font }}>
      <div style={{ width: '100%', maxWidth: 384 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <img
            src={mainLogo}
            alt="Comfort — салон мебели"
            style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 10 }}
          />
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                required
                placeholder="admin@example.com"
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
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: T.muted, marginBottom: 8, fontWeight: 600 }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
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
                <p style={{ fontSize: 11.5, color: T.danger, marginTop: 8 }}>{error}</p>
              )}
            </div>
            <button type="submit" disabled={loading} style={{
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
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: T.font,
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.brandHover; }}
              onMouseLeave={e => (e.currentTarget.style.background = T.brand)}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
