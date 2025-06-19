# 🚀 Развертывание RUBOLKA на Railway

Это руководство поможет вам развернуть интернет-магазин RUBOLKA на платформе Railway.

## 📋 Предварительные требования

1. **Аккаунт Railway** - зарегистрируйтесь на [railway.app](https://railway.app)
2. **MongoDB Atlas** - создайте кластер на [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub репозиторий** - загрузите код в GitHub

## 🛠️ Пошаговая инструкция

### 1. Подготовка MongoDB Atlas

1. Создайте кластер MongoDB Atlas
2. Создайте пользователя базы данных
3. Добавьте IP-адрес `0.0.0.0/0` в whitelist
4. Скопируйте строку подключения

### 2. Развертывание на Railway

#### Вариант A: Через GitHub
1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите ваш репозиторий
5. Railway автоматически обнаружит Node.js приложение

#### Вариант B: Через Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Инициализируйте проект
railway init

# Разверните приложение
railway up
```

### 3. Настройка переменных окружения

В панели Railway добавьте следующие переменные:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rubolka

# JWT
JWT_SECRET=ваш-секретный-ключ-смените-в-продакшене

# Server
PORT=3000
NODE_ENV=production

# Admin (опционально)
ADMIN_EMAIL=admin@rubolka.ru
ADMIN_PASSWORD=admin123
```

### 4. Настройка домена (опционально)

1. В настройках проекта Railway перейдите в "Settings"
2. В разделе "Domains" добавьте свой домен
3. Настройте DNS записи у вашего провайдера

## 📁 Структура файлов конфигурации

```
shop/
├── railway.json          # Основная конфигурация Railway
├── Procfile              # Команда запуска
├── nixpacks.toml         # Конфигурация сборки
├── railway.env.example   # Пример переменных окружения
└── package.json          # Обновленный с engines и скриптами
```

## 🔧 Файлы конфигурации

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Procfile
```
web: node server/server.js
```

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['npm ci']

[start]
cmd = 'npm start'
```

## 🌐 После развертывания

1. **Проверьте логи** в панели Railway
2. **Откройте ваше приложение** по предоставленному URL
3. **Проверьте работу** всех функций
4. **Настройте мониторинг** и уведомления

## 🔍 Отладка

### Проверка логов
```bash
# Через CLI
railway logs

# Или в веб-интерфейсе Railway
```

### Частые проблемы

1. **Ошибка подключения к MongoDB**
   - Проверьте строку подключения
   - Убедитесь что IP `0.0.0.0/0` в whitelist

2. **Приложение не запускается**
   - Проверьте переменную `PORT`
   - Убедитесь что `start` скрипт корректен

3. **Статические файлы не загружаются**
   - Проверьте настройки Express для статических файлов

## 📞 Поддержка

- **Railway документация**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas документация**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## 🎉 Готово!

Ваш интернет-магазин RUBOLKA теперь развернут на Railway и готов к использованию!

**URL вашего приложения**: `https://your-app.railway.app`
**Админ-панель**: `https://your-app.railway.app/admin.html`

## 🔄 Обновления

Для обновления приложения просто отправьте изменения в GitHub репозиторий - Railway автоматически пересоберет и развернет новую версию. 