export interface ProductColor {
  id: string;          // уникальный в рамках товара
  name: string;        // "Серый", "Бежевый"
  hex: string;         // "#888888" — цвет круга-свотча
  images: string[];    // фото именно этого варианта
  stock?: number | null;     // остаток конкретного цвета (null = не учитываем)
  material?: string | null;  // материал именно этого варианта (например "Велюр" / "Кожа")
}

export interface ProductSize {
  id: string;          // уникальный в рамках товара
  label: string;       // "2-местный", "Угловой", "240 см"
  dimensions?: string | null;  // "240×95×85 см" — переопределяет общий dimensions
  price?: number | null;       // своя цена размера (null = базовая цена товара)
  oldPrice?: number | null;    // своя старая цена (для расчёта скидки)
  images?: string[];           // фото именно этого размера (опционально)
  stock?: number | null;       // остаток конкретного размера (null = не учитываем)
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  material?: string;
  color?: string;
  dimensions?: string;
  inStock?: boolean;
  stock?: number | null;       // общий остаток (если нет цветных вариантов)
  colors?: ProductColor[];     // если задано — товар с вариантами цветов
  sizes?: ProductSize[];       // если задано — товар с вариантами размеров
  badges: Array<'new' | 'popular' | 'sale'>;
  relatedIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji?: string;
  image?: string;
  background?: string;
  order: number;
  parentId?: string;
  special?: 'sale';
}

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'new' | 'popular';

export interface CartItem {
  product: Product;
  qty: number;
  colorId?: string;       // выбранный цвет (если у товара есть варианты)
  sizeId?: string;        // выбранный размер (если у товара есть варианты)
  unitPrice?: number;     // зафиксированная цена варианта (иначе product.price)
  variantLabel?: string;  // подпись варианта: "Цвет: Жёлтый · Размер: Угловой"
}

export interface CatalogFilters {
  category: string;
  search: string;
  priceMin: string;
  priceMax: string;
  sort: SortOption;
}
