import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import {
  getCategories, addCategory, updateCategory,
  deleteCategory, saveCategories,
} from '../lib/store';
import { generateId } from '../lib/utils';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getCategories();
      setCategories([...list].sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (data: Omit<Category, 'id'>) => {
    const category: Category = { ...data, id: generateId() };
    await addCategory(category);
    await refresh();
    return category;
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Omit<Category, 'id'>>) => {
    await updateCategory(id, data);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await deleteCategory(id);
    await refresh();
  }, [refresh]);

  const reorder = useCallback(async (ordered: Category[]) => {
    const updated = ordered.map((c, i) => ({ ...c, order: i + 1 }));
    await saveCategories(updated);
    await refresh();
  }, [refresh]);

  return { categories, loading, refresh, create, update, remove, reorder };
}
