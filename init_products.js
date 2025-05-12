const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

const products = [
  {
    title: 'Сумка кожаная',
    description: 'Стильная кожаная сумка для города и путешествий.',
    image: 'img/bag_color.jpg',
    price: 3990,
    category: 'Bags',
    brand: 'BagIndustries',
    trend: 'Color',
    size: 'M'
  },
  {
    title: 'Толстовка унисекс',
    description: 'Мягкая и тёплая толстовка для любого сезона.',
    image: 'img/sweet_color.jpg',
    price: 2490,
    category: 'Hoodies & Sweatshirts',
    brand: 'HoodiesMag',
    trend: 'Color',
    size: 'L'
  },
  {
    title: 'Куртка демисезонная',
    description: 'Лёгкая куртка для весны и осени.',
    image: 'img/jackets_color.jpg',
    price: 4990,
    category: 'Jackets & Coats',
    brand: 'GloriaJn',
    trend: 'Form',
    size: 'M'
  },
  {
    title: 'Рюкзак городской',
    description: 'Удобный рюкзак для города и учёбы.',
    image: 'img/accessories_1.jpg',
    price: 2990,
    category: 'Accessories',
    brand: 'AtributikClub',
    trend: 'Materials',
    size: 'L'
  },
  {
    title: 'Футболка базовая',
    description: 'Классическая белая футболка из хлопка.',
    image: 'img/t-shirt.jpg',
    price: 990,
    category: 'T-Shirts',
    brand: 'HoodiesMag',
    trend: 'Color',
    size: 'S'
  },
  {
    title: 'Поло мужское',
    description: 'Поло из дышащей ткани для спорта и отдыха.',
    image: 'img/polo.jpg',
    price: 1590,
    category: 'Polos',
    brand: 'AtributikClub',
    trend: 'Form',
    size: 'M'
  },
  {
    title: 'Ремень кожаный',
    description: 'Классический ремень из натуральной кожи.',
    image: 'img/accessories_2.jpg',
    price: 1290,
    category: 'Accessories',
    brand: 'BagIndustries',
    trend: 'Materials',
    size: 'L'
  },
  {
    title: 'Шапка зимняя',
    description: 'Тёплая шапка с подкладкой.',
    image: 'img/accessories_3.jpg',
    price: 890,
    category: 'Accessories',
    brand: 'AtributikClub',
    trend: 'Color',
    size: 'M'
  },
  {
    title: 'Свитер вязаный',
    description: 'Мягкий свитер крупной вязки.',
    image: 'img/sweater.jpg',
    price: 2790,
    category: 'Sweaters & Knits',
    brand: 'GloriaJn',
    trend: 'Materials',
    size: 'L'
  },
  {
    title: 'Кроссовки',
    description: 'Удобные кроссовки для города и спорта.',
    image: 'img/shoes.jpg',
    price: 3490,
    category: 'Shoes',
    brand: 'BagIndustries',
    trend: 'Form',
    size: 'M'
  }
];

db.serialize(() => {
  db.run('DELETE FROM products');
  const stmt = db.prepare('INSERT INTO products (title, description, image, price, category, brand, trend, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  products.forEach(p => {
    stmt.run(p.title, p.description, p.image, p.price, p.category, p.brand, p.trend, p.size);
  });
  stmt.finalize();
  console.log('Тестовые товары успешно добавлены!');
});

db.close();
