import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { supabase } from '../../lib/supabase';
import { T } from '../ui';

type AuthState = 'checking' | 'authed' | 'guest';

export function ProtectedRoute() {
  const [state, setState] = useState<AuthState>('checking');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState(data.session ? 'authed' : 'guest');
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState(session ? 'authed' : 'guest');
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  if (state === 'checking') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: T.pageBg, color: T.muted, fontFamily: T.font, fontSize: 13,
      }}>
        Загрузка...
      </div>
    );
  }

  return state === 'authed' ? <Outlet /> : <Navigate to="/admin" replace />;
}
