import { useState, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '../types';

const CART_KEY = 'comfort_cart';
const CHANGE_EVENT = 'comfort-cart-change';

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
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    const handler = () => setItems(loadCart());
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const add = useCallback((product: Product) => {
    const current = loadCart();
    const existing = current.find(i => i.product.id === product.id);
    saveCart(
      existing
        ? current.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...current, { product, qty: 1 }]
    );
  }, []);

  const remove = useCallback((productId: string) => {
    saveCart(loadCart().filter(i => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    saveCart(
      loadCart()
        .map(i => i.product.id === productId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => saveCart([]), []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, add, remove, updateQty, clear, total, count };
}
