import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import {
  getProducts, addProduct, updateProduct,
  deleteProduct, deleteProducts, saveProducts, replaceAllProducts,
} from '../lib/store';
import { generateId } from '../lib/utils';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getProducts();
      setProducts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const product: Product = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    await addProduct(product);
    await refresh();
    return product;
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    await updateProduct(id, data);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await deleteProduct(id);
    await refresh();
  }, [refresh]);

  const removeMany = useCallback(async (ids: string[]) => {
    await deleteProducts(ids);
    await refresh();
  }, [refresh]);

  const importProducts = useCallback(async (incoming: Product[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      await replaceAllProducts(incoming);
    } else {
      const skus = new Set(incoming.map(p => p.sku));
      const existing = products.filter(p => !skus.has(p.sku));
      await saveProducts([...existing, ...incoming]);
    }
    await refresh();
  }, [refresh, products]);

  return { products, loading, refresh, create, update, remove, removeMany, importProducts };
}
