export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  inStock: boolean;
  popular?: boolean;
  new?: boolean;
  dimensions?: string;
  material?: string;
  color?: string;
}

const categories = ['Диваны', 'Столы', 'Кресла', 'Шкафы', 'Кровати', 'Тумбы', 'Полки', 'Офисная мебель'];

const materials = ['Дерево', 'МДФ', 'ДСП', 'Металл', 'Стекло', 'Пластик', 'Ткань', 'Кожа', 'Экокожа'];

const colors = ['Белый', 'Черный', 'Коричневый', 'Серый', 'Бежевый', 'Синий', 'Зеленый', 'Красный'];

const images = [
  'https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzkyMDQ4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1547062200-f195b1c77e30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGNoYWlyc3xlbnwxfHx8fDE3NzkyMDQ4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1680503146454-04ac81a63550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYmVkJTIwZnVybml0dXJlfGVufDF8fHx8MTc3OTI2NjU3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1672137233327-37b0c1049e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJkcm9iZSUyMGNsb3NldHxlbnwxfHx8fDE3NzkyMDQ4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1651936717122-77e95cc1ba78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTI2NjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1518975555701-c6c56f3e650b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm1jaGFpciUyMGNvbWZvcnRhYmxlfGVufDF8fHx8MTc3OTI2NjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1605972713797-0f20b224371c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc2hlbGYlMjBjYWJpbmV0fGVufDF8fHx8MTc3OTI2NjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1656699170530-21004fb9ec2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB0YWJsZSUyMG1vZGVybnxlbnwxfHx8fDE3NzkyNjY1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

const sofaNames = ['Модерн', 'Комфорт Люкс', 'Классик', 'Элегант', 'Релакс', 'Престиж', 'Венеция', 'Милан', 'Париж', 'Рим', 'Стамбул', 'Берлин', 'Лондон', 'Прага', 'Вена'];
const tableNames = ['Обеденный', 'Журнальный', 'Письменный', 'Компьютерный', 'Раздвижной', 'Круглый', 'Прямоугольный', 'Стеклянный', 'Деревянный', 'Металлический'];
const chairNames = ['Офисное', 'Барное', 'Гостевое', 'Руководителя', 'Детское', 'Складное', 'Мягкое', 'С подлокотниками', 'Классическое', 'Современное'];
const wardrobeNames = ['Распашной', 'Купе', 'Угловой', 'Встроенный', 'Гардеробная', 'С зеркалом', 'Модульный', 'Прихожая', 'Детский', 'Спальный'];
const bedNames = ['Двуспальная', 'Односпальная', 'Полуторная', 'Кинг-сайз', 'С подъемным механизмом', 'С ящиками', 'Мягкая', 'Классическая', 'Современная', 'Детская'];

function generateProducts(): Product[] {
  const products: Product[] = [];
  let id = 1;

  // Диваны (20 позиций)
  for (let i = 0; i < 20; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Диван ${sofaNames[i % sofaNames.length]} ${i + 1}`,
      category: 'Диваны',
      price: Math.floor(Math.random() * 400000) + 100000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 500000) + 150000 : undefined,
      description: 'Комфортный и стильный диван для вашей гостиной. Высококачественные материалы и современный дизайн.',
      image: images[0],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${180 + Math.floor(Math.random() * 60)}x${80 + Math.floor(Math.random() * 20)}x${70 + Math.floor(Math.random() * 15)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Столы (20 позиций)
  for (let i = 0; i < 20; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Стол ${tableNames[i % tableNames.length]} ${i + 1}`,
      category: 'Столы',
      price: Math.floor(Math.random() * 200000) + 30000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 250000) + 50000 : undefined,
      description: 'Функциональный стол с элегантным дизайном. Идеально подходит для любого интерьера.',
      image: images[1],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${100 + Math.floor(Math.random() * 80)}x${60 + Math.floor(Math.random() * 40)}x${70 + Math.floor(Math.random() * 10)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Кресла (15 позиций)
  for (let i = 0; i < 15; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Кресло ${chairNames[i % chairNames.length]} ${i + 1}`,
      category: 'Кресла',
      price: Math.floor(Math.random() * 150000) + 20000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 180000) + 40000 : undefined,
      description: 'Удобное кресло с ортопедической поддержкой. Идеально для работы и отдыха.',
      image: images[5],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${50 + Math.floor(Math.random() * 20)}x${50 + Math.floor(Math.random() * 20)}x${80 + Math.floor(Math.random() * 30)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Шкафы (15 позиций)
  for (let i = 0; i < 15; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Шкаф ${wardrobeNames[i % wardrobeNames.length]} ${i + 1}`,
      category: 'Шкафы',
      price: Math.floor(Math.random() * 500000) + 100000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 600000) + 150000 : undefined,
      description: 'Вместительный шкаф с продуманной системой хранения. Качественная фурнитура.',
      image: images[3],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${120 + Math.floor(Math.random() * 80)}x${50 + Math.floor(Math.random() * 20)}x${180 + Math.floor(Math.random() * 40)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Кровати (15 позиций)
  for (let i = 0; i < 15; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Кровать ${bedNames[i % bedNames.length]} ${i + 1}`,
      category: 'Кровати',
      price: Math.floor(Math.random() * 300000) + 80000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 400000) + 120000 : undefined,
      description: 'Комфортная кровать для здорового сна. Прочная конструкция и стильный дизайн.',
      image: images[2],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${140 + Math.floor(Math.random() * 60)}x${190 + Math.floor(Math.random() * 20)}x${80 + Math.floor(Math.random() * 30)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Тумбы (10 позиций)
  for (let i = 0; i < 10; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Тумба ${i % 2 === 0 ? 'Прикроватная' : 'ТВ'} ${i + 1}`,
      category: 'Тумбы',
      price: Math.floor(Math.random() * 80000) + 15000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 100000) + 20000 : undefined,
      description: 'Компактная тумба с удобными ящиками. Практичное решение для хранения.',
      image: images[7],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${40 + Math.floor(Math.random() * 60)}x${35 + Math.floor(Math.random() * 25)}x${40 + Math.floor(Math.random() * 40)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Полки (10 позиций)
  for (let i = 0; i < 10; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Полка ${i % 2 === 0 ? 'Настенная' : 'Стеллаж'} ${i + 1}`,
      category: 'Полки',
      price: Math.floor(Math.random() * 60000) + 10000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 80000) + 15000 : undefined,
      description: 'Стильная полка для книг и декора. Прочная конструкция и удобный монтаж.',
      image: images[6],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${80 + Math.floor(Math.random() * 80)}x${25 + Math.floor(Math.random() * 15)}x${25 + Math.floor(Math.random() * 150)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // Офисная мебель (15 позиций)
  for (let i = 0; i < 15; i++) {
    products.push({
      id: `product-${id++}`,
      name: `Офисная мебель ${i % 3 === 0 ? 'Стол' : i % 3 === 1 ? 'Кресло' : 'Тумба'} ${i + 1}`,
      category: 'Офисная мебель',
      price: Math.floor(Math.random() * 200000) + 30000,
      oldPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 250000) + 50000 : undefined,
      description: 'Профессиональная офисная мебель. Эргономичный дизайн для продуктивной работы.',
      image: images[4],
      inStock: Math.random() > 0.1,
      popular: Math.random() > 0.7,
      new: Math.random() > 0.8,
      dimensions: `${60 + Math.floor(Math.random() * 80)}x${50 + Math.floor(Math.random() * 30)}x${70 + Math.floor(Math.random() * 40)} см`,
      material: materials[Math.floor(Math.random() * materials.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return products;
}

export const products = generateProducts();
export const productCategories = categories;
