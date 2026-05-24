import { Document, Page, Text, View, StyleSheet, Image, pdf, Font } from '@react-pdf/renderer';
import type { Product } from '../types';
import { formatPrice } from './utils';

// ——— Регистрация шрифта Roboto с поддержкой кириллицы ———
import RobotoRegularCyrillic from '@fontsource/roboto/files/roboto-cyrillic-400-normal.woff?url';
import RobotoBoldCyrillic    from '@fontsource/roboto/files/roboto-cyrillic-700-normal.woff?url';
import RobotoRegularLatin    from '@fontsource/roboto/files/roboto-latin-400-normal.woff?url';
import RobotoBoldLatin       from '@fontsource/roboto/files/roboto-latin-700-normal.woff?url';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: RobotoRegularLatin,    fontWeight: 400 },
    { src: RobotoRegularCyrillic, fontWeight: 400 },
    { src: RobotoBoldLatin,       fontWeight: 700 },
    { src: RobotoBoldCyrillic,    fontWeight: 700 },
  ],
});

// ——— Стили каталога ———
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F8F4EF',
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    borderBottom: '1 solid #C4A882',
    paddingBottom: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brandName: {
    fontSize: 20,
    letterSpacing: 5,
    color: '#3B2419',
    fontWeight: 700,
  },
  brandSub: {
    fontSize: 7,
    letterSpacing: 3,
    color: '#C4A882',
    marginTop: 3,
  },
  headerDate: { fontSize: 9, color: '#7A6458', textAlign: 'right' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: { width: '31%', marginBottom: 14 },
  cardImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    backgroundColor: '#EDE0D4',
    marginBottom: 7,
  },
  cardSku:      { fontSize: 7,  color: '#C4A882', letterSpacing: 1.2, marginBottom: 2 },
  cardName:     { fontSize: 11, color: '#3B2419', fontWeight: 700,    marginBottom: 2, lineHeight: 1.3 },
  cardMaterial: { fontSize: 8,  color: '#7A6458',                     marginBottom: 3 },
  cardPrice:    { fontSize: 10, color: '#3B2419', fontWeight: 700 },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    borderTop: '0.5 solid #E8DDD4',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: '#7A6458' },
});

interface CatalogDocProps {
  products: Product[];
  date: string;
}

function CatalogDocument({ products, date }: CatalogDocProps) {
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += 9) {
    pages.push(products.slice(i, i + 9));
  }

  return (
    <Document title="Comfort Mebel — Каталог">
      {pages.map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brandName}>COMFORT</Text>
              <Text style={styles.brandSub}>JIHAZ ÜII</Text>
            </View>
            <View>
              <Text style={styles.headerDate}>Каталог товаров</Text>
              <Text style={styles.headerDate}>{date}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {chunk.map(product => (
              <View key={product.id} style={styles.card}>
                {product.images[0]
                  ? <Image src={product.images[0]} style={styles.cardImage} />
                  : <View style={[styles.cardImage, { backgroundColor: '#EDE0D4' }]} />
                }
                <Text style={styles.cardSku}>{product.sku}</Text>
                <Text style={styles.cardName}>{product.name}</Text>
                {product.material && (
                  <Text style={styles.cardMaterial}>
                    {product.material}{product.dimensions ? ` · ${product.dimensions}` : ''}
                  </Text>
                )}
                <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Comfort Mebel</Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}

export async function generateCatalogPDF(products: Product[]): Promise<void> {
  const date = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const blob = await pdf(<CatalogDocument products={products} date={date} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comfort-catalog-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
