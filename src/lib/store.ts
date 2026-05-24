import type { Product, Category } from '../types';
import { SEED_PRODUCTS, SEED_CATEGORIES } from './seed-data';

const PRODUCTS_KEY = 'comfort_products';
const CATEGORIES_KEY = 'comfort_categories';

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      saveProducts(SEED_PRODUCTS);
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return [...SEED_PRODUCTS];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  saveProducts([...getProducts(), product]);
}

export function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): void {
  const products = getProducts();
  saveProducts(
    products.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    )
  );
}

export function deleteProduct(id: string): void {
  saveProducts(getProducts().filter(p => p.id !== id));
}

export function deleteProducts(ids: string[]): void {
  const set = new Set(ids);
  saveProducts(getProducts().filter(p => !set.has(p.id)));
}

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      saveCategories(SEED_CATEGORIES);
      return SEED_CATEGORIES;
    }
    return JSON.parse(raw) as Category[];
  } catch {
    return [...SEED_CATEGORIES];
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(category: Category): void {
  saveCategories([...getCategories(), category]);
}

export function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): void {
  const categories = getCategories();
  saveCategories(categories.map(c => (c.id === id ? { ...c, ...updates } : c)));
}

export function deleteCategory(id: string): void {
  saveCategories(getCategories().filter(c => c.id !== id));
}
