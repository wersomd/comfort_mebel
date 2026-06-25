import type { Product, ProductColor, ProductSize, CartItem } from '../types';

/**
 * Единые правила разрешения вариантов товара (цвет + размер независимы).
 * Используются на странице товара, в карточке каталога и в корзине,
 * чтобы цена/фото/доступность считались одинаково и без багов.
 *
 * Приоритеты:
 *   Фото:     размер.images → цвет.images → product.images
 *   Цена:     размер.price ?? product.price
 *   Ст.цена:  размер.oldPrice ?? product.oldPrice
 *   Габариты: размер.dimensions || product.dimensions
 */

export function resolveImages(
  product: Product,
  color?: ProductColor,
  size?: ProductSize,
): string[] {
  if (size?.images && size.images.length > 0) return size.images;
  if (color?.images && color.images.length > 0) return color.images;
  return product.images;
}

export function resolvePrice(product: Product, size?: ProductSize): number {
  return size?.price != null ? size.price : product.price;
}

export function resolveOldPrice(product: Product, size?: ProductSize): number | undefined {
  if (size && size.price != null) return size.oldPrice ?? undefined;
  return product.oldPrice;
}

export function resolveDimensions(product: Product, size?: ProductSize): string | undefined {
  return (size?.dimensions || product.dimensions) || undefined;
}

/** Остаток null = "не учитываем". 0 = нет. >0 = есть. */
function stockAvailable(stock?: number | null): boolean {
  return stock == null || stock > 0;
}

/**
 * Доступен ли товар при выбранных цвете и размере.
 * Если конкретный вариант выбран — смотрим его остаток.
 * Если не выбран, но варианты есть — доступен, пока хотя бы один вариант в наличии.
 */
export function resolveAvailable(
  product: Product,
  color?: ProductColor,
  size?: ProductSize,
): boolean {
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];

  // Выбранные варианты не должны быть с нулевым остатком
  if (color && !stockAvailable(color.stock)) return false;
  if (size && !stockAvailable(size.stock)) return false;
  if (color || size) return true;

  // Ничего не выбрано — оцениваем по наличию хотя бы одного варианта / общему остатку
  if (colors.length > 0 && !colors.some(c => stockAvailable(c.stock))) return false;
  if (sizes.length > 0 && !sizes.some(s => stockAvailable(s.stock))) return false;
  if (colors.length > 0 || sizes.length > 0) return true;
  return stockAvailable(product.stock);
}

/** Минимальная цена среди размеров (для "от ..." в каталоге). */
export function minVariantPrice(product: Product): number {
  const sizes = product.sizes ?? [];
  const prices = sizes.map(s => (s.price != null ? s.price : product.price));
  prices.push(product.price);
  return Math.min(...prices);
}

/** Есть ли у размеров разная цена — тогда в каталоге показываем "от ...". */
export function hasPriceRange(product: Product): boolean {
  const sizes = product.sizes ?? [];
  if (sizes.length === 0) return false;
  const prices = new Set(sizes.map(s => (s.price != null ? s.price : product.price)));
  prices.add(product.price);
  return prices.size > 1;
}

/** Человекочитаемая подпись варианта для корзины/заявки/PDF. */
export function variantLabel(color?: ProductColor, size?: ProductSize): string | undefined {
  const parts: string[] = [];
  if (color?.name) parts.push(`Цвет: ${color.name}`);
  if (size?.label) parts.push(`Размер: ${size.label}`);
  return parts.length ? parts.join(' · ') : undefined;
}

/** Идентичность строки корзины: товар + цвет + размер. */
export function cartLineKey(item: Pick<CartItem, 'product' | 'colorId' | 'sizeId'>): string {
  return `${item.product.id}::${item.colorId ?? ''}::${item.sizeId ?? ''}`;
}

/** Цена единицы позиции корзины (зафиксированная при добавлении). */
export function cartUnitPrice(item: CartItem): number {
  return item.unitPrice != null ? item.unitPrice : item.product.price;
}
