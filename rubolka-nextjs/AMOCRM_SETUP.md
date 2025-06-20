# 🔧 Настройка интеграции с AmoCRM

## 📋 Что было изменено

✅ **Удалены поля Email** из всех форм сайта  
✅ **Настроена интеграция с AmoCRM** для автоматической отправки заявок  
✅ **Добавлена обработка ошибок** и fallback механизмы  

## 🔑 Настройка AmoCRM

### 1. Получение токена доступа

1. Зайдите в ваш AmoCRM аккаунт
2. Перейдите в **Настройки → Интеграции → API**
3. Создайте новую интеграцию или используйте существующую
4. Скопируйте **Access Token**

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# AmoCRM Configuration
AMOCRM_SUBDOMAIN="your-subdomain"
AMOCRM_ACCESS_TOKEN="your-access-token"
```

**Где найти subdomain:**
- URL вашего AmoCRM: `https://your-subdomain.amocrm.ru`
- В настройках аккаунта AmoCRM

### 3. Настройка полей в AmoCRM

Убедитесь что в AmoCRM настроены поля:
- **PHONE** - для телефона клиента
- **TEXTAREA** - для сообщения/комментария

## 🚀 Как это работает

### Процесс обработки заявки:

1. **Пользователь заполняет форму** (имя + телефон + сообщение)
2. **API отправляет данные в AmoCRM** через REST API
3. **Создается новый лид** с информацией о клиенте
4. **Менеджер получает уведомление** в AmoCRM

### Fallback механизмы:

- ❌ **AmoCRM недоступен** → Заявка сохраняется локально в логах
- ❌ **Неверный токен** → Показывается сообщение об успехе, но заявка в логах
- ❌ **Сетевая ошибка** → Пользователь видит номер телефона для звонка

## 📞 Тестирование

1. Заполните форму на сайте
2. Проверьте логи сервера: `npm run dev`
3. Проверьте появление лида в AmoCRM

## 🔧 Отладка

**Логи в консоли покажут:**
- ✅ `Лид успешно создан в AmoCRM`
- ❌ `Ошибка AmoCRM API`
- 🔄 `AmoCRM не настроен, сохраняем локально`

**Проверка настроек:**
```bash
# Проверить переменные окружения
echo $AMOCRM_SUBDOMAIN
echo $AMOCRM_ACCESS_TOKEN
```

## 📊 Мониторинг заявок

Все заявки логируются в консоль сервера со следующей информацией:
- Имя клиента
- Телефон
- Сообщение
- Время отправки
- Источник (website)
- ID лида в AmoCRM (если успешно)

## 🔄 Обновление токена

AmoCRM токены имеют срок действия. При истечении:
1. Обновите токен в настройках AmoCRM
2. Обновите переменную `AMOCRM_ACCESS_TOKEN`
3. Перезапустите сервер 