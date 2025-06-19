# Настройка MongoDB для RUBOLKA

## Проблема
Товары не сохраняются в базе данных - они исчезают после перезагрузки сервера.

## Решение
Подключили реальную базу данных MongoDB вместо временных переменных.

## Что было сделано:

### 1. Создали подключение к MongoDB
- `rubolka-nextjs/src/lib/mongodb.ts` - подключение к базе данных
- Использует переменную окружения `MONGODB_URI`

### 2. Создали модели данных
- `rubolka-nextjs/src/models/Product.ts` - модель товара
- `rubolka-nextjs/src/models/Order.ts` - модель заказа

### 3. Обновили API роуты
- `rubolka-nextjs/src/app/api/products/route.ts` - теперь работает с MongoDB
- `rubolka-nextjs/src/app/api/orders/route.ts` - теперь работает с MongoDB

### 4. Создали скрипт инициализации
- `rubolka-nextjs/scripts/init-db.js` - добавляет начальные товары в базу

## Инструкция по запуску:

### Вариант 1: Локальная MongoDB

1. **Установите MongoDB:**
   ```bash
   # Windows (с Chocolatey)
   choco install mongodb
   
   # macOS (с Homebrew)
   brew install mongodb/brew/mongodb-community
   
   # Ubuntu/Debian
   sudo apt install mongodb
   ```

2. **Запустите MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongodb
   ```

3. **Создайте файл .env.local:**
   ```bash
   cd rubolka-nextjs
   echo "MONGODB_URI=mongodb://localhost:27017/rubolka" > .env.local
   ```

4. **Инициализируйте базу данных:**
   ```bash
   npm run init-db
   ```

5. **Запустите приложение:**
   ```bash
   npm run dev
   ```

### Вариант 2: MongoDB Atlas (облачная база)

1. **Создайте аккаунт на MongoDB Atlas:**
   - Перейдите на https://cloud.mongodb.com/
   - Создайте бесплатный кластер

2. **Получите строку подключения:**
   - В панели Atlas нажмите "Connect"
   - Выберите "Connect your application"
   - Скопируйте строку подключения

3. **Создайте файл .env.local:**
   ```bash
   cd rubolka-nextjs
   echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rubolka?retryWrites=true&w=majority" > .env.local
   ```

4. **Инициализируйте базу данных:**
   ```bash
   npm run init-db
   ```

## Для развертывания на Railway:

1. **Создайте базу данных на MongoDB Atlas**

2. **Добавьте переменную окружения в Railway:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rubolka?retryWrites=true&w=majority
   ```

3. **После развертывания инициализируйте базу:**
   ```bash
   railway run npm run init-db
   ```

## Проверка работы:

1. Откройте админ панель: `http://localhost:3000/admin`
2. Войдите: `admin` / `admin123`
3. Добавьте товар
4. Перезапустите сервер
5. Проверьте, что товар остался в каталоге

## Структура данных:

### Product (Товар):
```javascript
{
  name: String,        // Название
  price: Number,       // Цена
  category: String,    // Категория (women/men/unisex)
  description: String, // Описание
  image: String,       // Путь к изображению
  colors: [String],    // Доступные цвета
  sizes: [String],     // Доступные размеры
  material: String,    // Материал
  createdAt: Date,     // Дата создания
  updatedAt: Date      // Дата обновления
}
```

### Order (Заказ):
```javascript
{
  customerName: String,
  email: String,
  phone: String,
  products: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  totalAmount: Number,
  status: String,      // pending/processing/completed/cancelled
  createdAt: Date
}
``` 