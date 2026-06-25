import { useState, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '../types';
import { cartLineKey, cartUnitPrice } from '../lib/variants';

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

/** Опции выбранного варианта при добавлении в корзину. */
export interface AddOptions {
  colorId?: string;
  sizeId?: string;
  unitPrice?: number;
  variantLabel?: string;
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

  const add = useCallback((product: Product, opts: AddOptions = {}) => {
    const current = loadCart();
    const newItem: CartItem = {
      product,
      qty: 1,
      colorId: opts.colorId,
      sizeId: opts.sizeId,
      unitPrice: opts.unitPrice,
      variantLabel: opts.variantLabel,
    };
    const key = cartLineKey(newItem);
    const existing = current.find(i => cartLineKey(i) === key);
    saveCart(
      existing
        ? current.map(i => cartLineKey(i) === key ? { ...i, qty: i.qty + 1 } : i)
        : [...current, newItem]
    );
  }, []);

  const remove = useCallback((key: string) => {
    saveCart(loadCart().filter(i => cartLineKey(i) !== key));
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    saveCart(
      loadCart()
        .map(i => cartLineKey(i) === key ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => saveCart([]), []);

  const total = items.reduce((sum, i) => sum + cartUnitPrice(i) * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, add, remove, updateQty, clear, total, count };
}
