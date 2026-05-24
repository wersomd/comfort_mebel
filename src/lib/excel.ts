import * as XLSX from 'xlsx';
import type { Product } from '../types';
import { generateId } from './utils';

export interface ExcelRow {
  sku: string;
  name: string;
  category: string;
  price: number;
  description: string;
  material?: string;
  color?: string;
  dimensions?: string;
  image?: string;
  inStock: boolean;
}

// Стандартные алиасы колонок
const COLUMN_ALIASES: Record<string, keyof ExcelRow> = {
  артикул: 'sku', sku: 'sku',
  название: 'name', name: 'name', наименование: 'name',
  категория: 'category', category: 'category', группы: 'category', группа: 'category',
  'цена: цена продажи': 'price', цена: 'price', price: 'price', стоимость: 'price',
  описание: 'description', description: 'description',
  материал: 'material', material: 'material',
  цвет: 'color', color: 'color',
  размер: 'dimensions', dimensions: 'dimensions', габариты: 'dimensions',
  изображение: 'image', image: 'image', фото: 'image', url: 'image',
  наличие: 'inStock', instock: 'inStock', 'в наличии': 'inStock',
};

// Индексы колонок МойСклад (по позиции в файле)
const MOYSKLAD_COLS = {
  groups: 0,       // Группы
  type: 2,         // Тип: "Товар" | "Группа" — пропускаем группы
  code: 3,         // Код (запасной артикул)
  name: 4,         // Наименование
  sku: 6,          // Артикул
  price: 8,        // Цена: Цена продажи ("200000,00")
  description: 26, // Описание
  archived: 37,    // Архивный ("да" = архивирован = нет в наличии)
};

function parseRuPrice(val: unknown): number {
  if (val === undefined || val === null || val === '') return 0;
  // "200 000,00" или "200000,00" → 200000
  return parseFloat(String(val).replace(/\s/g, '').replace(',', '.')) || 0;
}

function parseCategoryFromGroups(groups: string): string {
  if (!groups) return 'Другое';
  // "Beyossa/Beyossa матрац" → "Beyossa матрац"
  // "Кровати/Двуспальные" → "Двуспальные"
  const parts = groups.split('/');
  return parts[parts.length - 1].trim() || parts[0].trim();
}

function detectMoySklad(headers: string[]): boolean {
  return headers.includes('наименование') && headers.includes('группы') && headers.includes('архивный');
}

export function parseExcelFile(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        if (rawRows.length < 2) { resolve([]); return; }

        const headers = (rawRows[0] as unknown[]).map(h => String(h).toLowerCase().trim());
        const isMoySklad = detectMoySklad(headers);

        const rows: ExcelRow[] = [];

        for (let i = 1; i < rawRows.length; i++) {
          const raw = rawRows[i] as unknown[];
          if (!raw || raw.length === 0) continue;

          if (isMoySklad) {
            // === МойСклад формат ===
            const type = String(raw[MOYSKLAD_COLS.type] ?? '').trim();
            if (type === 'Группа' || type === '') continue; // пропускаем группы

            const name = String(raw[MOYSKLAD_COLS.name] ?? '').trim();
            const price = parseRuPrice(raw[MOYSKLAD_COLS.price]);
            if (!name || !price) continue;

            const sku = String(raw[MOYSKLAD_COLS.sku] ?? raw[MOYSKLAD_COLS.code] ?? '').trim() || `IMP-${i}`;
            const archived = String(raw[MOYSKLAD_COLS.archived] ?? '').toLowerCase() === 'да';

            rows.push({
              sku,
              name,
              category: parseCategoryFromGroups(String(raw[MOYSKLAD_COLS.groups] ?? '')),
              price,
              description: String(raw[MOYSKLAD_COLS.description] ?? '').replace(/\r?\n/g, ' ').trim(),
              inStock: !archived,
            });
          } else {
            // === Стандартный формат (наш шаблон) ===
            const obj: Partial<ExcelRow> = {};

            headers.forEach((header, idx) => {
              const field = COLUMN_ALIASES[header];
              if (!field || raw[idx] === undefined || raw[idx] === '') return;

              if (field === 'price') {
                obj.price = parseRuPrice(raw[idx]);
              } else if (field === 'inStock') {
                const val = String(raw[idx]).toLowerCase();
                obj.inStock = val === '1' || val === 'true' || val === 'да' || val === 'yes';
              } else {
                (obj as Record<string, unknown>)[field] = String(raw[idx]).trim();
              }
            });

            if (obj.name && obj.price) {
              rows.push({
                sku: obj.sku || `IMP-${i}`,
                name: obj.name,
                category: obj.category || 'Другое',
                price: obj.price,
                description: obj.description || '',
                material: obj.material,
                color: obj.color,
                dimensions: obj.dimensions,
                image: obj.image,
                inStock: obj.inStock ?? true,
              });
            }
          }
        }
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsArrayBuffer(file);
  });
}

export function excelRowsToProducts(rows: ExcelRow[]): Product[] {
  const now = new Date().toISOString();
  return rows.map((row): Product => ({
    id: generateId(),
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    images: row.image ? [row.image] : [],
    material: row.material,
    color: row.color,
    dimensions: row.dimensions,
    inStock: row.inStock,
    badges: [],
    createdAt: now,
    updatedAt: now,
  }));
}

export function getExcelTemplate(): void {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Артикул', 'Название', 'Категория', 'Цена', 'Описание', 'Материал', 'Цвет', 'Размер', 'Изображение', 'Наличие'],
    ['CM-001', 'Диван Марсель', 'Диваны', 485000, 'Описание товара', 'Велюр', 'Серый', '240×95×85 см', 'https://...', 1],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Товары');
  XLSX.writeFile(wb, 'comfort_import_template.xlsx');
}
