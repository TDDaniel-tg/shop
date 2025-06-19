# RUBOLKA Next.js - Деплой на Railway

## Быстрый деплой

1. **Подключите репозиторий к Railway:**
   - Войдите в [Railway](https://railway.app)
   - Создайте новый проект
   - Подключите этот GitHub репозиторий
   - Выберите папку `rubolka-nextjs` как корневую

2. **Настройте переменные окружения:**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NEXT_PUBLIC_API_URL=https://your-app.railway.app
   NEXTAUTH_URL=https://your-app.railway.app
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

3. **Деплой запустится автоматически**

## Структура проекта

```
shop/
├── rubolka-nextjs/          # Next.js приложение
│   ├── src/
│   │   ├── app/            # App Router
│   │   │   ├── api/        # API routes
│   │   │   ├── catalog/    # Каталог
│   │   │   └── admin/      # Админ панель
│   │   └── components/     # React компоненты
│   ├── public/             # Статические файлы
│   └── package.json
├── railway.json           # Railway конфигурация
└── nixpacks.toml         # Nixpacks конфигурация
```

## Особенности Next.js версии

✅ **Решены проблемы:**
- ❌ Ошибка "cannot get catalog" - **ИСПРАВЛЕНА**
- ❌ Медленная загрузка - **ИСПРАВЛЕНА**

✅ **Новые возможности:**
- 🚀 Server-Side Rendering (SSR)
- 📱 Полностью адаптивный дизайн
- ⚡ Preloader с анимацией
- 🎨 Современный UI с Tailwind CSS
- 🔧 TypeScript поддержка
- 📈 SEO оптимизация

## Технический стек

- **Frontend:** Next.js 15, React 19, TypeScript
- **Стилизация:** Tailwind CSS 4.0
- **База данных:** MongoDB с Mongoose
- **API:** Next.js API Routes
- **Аутентификация:** JWT
- **Email:** Nodemailer
- **Деплой:** Railway + Nixpacks

## Команды разработки

```bash
# Установка зависимостей
cd rubolka-nextjs
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Продакшн запуск
npm run start

# Линтинг
npm run lint
```

## База данных

Проект использует MongoDB. Для Railway рекомендуется:

1. **MongoDB Atlas** (рекомендуется):
   - Создайте кластер на [MongoDB Atlas](https://cloud.mongodb.com)
   - Получите connection string
   - Добавьте в переменную `MONGODB_URI`

2. **Railway MongoDB Plugin**:
   - Добавьте MongoDB plugin в Railway проект
   - Используйте автоматически созданный `DATABASE_URL`

## Email настройка

Для отправки писем через Gmail:

1. Включите 2FA в Google аккаунте
2. Создайте App Password
3. Используйте в переменных:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

## Админ панель

- **URL:** `/admin`
- **Логин:** admin
- **Пароль:** admin123

## API Endpoints

- `GET/POST /api/products` - Управление товарами
- `GET/POST /api/orders` - Управление заказами  
- `POST /api/contact` - Обработка контактных форм

## Troubleshooting

### Проблемы сборки
```bash
# Очистка кэша
rm -rf .next node_modules
npm install
npm run build
```

### Проблемы с базой данных
- Проверьте правильность `MONGODB_URI`
- Убедитесь что IP адрес Railway добавлен в whitelist MongoDB Atlas

### Проблемы с email
- Проверьте правильность App Password
- Убедитесь что 2FA включена в Google аккаунте

## Мониторинг

Railway предоставляет:
- Логи приложения в реальном времени
- Метрики производительности
- Автоматические health checks
- Rollback к предыдущим версиям

## Поддержка

Для технической поддержки создайте issue в репозитории или свяжитесь с разработчиком. 