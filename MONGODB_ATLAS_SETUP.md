# Настройка MongoDB Atlas для Railway

## 🌍 MongoDB Atlas (Облачная база данных)

### Шаг 1: Регистрация и создание кластера

1. **Перейдите на https://cloud.mongodb.com/**
2. **Создайте аккаунт** или войдите
3. **Создайте новый проект:** "RUBOLKA"
4. **Создайте кластер:**
   - Выберите **FREE tier (M0 Sandbox)** - 512MB бесплатно
   - Регион: любой (рекомендуется ближайший)
   - Имя: `Cluster0`

### Шаг 2: Настройка безопасности

#### Создание пользователя:
1. Security → Database Access → Add New Database User
2. Authentication Method: Password
3. Username: `rubolka-admin`
4. Password: `RubolkaSecure2024!` (или сгенерируйте свой)
5. Database User Privileges: "Atlas admin"
6. Add User

#### Настройка IP доступа:
1. Security → Network Access → Add IP Address
2. Выберите "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
3. Add Entry

### Шаг 3: Получение строки подключения

1. Database → Clusters → Connect (кнопка)
2. "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Скопируйте строку подключения:

```
mongodb+srv://rubolka-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Шаг 4: Добавление в Railway

1. **Откройте ваш проект Railway**
2. **Variables (переменные)** 
3. **Добавьте переменную:**

```bash
Name: MONGODB_URI
Value: mongodb+srv://rubolka-admin:RubolkaSecure2024!@cluster0.xxxxx.mongodb.net/rubolka?retryWrites=true&w=majority
```

**Важно:** Замените:
- `<password>` на ваш реальный пароль
- `xxxxx` на ваш реальный кластер ID
- Добавьте `/rubolka` для имени базы данных

### Шаг 5: Проверка подключения

После добавления переменной Railway автоматически перезапустит приложение.

**Проверьте подключение:**
1. Откройте ваш сайт
2. Перейдите в админку: `https://ваш-домен.railway.app/admin`
3. Войдите: `admin` / `admin123`
4. Попробуйте добавить товар
5. Перезагрузите страницу - товар должен остаться

### Шаг 6: Инициализация данных (опционально)

Если хотите добавить начальные товары, используйте MongoDB Compass:

1. **Скачайте MongoDB Compass** (GUI для MongoDB)
2. **Подключитесь** используя ту же строку подключения
3. **Создайте коллекцию** `products` в базе `rubolka`
4. **Импортируйте** начальные данные

### 🔧 Альтернативные варианты:

#### Вариант 1: Railway MongoDB Plugin
1. В Railway: Add New → Database → Add MongoDB
2. Автоматически создается база данных
3. Переменная MONGODB_URI генерируется автоматически

#### Вариант 2: Другие облачные провайдеры
- **MongoDB Atlas** (рекомендуется) - 512MB бесплатно
- **PlanetScale** - MySQL альтернатива
- **FaunaDB** - serverless база данных

## 🚀 Пример финальной строки подключения:

```bash
MONGODB_URI=mongodb+srv://rubolka-admin:RubolkaSecure2024!@cluster0.abc123.mongodb.net/rubolka?retryWrites=true&w=majority
```

## ✅ Проверка работы:

1. Сайт загружается без ошибок
2. Админка доступна по адресу `/admin`
3. Можно добавлять/редактировать товары
4. Товары не исчезают после перезагрузки
5. Каталог отображает товары

## 🔍 Troubleshooting:

**Ошибка подключения:**
- Проверьте правильность пароля в строке подключения
- Убедитесь, что IP адрес 0.0.0.0/0 добавлен в Network Access
- Проверьте правильность имени пользователя

**Медленное подключение:**
- Выберите регион кластера ближе к Railway серверам
- Используйте Connection Pooling в настройках

**Ошибки авторизации:**
- Убедитесь, что пользователь имеет права "Atlas admin" или "Read and write to any database" 