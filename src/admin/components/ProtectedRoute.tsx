import { Navigate, Outlet } from 'react-router';

export function ProtectedRoute() {
  const isAuth = sessionStorage.getItem('comfort_admin') === '1';
  return isAuth ? <Outlet /> : <Navigate to="/admin" replace />;
}
