export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₸';
}

export function generateId(): string {
  return crypto.randomUUID();
}

/** Следующий свободный артикул вида CM-0001 (артикул больше не вводится вручную). */
export function nextSku(existing: string[]): string {
  let max = 0;
  for (const s of existing) {
    const m = /^CM-(\d+)$/i.exec((s || '').trim());
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `CM-${String(max + 1).padStart(4, '0')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim();
}
