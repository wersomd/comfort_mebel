import { useState, useCallback } from 'react';
import type { CartItem, Product } from '../types';

const CART_KEY = 'comfort_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) as CartItem[] : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const sync = useCallback((next: CartItem[]) => {
    saveCart(next);
    setItems(next);
  }, []);

  const add = useCallback((product: Product) => {
    const current = loadCart();
    const existing = current.find(i => i.product.id === product.id);
    sync(
      existing
        ? current.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...current, { product, qty: 1 }]
    );
  }, [sync]);

  const remove = useCallback((productId: string) => {
    sync(loadCart().filter(i => i.product.id !== productId));
  }, [sync]);

  const updateQty = useCallback((productId: string, delta: number) => {
    sync(
      loadCart()
        .map(i => i.product.id === productId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, [sync]);

  const clear = useCallback(() => sync([]), [sync]);

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, add, remove, updateQty, clear, total, count };
}
