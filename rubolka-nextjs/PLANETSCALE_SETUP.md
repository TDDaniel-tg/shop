# 🚀 Настройка PlanetScale MySQL для проекта RUBOLKA

## 📝 **Что такое PlanetScale?**

**PlanetScale** - это современная MySQL платформа с:
- ✅ **1GB бесплатно** (хватит на тысячи товаров и заказов)
- ✅ **Не слетает при деплоях** (персистентные данные)
- ✅ **Автобэкапы** и **высокая доступность**
- ✅ **Branching** - ветвление базы данных как в Git
- ✅ **Простая интеграция** с Railway и другими платформами

---

## 🔧 **Шаг 1: Регистрация на PlanetScale**

1. **Переходим на** → https://planetscale.com/
2. **Регистрируемся** через GitHub/Google/Email
3. **Подтверждаем почту** (если регистрировались по email)

---

## 🗄️ **Шаг 2: Создание базы данных**

### 1. Создание нового проекта:
```
1. Нажимаем "Create database"
2. Название: rubolka-shop (или любое другое)
3. Регион: выбираем ближайший (EU-West для России)
4. Нажимаем "Create database"
```

### 2. Ждем создания (1-2 минуты):
- ✅ База создается автоматически
- ✅ Создается ветка `main` (основная)

---

## 🔐 **Шаг 3: Получение строки подключения**

### 1. Переходим в настройки:
```
Database → Settings → Connection strings
```

### 2. Выбираем Prisma:
```
Framework: Prisma
Branch: main
```

### 3. Копируем DATABASE_URL:
```
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
```

⚠️ **ВАЖНО:** Эта строка содержит пароль - не коммитьте её в Git!

---

## 🌍 **Шаг 4: Настройка переменных окружения**

### 1. Локальная разработка (.env.local):
```bash
# В файле rubolka-nextjs/.env.local
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
```

### 2. На Railway (Production):
```bash
# В Railway Dashboard → Variables
DATABASE_URL=mysql://username:password@host/database?sslaccept=strict
```

---

## 🚀 **Шаг 5: Развертывание схемы базы данных**

### 1. Пушим схему в PlanetScale:
```bash
cd rubolka-nextjs
npm run db:push
```

### 2. Инициализируем данные:
```bash
npm run init-db
```

### 3. Проверяем результат:
```bash
npm run db:studio
```

---

## 📊 **Шаг 6: Управление данными**

### Prisma Studio (веб-интерфейс):
```bash
npm run db:studio
```
- Открывается http://localhost:5555
- Можно просматривать/редактировать данные
- Удобно для дебага

### PlanetScale Dashboard:
- Insights - статистика запросов
- Branches - управление ветками
- Settings - настройки безопасности

---

## 🔧 **Доступные команды**

```bash
# Генерация Prisma клиента
npm run db:generate

# Синхронизация схемы с базой
npm run db:push

# Открыть веб-интерфейс базы данных
npm run db:studio

# Инициализация тестовых данных
npm run init-db

# Сборка проекта (с генерацией клиента)
npm run build
```

---

## 🛠️ **Альтернативы PlanetScale**

Если PlanetScale не подходит, есть другие варианты:

### 1. **Railway PostgreSQL** (встроенная):
```bash
# В Railway Dashboard добавляем PostgreSQL
# Автоматически создаст DATABASE_URL
```

### 2. **Supabase** (PostgreSQL + фичи):
```bash
# https://supabase.com
# 500MB бесплатно + реалтайм + аутентификация
```

### 3. **Neon** (Serverless PostgreSQL):
```bash
# https://neon.tech
# 3GB бесплатно + автоскейлинг
```

---

## 🚨 **Частые проблемы и решения**

### ❌ **Connection timeout:**
```
Решение: Проверьте регион PlanetScale (выберите ближайший)
```

### ❌ **SSL certificate error:**
```
Решение: Добавьте ?sslaccept=strict в конец DATABASE_URL
```

### ❌ **Access denied:**
```
Решение: Перегенерируйте пароль в PlanetScale Dashboard
```

### ❌ **Prisma client not generated:**
```bash
npm run db:generate
```

---

## ✅ **Проверка работы**

После настройки проверьте:

1. **Админ панель:** http://localhost:3000/admin
2. **Каталог:** http://localhost:3000/catalog
3. **API товаров:** http://localhost:3000/api/products

Если все работает - можно деплоить на Railway! 🎉

---

## 📞 **Поддержка**

Если что-то не работает:
1. Проверьте переменную DATABASE_URL
2. Убедитесь что `npm run db:push` прошел успешно
3. Перезапустите сервер разработки

**PlanetScale** - надежное решение для продакшена! 🚀 