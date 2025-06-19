# ⚡ Быстрое развертывание на Railway

## 🎯 За 5 минут до деплоя

### 1. MongoDB Atlas (2 минуты)
```bash
1. Зайти на mongodb.com/atlas
2. Создать кластер (бесплатный M0)
3. Создать пользователя DB
4. Скопировать строку подключения
```

### 2. Railway деплой (3 минуты)
```bash
1. Зайти на railway.app
2. New Project → Deploy from GitHub
3. Выбрать репозиторий
4. Добавить переменные окружения:
   - MONGODB_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secret_key_here
   - NODE_ENV=production
```

## 🔑 Обязательные переменные
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rubolka
JWT_SECRET=супер-секретный-ключ-для-jwt
```

## 📁 Готовые файлы
- ✅ `railway.json` - конфигурация Railway
- ✅ `Procfile` - команда запуска
- ✅ `nixpacks.toml` - настройки сборки
- ✅ `package.json` - обновлен для Railway

## 🚀 Проверка готовности
```bash
npm run railway:check
```

## 🌐 После деплоя
- **Сайт**: `https://ваш-домен.railway.app`
- **Админ**: `https://ваш-домен.railway.app/admin.html`
- **Логи**: в панели Railway

## 🔧 Отладка
```bash
# Проверить логи
railway logs

# Локальная проверка
npm start
```

Railway автоматически:
- 🔄 Пересобирает при git push
- 📈 Масштабирует под нагрузкой  
- 🛡️ Обеспечивает HTTPS
- 📊 Показывает метрики

**Готово! 🎉** 