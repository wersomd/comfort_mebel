import { useState, useCallback, useEffect } from 'react';
import type { Product } from '../types';

const COMPARE_KEY = 'comfort_compare';
const CHANGE_EVENT = 'comfort-compare-change';
const MAX = 4;

function load(): Product[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function save(items: Product[]): void {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCompare() {
  const [items, setItems] = useState<Product[]>(load);

  useEffect(() => {
    const handler = () => setItems(load());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const toggle = useCallback((product: Product) => {
    const current = load();
    if (current.some(p => p.id === product.id)) {
      save(current.filter(p => p.id !== product.id));
    } else if (current.length < MAX) {
      save([...current, product]);
    }
  }, []);

  const remove = useCallback((id: string) => {
    save(load().filter(p => p.id !== id));
  }, []);

  const clear = useCallback(() => save([]), []);

  const has = useCallback((id: string) => items.some(p => p.id === id), [items]);
  const isFull = items.length >= MAX;

  return { items, toggle, remove, clear, has, isFull, count: items.length, max: MAX };
}
