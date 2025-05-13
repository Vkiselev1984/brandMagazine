// Скрипт для запуска всех миграций и наполнения базы данных
const { execSync } = require('child_process');

const scripts = [
  'init_db.js',
  'migrate_create_products_table.js',
  'migrate_create_mailings_table.js',
  'migrate_create_promotions_table.js',
  'migrate_create_user_profiles_table.js',
  'migrate_create_user_cart.js',
  'migrate_add_role_to_users.js',
  // Добавь сюда другие миграционные скрипты, если появятся
  'init_products.js', // если нужно наполнить тестовыми товарами
  // 'import_products_from_csv.js', // если нужно импортировать из CSV
];

scripts.forEach(script => {
  try {
    console.log(`\n=== Запуск: ${script} ===`);
    execSync(`node ${script}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Ошибка при выполнении ${script}:`, e.message);
  }
});

console.log('\nВсе миграции и наполнение базы завершены!');
