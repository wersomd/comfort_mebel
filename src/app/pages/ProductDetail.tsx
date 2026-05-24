import { useParams, useNavigate, Link } from "react-router";
import { products } from "../data/products-data";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, ShoppingCart, Heart, Share2, Ruler, Package, Palette } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
          <Button onClick={() => navigate("/")}>Вернуться в каталог</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад в каталог
            </Button>
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              Comfort jihaz uii
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Основная информация о товаре */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Изображение */}
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.new && (
                <Badge className="bg-green-500 hover:bg-green-600">Новинка</Badge>
              )}
              {product.popular && (
                <Badge className="bg-orange-500 hover:bg-orange-600">Популярное</Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary">Нет в наличии</Badge>
              )}
            </div>
          </div>

          {/* Информация */}
          <div>
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Характеристики */}
            <div className="space-y-4 mb-6">
              {product.dimensions && (
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Размеры</p>
                    <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                  </div>
                </div>
              )}
              {product.material && (
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Материал</p>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
                  </div>
                </div>
              )}
              {product.color && (
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Цвет</p>
                    <p className="text-sm text-muted-foreground">{product.color}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Цена */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold">
                  {product.price.toLocaleString('ru-RU')} сум
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString('ru-RU')} сум
                  </span>
                )}
              </div>
              {product.oldPrice && (
                <Badge variant="destructive">
                  Скидка {Math.round((1 - product.price / product.oldPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Дополнительная информация */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Артикул:</span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Наличие:</span>
                    <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span className="font-medium">1-3 рабочих дня</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Гарантия:</span>
                    <span className="font-medium">12 месяцев</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
