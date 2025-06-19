# Исправление проблемы с развертыванием на Railway

## Проблема
Ошибка с nixpacks: `undefined variable 'npm'`

## Решение

### 1. Удалили проблемную конфигурацию nixpacks
- Удален файл с некорректной конфигурацией `[nodejs_18, npm]`

### 2. Создали новую конфигурацию nixpacks.toml
```toml
[variables]
NODE_ENV = "production"

[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["cd rubolka-nextjs && npm ci"]

[phases.build]
cmds = ["cd rubolka-nextjs && npm run build"]

[start]
cmd = "cd rubolka-nextjs && npm start"
```

### 3. Создали Dockerfile как альтернативу
- Dockerfile в папке `rubolka-nextjs/`
- .dockerignore для оптимизации

### 4. Обновили package.json в корне
- Скрипты для работы с Next.js проектом
- Правильные команды build и start

## Варианты развертывания

### Вариант 1: Nixpacks (рекомендуется)
1. Оставить файл `nixpacks.toml` в корне
2. Railway автоматически использует nixpacks

### Вариант 2: Dockerfile
1. Удалить `nixpacks.toml`
2. Railway автоматически найдет Dockerfile в `rubolka-nextjs/`

### Вариант 3: Railway автодетект
1. Удалить и `nixpacks.toml` и `Dockerfile`
2. Railway автоматически определит проект как Node.js

## Переменные окружения для Railway
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_railway_domain
```

## Команды для развертывания
```bash
# Если используете Railway CLI
railway up

# Или подключите к Git репозиторию через Railway Dashboard
```

## Проверка после развертывания
1. Админ панель: `https://your-domain.railway.app/admin`
2. Логин: admin / admin123
3. Каталог: `https://your-domain.railway.app/catalog` 