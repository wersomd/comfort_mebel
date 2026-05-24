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
