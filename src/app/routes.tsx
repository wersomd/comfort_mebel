import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { AboutPage } from '../pages/AboutPage';
import { ComparePage } from '../pages/ComparePage';
import { ProtectedRoute } from '../admin/components/ProtectedRoute';

// Админка грузится лениво отдельным чанком — её тяжёлые зависимости (xlsx и т.п.)
// не попадают в основной бандл, который качает каждый посетитель витрины.
const AdminLogin       = lazy(() => import('../admin/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout      = lazy(() => import('../admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard   = lazy(() => import('../admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts    = lazy(() => import('../admin/pages/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminProductForm = lazy(() => import('../admin/pages/AdminProductForm').then(m => ({ default: m.AdminProductForm })));
const AdminCategories  = lazy(() => import('../admin/pages/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminImport      = lazy(() => import('../admin/pages/AdminImport').then(m => ({ default: m.AdminImport })));
const AdminLeads       = lazy(() => import('../admin/pages/AdminLeads').then(m => ({ default: m.AdminLeads })));

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-off">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// Единая Suspense-граница над всей админкой с аккуратным лоадером.
function AdminBoundary() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-[#9A8070] text-[13px] font-['Inter']">Загрузка…</div>
      </div>
    }>
      <Outlet />
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-light">
      <h1 className="font-['Cormorant_Garamond'] text-6xl text-brand-dark">404</h1>
      <p className="text-[14px] text-brand-mid">Страница не найдена</p>
      <a
        href="/"
        className="text-[11px] tracking-[2px] uppercase text-brand-dark border-b border-current hover:text-brand-brown transition-colors font-['Jost']"
      >
        На главную
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', Component: HomePage },
      { path: '/catalog', Component: CatalogPage },
      { path: '/product/:id', Component: ProductPage },
      { path: '/cart', Component: CartPage },
      { path: '/about', Component: AboutPage },
      { path: '/compare', Component: ComparePage },
    ],
  },
  // Admin — лениво, под единой Suspense-границей
  {
    element: <AdminBoundary />,
    children: [
      // login (public)
      { path: '/admin', Component: AdminLogin },
      // protected
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin/dashboard', Component: AdminDashboard },
              { path: '/admin/products', Component: AdminProducts },
              { path: '/admin/products/new', Component: AdminProductForm },
              { path: '/admin/products/:id', Component: AdminProductForm },
              { path: '/admin/categories', Component: AdminCategories },
              { path: '/admin/leads', Component: AdminLeads },
              { path: '/admin/import', Component: AdminImport },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', Component: NotFound },
]);
