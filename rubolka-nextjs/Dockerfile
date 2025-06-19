# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы
COPY . .

# Создаем директорию для uploads
RUN mkdir -p uploads/products

# Собираем приложение
RUN npm run build

# Экспонируем порт
EXPOSE 3000

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Запускаем приложение
CMD ["npm", "start"] 