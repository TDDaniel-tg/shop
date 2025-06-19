#!/usr/bin/env node

/**
 * Railway Deployment Script for RUBOLKA
 * Автоматическая настройка для развертывания на Railway
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 RUBOLKA Railway Deployment Setup');
console.log('=====================================');

// Проверяем наличие необходимых файлов
const requiredFiles = [
    'package.json',
    'server/server.js',
    'railway.json',
    'Procfile',
    'nixpacks.toml'
];

console.log('\n📋 Проверка файлов конфигурации:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} - найден`);
    } else {
        console.log(`❌ ${file} - отсутствует`);
    }
});

// Проверяем package.json
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    console.log('\n🔧 Проверка package.json:');
    console.log(`✅ Name: ${packageJson.name}`);
    console.log(`✅ Version: ${packageJson.version}`);
    console.log(`✅ Main: ${packageJson.main}`);
    
    if (packageJson.engines) {
        console.log(`✅ Node version: ${packageJson.engines.node}`);
        console.log(`✅ NPM version: ${packageJson.engines.npm}`);
    } else {
        console.log('⚠️  Engines не указаны в package.json');
    }
    
    if (packageJson.scripts.start) {
        console.log(`✅ Start script: ${packageJson.scripts.start}`);
    } else {
        console.log('❌ Start script отсутствует');
    }
    
} catch (error) {
    console.log('❌ Ошибка чтения package.json:', error.message);
}

// Информация о переменных окружения
console.log('\n🔐 Переменные окружения для Railway:');
console.log('=====================================');
console.log('MONGODB_URI - строка подключения к MongoDB Atlas');
console.log('JWT_SECRET - секретный ключ для JWT токенов');
console.log('PORT - порт сервера (автоматически от Railway)');
console.log('NODE_ENV - production');
console.log('ADMIN_EMAIL - email администратора (опционально)');
console.log('ADMIN_PASSWORD - пароль администратора (опционально)');

// Команды для развертывания
console.log('\n📦 Команды для развертывания:');
console.log('=============================');
console.log('1. Загрузите код в GitHub репозиторий');
console.log('2. Зайдите на railway.app и создайте новый проект');
console.log('3. Выберите "Deploy from GitHub repo"');
console.log('4. Настройте переменные окружения');
console.log('5. Railway автоматически развернет приложение');

console.log('\n🔗 Полезные ссылки:');
console.log('==================');
console.log('Railway: https://railway.app');
console.log('MongoDB Atlas: https://cloud.mongodb.com');
console.log('Документация: ./RAILWAY_DEPLOY.md');

console.log('\n✨ Готово! Ваш проект готов к развертыванию на Railway.'); 