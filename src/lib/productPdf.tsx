import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { Product, Category } from '../types';

// Roboto — один файл со всеми алфавитами
import RobotoRegular from 'roboto-fontface/fonts/roboto/Roboto-Regular.woff?url';
import RobotoBold    from 'roboto-fontface/fonts/roboto/Roboto-Bold.woff?url';

let fontRegistered = false;
function ensureFont() {
  if (fontRegistered) return;
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: RobotoRegular, fontWeight: 400 },
      { src: RobotoBold,    fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback(word => [word]);
  fontRegistered = true;
}

/* ── Контакты ──────────────────────────────────────────────────── */
const COMPANY = {
  name:    'Comfort Mebel',
  tagline: 'Jihaz Üii',
  phone:   '+7 (775) 646 64 64',
  address: 'г. Шымкент, ул. Рыскулова, 102/1',
  hours:   'Ежедневно с 09:00 до 18:59',
  insta:   'instagram.com/comfortmebel.kz',
};

const C = {
  ink:    '#2A1F1B',
  brand:  '#3D2C25',
  muted:  '#8E7B6F',
  accent: '#C4A07A',
  line:   '#E8D9C6',
  soft:   '#F7F1E9',
  danger: '#B0392B',
} as const;

function priceFmt(n: number): string {
  const rounded = Math.round(n);
  const grouped = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (rounded < 0 ? '-' : '') + grouped + ' тг';
}

function dateFmt(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

/* ── Styles ────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 10,
    color: C.ink,
  },

  /* Logo header strip */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 14,
    borderBottom: `1.2 solid ${C.brand}`,
    marginBottom: 22,
  },
  brand:    { fontSize: 22, fontWeight: 700, letterSpacing: 6, color: C.brand },
  brandSub: { fontSize: 7,  letterSpacing: 3, color: C.accent, marginTop: 4 },
  meta:     { fontSize: 8.5, color: C.muted, textAlign: 'right', lineHeight: 1.5 },

  /* Title row */
  titleBlock: { marginBottom: 18 },
  badge: {
    backgroundColor: C.brand, color: '#FFFFFF',
    fontSize: 7.5, letterSpacing: 1.5, textTransform: 'uppercase',
    paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8,
    alignSelf: 'flex-start', marginBottom: 8, fontWeight: 700,
  },
  productName: { fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.15 },
  sku:         { fontSize: 9, color: C.muted, marginTop: 6, letterSpacing: 0.8 },

  /* Two columns: hero photo + key info */
  topGrid: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },
  heroPhoto: {
    width: 290,
    height: 290,
    backgroundColor: C.soft,
    objectFit: 'cover',
  },
  heroPhotoFallback: {
    width: 290,
    height: 290,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: { flex: 1, paddingTop: 2 },

  /* Price box */
  priceBox: { marginBottom: 14 },
  price:    { fontSize: 22, fontWeight: 700, color: C.brand },
  oldPrice: { fontSize: 11, color: C.muted, textDecoration: 'line-through', marginTop: 2 },
  discount: { fontSize: 9, color: C.danger, fontWeight: 700, marginTop: 4, letterSpacing: 0.5 },

  /* Specs */
  specsHead: {
    fontSize: 7.5, color: C.muted, fontWeight: 700, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 8,
  },
  specRow: {
    flexDirection: 'row',
    paddingTop: 6, paddingBottom: 6,
    borderBottom: `0.5 solid ${C.line}`,
  },
  specLabel: { width: 80, fontSize: 9.5, color: C.muted },
  specValue: { flex: 1, fontSize: 9.5, color: C.ink, fontWeight: 700 },

  /* Section title */
  sectionTitle: {
    fontSize: 12, fontWeight: 700, color: C.brand,
    marginTop: 6, marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `0.5 solid ${C.line}`,
  },

  /* Description */
  description: { fontSize: 10, color: C.ink, lineHeight: 1.6, marginBottom: 4 },

  /* Color variants */
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8, paddingBottom: 8,
    borderBottom: `0.5 solid ${C.line}`,
  },
  swatch: {
    width: 16, height: 16,
    marginRight: 10,
    border: `0.7 solid ${C.line}`,
  },
  colorName:  { flex: 1, fontSize: 10, color: C.ink, fontWeight: 700 },
  colorSpec:  { fontSize: 9, color: C.muted },
  colorStock: { fontSize: 9, marginLeft: 12 },
  inStock:    { color: '#2F7A4D' },
  outOfStock: { color: C.danger },

  /* Gallery */
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryItem: {
    width: 162,
    height: 162,
    backgroundColor: C.soft,
    objectFit: 'cover',
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: `0.5 solid ${C.line}`,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: C.muted },
  pageNumber: { fontSize: 8, color: C.muted },
});

/* ── Document ──────────────────────────────────────────────────── */
interface DocProps {
  product: Product;
  categoryName?: string;
}

function ProductDocument({ product, categoryName }: DocProps) {
  const heroImage = product.colors?.[0]?.images?.[0] || product.images[0];
  const allImages = product.images;
  const galleryImages = allImages.slice(1, 7); // макс 6 дополнительных фото
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <Document title={`${product.name} — ${COMPANY.name}`} author={COMPANY.name}>
      <Page size="A4" style={styles.page}>

        {/* ── Header (logo) ─────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>COMFORT</Text>
            <Text style={styles.brandSub}>{COMPANY.tagline.toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.meta}>
              {COMPANY.phone}{'\n'}
              {COMPANY.address}{'\n'}
              {COMPANY.hours}
            </Text>
          </View>
        </View>

        {/* ── Title ─────────────────────────────────── */}
        <View style={styles.titleBlock}>
          {categoryName && <Text style={styles.badge}>{categoryName}</Text>}
          <Text style={styles.productName}>{product.name}</Text>
          {product.sku && <Text style={styles.sku}>Артикул: {product.sku}</Text>}
        </View>

        {/* ── Hero + key info ────────────────────────── */}
        <View style={styles.topGrid}>
          {heroImage ? (
            <Image src={heroImage} style={styles.heroPhoto} />
          ) : (
            <View style={styles.heroPhotoFallback}>
              <Text style={{ color: C.muted, fontSize: 10 }}>фото отсутствует</Text>
            </View>
          )}

          <View style={styles.infoCol}>
            <View style={styles.priceBox}>
              <Text style={styles.price}>{priceFmt(product.price)}</Text>
              {product.oldPrice && (
                <Text style={styles.oldPrice}>{priceFmt(product.oldPrice)}</Text>
              )}
              {discount > 0 && (
                <Text style={styles.discount}>СКИДКА −{discount}%</Text>
              )}
            </View>

            <Text style={styles.specsHead}>Характеристики</Text>
            {product.material && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Материал</Text>
                <Text style={styles.specValue}>{product.material}</Text>
              </View>
            )}
            {product.dimensions && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Размер</Text>
                <Text style={styles.specValue}>{product.dimensions}</Text>
              </View>
            )}
            {product.color && (!product.colors || product.colors.length === 0) && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Цвет</Text>
                <Text style={styles.specValue}>{product.color}</Text>
              </View>
            )}
            {categoryName && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Категория</Text>
                <Text style={styles.specValue}>{categoryName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Description ────────────────────────────── */}
        {product.description && (
          <View>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* ── Color variants ─────────────────────────── */}
        {product.colors && product.colors.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Доступные цвета</Text>
            {product.colors.map(c => {
              const out = c.stock != null && c.stock <= 0;
              return (
                <View key={c.id} style={styles.colorRow} wrap={false}>
                  <View style={[styles.swatch, { backgroundColor: c.hex || '#888888' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.colorName}>{c.name || 'Без названия'}</Text>
                    {c.material && <Text style={styles.colorSpec}>{c.material}</Text>}
                  </View>
                  <Text style={[styles.colorStock, out ? styles.outOfStock : styles.inStock]}>
                    {out ? 'Нет в наличии' : c.stock != null ? `${c.stock} шт.` : 'В наличии'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Gallery ────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Дополнительные фото</Text>
            <View style={styles.galleryGrid}>
              {galleryImages.map((img, i) => (
                <Image key={i} src={img} style={styles.galleryItem} />
              ))}
            </View>
          </View>
        )}

        {/* ── Footer ─────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {COMPANY.name} · {COMPANY.phone} · {COMPANY.insta}
          </Text>
          <Text style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${dateFmt(new Date())}  ·  ${pageNumber} / ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}

/* ── Public API ────────────────────────────────────────────────── */
export async function downloadProductPdf(product: Product, categories: Category[] = []): Promise<void> {
  ensureFont();
  const categoryName = categories.find(c => c.slug === product.category)?.name;
  const blob = await pdf(<ProductDocument product={product} categoryName={categoryName} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = product.name.replace(/[^\wа-яА-ЯёЁ\- ]/g, '').replace(/\s+/g, '-').slice(0, 40) || 'product';
  a.href = url;
  a.download = `${safeName}-${product.sku || 'sku'}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
