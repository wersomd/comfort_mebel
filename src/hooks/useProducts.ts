import { useState, useCallback } from 'react';
import type { Product } from '../types';
import {
  getProducts, addProduct, updateProduct,
  deleteProduct, deleteProducts, saveProducts,
} from '../lib/store';
import { generateId } from '../lib/utils';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => getProducts());

  const refresh = useCallback(() => setProducts(getProducts()), []);

  const create = useCallback((data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const product: Product = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    addProduct(product);
    refresh();
    return product;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    updateProduct(id, data);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteProduct(id);
    refresh();
  }, [refresh]);

  const removeMany = useCallback((ids: string[]) => {
    deleteProducts(ids);
    refresh();
  }, [refresh]);

  const importProducts = useCallback((incoming: Product[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      saveProducts(incoming);
    } else {
      const existing = getProducts();
      const skus = new Set(incoming.map(p => p.sku));
      const merged = [...existing.filter(p => !skus.has(p.sku)), ...incoming];
      saveProducts(merged);
    }
    refresh();
  }, [refresh]);

  return { products, refresh, create, update, remove, removeMany, importProducts };
}
