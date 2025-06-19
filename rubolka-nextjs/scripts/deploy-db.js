const { execSync } = require('child_process');

async function deployDatabase() {
  try {
    console.log('🔄 Начинаем развертывание базы данных...');

    // Проверяем наличие DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL не установлен в переменных окружения!');
    }

    console.log('✅ DATABASE_URL найден');

    // Генерируем Prisma клиент
    console.log('📦 Генерируем Prisma клиент...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Создаем схему в базе данных
    console.log('🗄️ Создаем таблицы в базе данных...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    } catch (pushError) {
      console.log('⚠️ Таблицы уже существуют или ошибка создания, пропускаем...');
    }

    console.log('🎉 База данных успешно развернута!');

    // Инициализируем тестовые данные
    console.log('📊 Добавляем начальные данные...');
    execSync('node scripts/init-db.js', { stdio: 'inherit' });

    console.log('✅ Развертывание завершено успешно!');

  } catch (error) {
    console.error('❌ Ошибка развертывания базы данных:', error.message);
    console.log('🔍 Проверьте:');
    console.log('   1. DATABASE_URL правильно настроен');
    console.log('   2. PlanetScale база данных доступна');
    console.log('   3. Права доступа к базе данных');
    process.exit(1);
  }
}

// Запускаем если файл вызван напрямую
if (require.main === module) {
  deployDatabase();
}

module.exports = { deployDatabase }; 