const fs = require('fs');
const path = require('path');

// Список файлов и папок для удаления
const itemsToDelete = [
  // Старые файлы проекта
  'package.json',
  'package-lock.json',
  // Папки
  'server',
  'uploads',
  'assets',
  // Конфиги
  'Procfile',
  'railway-deploy.js',
  'railway.env.example',
  'railway.simple.json',
  'ENV_SETUP.md',
  'FEATURES.md',
  'QUICK_DEPLOY.md',
  'RAILWAY_DEPLOY.md',
  'README.md'
];

console.log('🧹 Начинаю очистку старых файлов...\n');

itemsToDelete.forEach(item => {
  const itemPath = path.join(__dirname, item);
  
  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`✅ Удалена папка: ${item}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`✅ Удален файл: ${item}`);
      }
    } else {
      console.log(`⚠️  Не найден: ${item}`);
    }
  } catch (error) {
    console.log(`❌ Ошибка при удалении ${item}:`, error.message);
  }
});

console.log('\n🎉 Очистка завершена!');
console.log('📁 Остался только Next.js проект в папке rubolka-nextjs/');
console.log('\n📋 Следующие шаги:');
console.log('1. cd rubolka-nextjs');
console.log('2. npm install');
console.log('3. npm run dev');
console.log('\n🚀 Для деплоя на Railway используйте: RAILWAY_DEPLOY_NEXTJS.md'); 