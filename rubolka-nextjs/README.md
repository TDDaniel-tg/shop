# 🚀 RUBOLKA - Next.js E-commerce

Современный интернет-магазин оптовой продажи футболок, построенный на Next.js 15 с TypeScript и Tailwind CSS.

## ✨ Особенности

- 🎨 **Современный дизайн** - Полностью адаптивный UI с Tailwind CSS
- ⚡ **Высокая производительность** - Server-Side Rendering с Next.js 15
- 🔧 **TypeScript** - Типизированный код для надежности
- 📱 **Мобильная адаптация** - Отзывчивый дизайн для всех устройств
- 🛡️ **Безопасность** - JWT аутентификация для админ панели
- 📧 **Email интеграция** - Автоматическая отправка писем
- 💾 **База данных** - MongoDB с Mongoose ODM
- 🎯 **SEO оптимизация** - Метаданные и структурированная разметка

## 🛠️ Технологический стек

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **React 19** - Современная библиотека UI
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS фреймворк
- **Montserrat** - Веб-шрифт от Google Fonts

### Backend
- **Next.js API Routes** - Серверные функции
- **MongoDB** - NoSQL база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - JSON Web Tokens для аутентификации
- **Nodemailer** - Отправка email
- **Bcrypt** - Хеширование паролей

### DevOps
- **Railway** - Платформа для деплоя
- **Nixpacks** - Build система
- **ESLint** - Линтер кода
- **PostCSS** - CSS процессор

## 🚀 Быстрый старт

### Установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd rubolka-nextjs

# Установите зависимости
npm install

# Создайте .env.local файл
cp .env.example .env.local
```

### Конфигурация

Создайте `.env.local` файл:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rubolka

# JWT Secret (минимум 32 символа)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Email configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Запуск разработки

```bash
# Запуск в режиме разработки
npm run dev

# Открыть http://localhost:3000
```

### Сборка и запуск продакшн

```bash
# Сборка проекта
npm run build

# Запуск продакшн сервера
npm run start
```

## 📖 Структура проекта

```
rubolka-nextjs/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── admin/          # Админ панель
│   │   ├── api/            # API маршруты
│   │   │   ├── contact/    # Контактные формы
│   │   │   ├── orders/     # Управление заказами
│   │   │   └── products/   # Управление товарами
│   │   ├── catalog/        # Каталог товаров
│   │   ├── globals.css     # Глобальные стили
│   │   ├── layout.tsx      # Корневой layout
│   │   └── page.tsx        # Главная страница
│   └── components/         # React компоненты
│       ├── Header.tsx      # Навигация
│       ├── Hero.tsx        # Главная секция
│       ├── Advantages.tsx  # Преимущества
│       ├── VideoGallery.tsx # Видео галерея
│       ├── Catalog.tsx     # Превью каталога
│       ├── About.tsx       # О производстве
│       ├── Calculator.tsx  # Калькулятор стоимости
│       ├── Contacts.tsx    # Контакты и формы
│       ├── Footer.tsx      # Подвал сайта
│       └── Preloader.tsx   # Загрузчик
├── public/                 # Статические файлы
│   └── assets/            # Изображения и иконки
├── tailwind.config.ts     # Конфигурация Tailwind
├── next.config.js         # Конфигурация Next.js
└── package.json           # Зависимости проекта
```

## 🎯 Основные функции

### Главная страница
- Форма запроса каталога
- Секция преимуществ с иконками
- Видео галерея продукции
- Калькулятор стоимости заказа
- Контактная информация

### Каталог товаров
- Фильтрация по категориям
- Адаптивная сетка товаров
- Подробная информация о товарах
- Интеграция с API

### Админ панель (`/admin`)
- Авторизация (admin/admin123)
- Управление товарами
- Просмотр заказов
- Безопасный доступ с JWT

### API Endpoints
- `GET/POST /api/products` - Управление товарами
- `GET/POST /api/orders` - Управление заказами
- `POST /api/contact` - Обработка форм

## 🎨 Компоненты и стили

### Preloader
Анимированный загрузчик с брендингом:
- Логотип с пульсацией
- Градиентный фон
- Spinner анимация
- Автоскрытие через 2 секунды

### Адаптивный дизайн
- Mobile-first подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Гибкие сетки и flexbox
- Оптимизированные изображения

### Кастомные стили
- Цветовая палитра с primary (#F9E547)
- Типографика Montserrat
- Компонентные классы (.btn, .section, .container)
- CSS анимации и переходы

## 📧 Email конфигурация

### Gmail настройка
1. Включите 2FA в Google аккаунте
2. Перейдите в "Безопасность" → "Пароли приложений"
3. Создайте пароль для приложения
4. Используйте его в `EMAIL_PASS`

### Другие провайдеры
Проект поддерживает любые SMTP серверы. Обновите конфигурацию в API маршрутах.

## 🗄️ База данных

### MongoDB схемы

**Products:**
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  category: String, // 'women', 'men', 'unisex'
  image: String,
  sizes: [String],
  colors: [String],
  createdAt: Date
}
```

**Orders:**
```javascript
{
  _id: ObjectId,
  customerName: String,
  email: String,
  phone: String,
  products: [{
    productId: String,
    productName: String,
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  totalAmount: Number,
  status: String, // 'pending', 'processing', 'completed'
  createdAt: Date
}
```

## 🚀 Деплой на Railway

### Автоматический деплой
1. Подключите GitHub репозиторий к Railway
2. Выберите `rubolka-nextjs` как root директорию
3. Настройте переменные окружения
4. Деплой запустится автоматически

### Переменные окружения для продакшн
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rubolka
JWT_SECRET=your-super-secret-production-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_API_URL=https://your-app.railway.app
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-production-nextauth-secret
```

### Мониторинг
Railway предоставляет:
- Логи в реальном времени
- Метрики производительности
- Health checks
- Автоматические рестарты

## 🔧 Скрипты

```bash
# Разработка
npm run dev          # Запуск в dev режиме

# Сборка
npm run build        # Сборка для продакшн
npm run start        # Запуск продакшн сервера

# Качество кода
npm run lint         # ESLint проверка
npm run type-check   # TypeScript проверка
```

## 🐛 Troubleshooting

### Проблемы сборки
```bash
# Очистка кэша
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Проблемы с MongoDB
- Проверьте connection string
- Убедитесь в доступности сети
- Проверьте whitelist IP в MongoDB Atlas

### Проблемы с email
- Убедитесь в правильности App Password
- Проверьте настройки 2FA в Google
- Попробуйте другой SMTP провайдер

### Проблемы с Tailwind
- Убедитесь что файлы включены в `content` конфиге
- Проверьте правильность CSS импортов
- Очистите CSS кэш

## 📝 Лицензия

MIT License - свободное использование для коммерческих и некоммерческих проектов.

## 👥 Поддержка

Для технической поддержки:
- Создайте issue в GitHub репозитории
- Напишите на email: support@rubolka.ru
- Телефон: +7 937 560-64-02

---

**🎉 Проект готов к продакшн использованию!**

Развертывайте на Railway, настраивайте переменные окружения и запускайте свой интернет-магазин.
