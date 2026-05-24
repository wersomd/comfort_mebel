import { useState, useCallback } from 'react';
import type { Category } from '../types';
import {
  getCategories, addCategory, updateCategory,
  deleteCategory, saveCategories,
} from '../lib/store';
import { generateId } from '../lib/utils';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    [...getCategories()].sort((a, b) => a.order - b.order)
  );

  const refresh = useCallback(() =>
    setCategories([...getCategories()].sort((a, b) => a.order - b.order)),
    []
  );

  const create = useCallback((data: Omit<Category, 'id'>) => {
    const category: Category = { ...data, id: generateId() };
    addCategory(category);
    refresh();
    return category;
  }, [refresh]);

  const update = useCallback((id: string, data: Partial<Omit<Category, 'id'>>) => {
    updateCategory(id, data);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteCategory(id);
    refresh();
  }, [refresh]);

  const reorder = useCallback((ordered: Category[]) => {
    const updated = ordered.map((c, i) => ({ ...c, order: i + 1 }));
    saveCategories(updated);
    refresh();
  }, [refresh]);

  return { categories, refresh, create, update, remove, reorder };
}
