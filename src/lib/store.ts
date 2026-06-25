import type { Product, ProductColor, ProductSize, Category } from '../types';
import { supabase } from './supabase';

/* ── Row types (snake_case как в БД) ─────────────────────────────────── */
interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  price: number;
  old_price: number | null;
  description: string;
  images: string[];
  material: string | null;
  color: string | null;
  dimensions: string | null;
  badges: string[];
  related_ids: string[];
  stock: number | null;
  colors: ProductColor[] | null;
  sizes: ProductSize[] | null;
  created_at: string;
  updated_at: string;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  image: string | null;
  background: string | null;
  order: number;
  parent_id: string | null;
  special: string | null;
}

/* ── Mappers ─────────────────────────────────────────────────────────── */
function productFromRow(r: ProductRow): Product {
  return {
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category ?? '',
    price: r.price,
    oldPrice: r.old_price ?? undefined,
    description: r.description,
    images: r.images || [],
    material: r.material ?? undefined,
    color: r.color ?? undefined,
    dimensions: r.dimensions ?? undefined,
    badges: (r.badges || []) as Product['badges'],
    relatedIds: r.related_ids || [],
    inStock: true,
    stock: r.stock ?? null,
    colors: r.colors ?? [],
    sizes: r.sizes ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function productToRow(p: Product): Omit<ProductRow, 'created_at' | 'updated_at'> {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category || null,
    price: p.price,
    old_price: p.oldPrice ?? null,
    description: p.description ?? '',
    images: p.images || [],
    material: p.material ?? null,
    color: p.color ?? null,
    dimensions: p.dimensions ?? null,
    badges: p.badges || [],
    related_ids: p.relatedIds || [],
    stock: p.stock ?? null,
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
  };
}

function categoryFromRow(r: CategoryRow): Category {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    emoji: r.emoji ?? undefined,
    image: r.image ?? undefined,
    background: r.background ?? undefined,
    order: r.order,
    parentId: r.parent_id ?? undefined,
    special: r.special === 'sale' ? 'sale' : undefined,
  };
}

function categoryToRow(c: Category): CategoryRow {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    emoji: c.emoji ?? null,
    image: c.image ?? null,
    background: c.background ?? null,
    order: c.order,
    parent_id: c.parentId ?? null,
    special: c.special ?? null,
  };
}

/* ── Products ────────────────────────────────────────────────────────── */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getProducts', error); return []; }
  return (data as ProductRow[]).map(productFromRow);
}

export async function addProduct(product: Product): Promise<void> {
  const { error } = await supabase.from('products').insert(productToRow(product));
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (updates.sku        !== undefined) patch.sku         = updates.sku;
  if (updates.name       !== undefined) patch.name        = updates.name;
  if (updates.category   !== undefined) patch.category    = updates.category || null;
  if (updates.price      !== undefined) patch.price       = updates.price;
  if ('oldPrice'   in updates)          patch.old_price   = updates.oldPrice ?? null;
  if (updates.description !== undefined) patch.description = updates.description ?? '';
  if (updates.images     !== undefined) patch.images      = updates.images;
  if ('material'   in updates)          patch.material    = updates.material ?? null;
  if ('color'      in updates)          patch.color       = updates.color ?? null;
  if ('dimensions' in updates)          patch.dimensions  = updates.dimensions ?? null;
  if (updates.badges     !== undefined) patch.badges      = updates.badges;
  if ('relatedIds' in updates)          patch.related_ids = updates.relatedIds ?? [];
  if ('stock'      in updates)          patch.stock       = updates.stock ?? null;
  if ('colors'     in updates)          patch.colors      = updates.colors ?? [];
  if ('sizes'      in updates)          patch.sizes       = updates.sizes ?? [];

  const { error } = await supabase.from('products').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteProducts(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const { error } = await supabase.from('products').delete().in('id', ids);
  if (error) throw error;
}

/* Used by Excel import: append/replace */
export async function saveProducts(products: Product[]): Promise<void> {
  if (!products.length) return;
  const rows = products.map(productToRow);
  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function replaceAllProducts(products: Product[]): Promise<void> {
  const { error: delErr } = await supabase.from('products').delete().neq('id', '');
  if (delErr) throw delErr;
  if (products.length) await saveProducts(products);
}

/* ── Categories ──────────────────────────────────────────────────────── */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });
  if (error) { console.error('getCategories', error); return []; }
  return (data as CategoryRow[]).map(categoryFromRow);
}

export async function addCategory(category: Category): Promise<void> {
  const { error } = await supabase.from('categories').insert(categoryToRow(category));
  if (error) throw error;
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id'>>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (updates.slug      !== undefined) patch.slug       = updates.slug;
  if (updates.name      !== undefined) patch.name       = updates.name;
  if ('emoji'      in updates)         patch.emoji      = updates.emoji ?? null;
  if ('image'      in updates)         patch.image      = updates.image ?? null;
  if ('background' in updates)         patch.background = updates.background ?? null;
  if (updates.order     !== undefined) patch.order      = updates.order;
  if ('parentId'   in updates)         patch.parent_id  = updates.parentId ?? null;
  if ('special'    in updates)         patch.special    = updates.special ?? null;

  const { error } = await supabase.from('categories').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function saveCategories(categories: Category[]): Promise<void> {
  if (!categories.length) return;
  const rows = categories.map(categoryToRow);
  const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

/* ── Leads ───────────────────────────────────────────────────────────── */
export type LeadType = 'consult' | 'checkout';
export type LeadStatus = 'new' | 'in_progress' | 'done';

export interface LeadCartLine { name: string; qty: number; price: number; }

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  message?: string;
  productName?: string;
  address?: string;
  cart?: LeadCartLine[];
  total?: number;
  discount?: number;
  status: LeadStatus;
  createdAt: string;
}

interface LeadRow {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  message: string | null;
  product_name: string | null;
  address: string | null;
  cart: LeadCartLine[] | null;
  total: number | null;
  discount: number | null;
  status: LeadStatus;
  created_at: string;
}

function leadFromRow(r: LeadRow): Lead {
  return {
    id: r.id,
    type: r.type,
    name: r.name,
    phone: r.phone,
    message: r.message ?? undefined,
    productName: r.product_name ?? undefined,
    address: r.address ?? undefined,
    cart: r.cart ?? undefined,
    total: r.total ?? undefined,
    discount: r.discount ?? undefined,
    status: r.status,
    createdAt: r.created_at,
  };
}

export interface NewLead {
  type: LeadType;
  name: string;
  phone: string;
  message?: string;
  productName?: string;
  address?: string;
  cart?: LeadCartLine[];
  total?: number;
  discount?: number;
}

export async function createLead(lead: NewLead): Promise<void> {
  const row = {
    type: lead.type,
    name: lead.name,
    phone: lead.phone,
    message: lead.message ?? null,
    product_name: lead.productName ?? null,
    address: lead.address ?? null,
    cart: lead.cart ?? null,
    total: lead.total ?? null,
    discount: lead.discount ?? 0,
  };
  const { error } = await supabase.from('leads').insert(row);
  if (error) throw error;
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getLeads', error); return []; }
  return (data as LeadRow[]).map(leadFromRow);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}
