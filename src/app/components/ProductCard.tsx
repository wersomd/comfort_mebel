import { Link } from "react-router";
import { Product } from "../data/products-data";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
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
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {product.category}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold">
            {product.price.toLocaleString('ru-RU')} сум
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.oldPrice.toLocaleString('ru-RU')} сум
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? 'В корзину' : 'Нет в наличии'}
        </Button>
      </CardFooter>
    </Card>
  );
}
