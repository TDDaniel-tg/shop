# Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# База данных MongoDB
MONGODB_URI=mongodb://localhost:27017/rubolka

# JWT секрет для аутентификации (измените в продакшене!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Настройки загрузки файлов
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,video/mp4

# Email настройки для отправки уведомлений
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Порт сервера
PORT=5000

# Режим окружения (development/production)
NODE_ENV=development
```

## Важные замечания:

1. **JWT_SECRET** - обязательно смените на уникальный ключ в продакшене
2. **EMAIL_USER и EMAIL_PASS** - настройте для отправки уведомлений
3. **MONGODB_URI** - укажите правильный путь к вашей базе данных

## Создание админа

После первого запуска создайте администратора с помощью:

```bash
node server/seed.js
```

Логин по умолчанию:
- Email: admin@rubolka.ru
- Пароль: admin123 (обязательно смените!) 