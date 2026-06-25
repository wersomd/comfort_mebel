# Варианты товара по размеру

## Контекст
Цветовые варианты (`Product.colors`) уже реализованы: модель `ProductColor`, редактор в
админке (`AdminProductForm` → блок «Цветовые варианты»), переключение фото на странице
товара (`ProductPage`) и в карточке каталога (`ProductCard`). Размеры пока — одно текстовое
поле `dimensions`. Нужно сделать размер полноценной осью вариантов: своя цена, габариты,
фото и остаток, выбираемой **независимо** от цвета.

## Модель данных
Новая колонка `products.sizes jsonb not null default '[]'`. Тип:

```ts
interface ProductSize {
  id: string;
  label: string;            // "2-местный" / "Угловой"
  dimensions?: string;      // "240×95×85 см"
  price?: number | null;    // своя цена; пусто = базовая product.price
  oldPrice?: number | null; // своя старая цена
  images?: string[];        // свои фото (опционально)
  stock?: number | null;
}
```
`colors` не трогаем.

## Правила разрешения (оси независимы)
- **Фото:** размер.images (если есть) → цвет.images (если есть) → product.images.
- **Цена:** размер.price ?? product.price. Старая цена: размер.oldPrice ?? product.oldPrice.
- **Габариты:** размер.dimensions || product.dimensions.
- **Доступность:** учитывает остаток выбранного размера И выбранного цвета (если у любого
  выбранного варианта stock === 0 → нет в наличии).

Рекомендация по контенту: фото — на цвет (обивка), цена/габариты — на размер. Движок
поддерживает фото и на размере.

## Админка
Новый блок «Размеры» под «Цветовыми вариантами». `SizeRow` по аналогии с `ColorRow`:
поля Название, Габариты, Цена, Старая цена, Остаток + загрузка фото
(`uploadImage`) и сортировка через существующий `SortableImageGrid`.

## Страница товара (`ProductPage`)
Под свотчами цвета — ряд кнопок-пилюль размеров (активная подсвечена). `selectedSizeId`
в state. Цена, старая цена, скидка %, габариты, фото, остаток/доступность пересчитываются
от выбранных цвета+размера по правилам выше.

## Корзина / заявка / PDF
`CartItem` расширяется: `colorId?`, `sizeId?`, `unitPrice?`, `variantLabel?`.
- `add(product, opts?)` принимает выбранный вариант, фиксирует цену.
- Идентичность позиции: `productId::colorId::sizeId` — разные варианты = разные строки.
- `total`/подытоги считаются по `unitPrice ?? product.price`.
- В корзине, `CheckoutModal` и `checkoutPdf` под названием — подпись варианта
  («Цвет: Жёлтый · Размер: Угловой»). Хелпер `cartLineKey(item)` и `cartUnitPrice(item)`.

## Каталог (`ProductCard`)
Размеры в сетку не выносим. Если у товара есть размеры с разной ценой — цена выводится
как «от {минимальная} ₸». Иначе как сейчас.

## Затрагиваемые файлы
`types/index.ts`, `supabase/migrations/0004_sizes.sql`, `AdminProductForm.tsx`,
`ProductPage.tsx`, `useCart.ts`, `CartPage.tsx`, `CheckoutModal.tsx`, `lib/checkoutPdf.tsx`,
`ProductCard.tsx`.
