export interface ProductColor {
  id: string;          // уникальный в рамках товара
  name: string;        // "Серый", "Бежевый"
  hex: string;         // "#888888" — цвет круга-свотча
  images: string[];    // фото именно этого варианта
  stock?: number | null;     // остаток конкретного цвета (null = не учитываем)
  material?: string | null;  // материал именно этого варианта (например "Велюр" / "Кожа")
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
}

export interface CatalogFilters {
  category: string;
  search: string;
  priceMin: string;
  priceMax: string;
  sort: SortOption;
}
