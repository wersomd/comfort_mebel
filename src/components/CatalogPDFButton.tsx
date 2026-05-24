import { useState } from 'react';
import type { Product } from '../types';
import { generateCatalogPDF } from '../lib/pdf';

interface Props {
  products: Product[];
}

export function CatalogPDFButton({ products }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading || products.length === 0) return;
    setLoading(true);
    try {
      await generateCatalogPDF(products);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || products.length === 0}
      className="flex items-center gap-2 text-[11px] tracking-[1.5px] uppercase border border-[#E8D9C6] px-5 py-2.5 text-[#9A8070] hover:border-[#3D2C25] hover:text-[#3D2C25] transition-colors disabled:opacity-40 font-['Inter'] font-medium"
    >
      {loading ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          Генерация...
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Скачать PDF
        </>
      )}
    </button>
  );
}
