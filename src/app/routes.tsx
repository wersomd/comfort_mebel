import { createBrowserRouter } from 'react-router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Outlet } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { AboutPage } from '../pages/AboutPage';
import { ComparePage } from '../pages/ComparePage';
import { AdminLogin } from '../admin/pages/AdminLogin';
import { AdminLayout } from '../admin/components/AdminLayout';
import { AdminDashboard } from '../admin/pages/AdminDashboard';
import { AdminProducts } from '../admin/pages/AdminProducts';
import { AdminProductForm } from '../admin/pages/AdminProductForm';
import { AdminCategories } from '../admin/pages/AdminCategories';
import { AdminImport } from '../admin/pages/AdminImport';
import { ProtectedRoute } from '../admin/components/ProtectedRoute';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-off">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
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
  // Admin — login (public)
  { path: '/admin', Component: AdminLogin },
  // Admin — protected
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
          { path: '/admin/import', Component: AdminImport },
        ],
      },
    ],
  },
  { path: '*', Component: NotFound },
]);
