const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const initialProducts = [
  {
    name: "Классическая футболка унисекс",
    price: 45000, // 450 рублей в копейках
    category: "unisex",
    description: "Удобная базовая футболка из 100% хлопка. Идеально подходит для повседневной носки.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["белый", "черный", "серый", "синий"]),
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    material: "Хлопок 100%"
  },
  {
    name: "Женская приталенная футболка",
    price: 39000, // 390 рублей в копейках
    category: "women",
    description: "Стильная приталенная модель специально для женщин. Подчеркивает фигуру.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["розовый", "белый", "лавандовый", "мятный"]),
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    material: "Хлопок 95%, эластан 5%"
  },
  {
    name: "Мужская oversize футболка",
    price: 52000, // 520 рублей в копейках
    category: "men",
    description: "Свободная мужская футболка в стиле oversize. Модный и комфортный крой.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["черный", "белый", "хаки", "темно-синий"]),
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    material: "Хлопок 100%"
  },
  {
    name: "Премиум футболка унисекс",
    price: 67500, // 675 рублей в копейках
    category: "unisex",
    description: "Футболка премиум качества из органического хлопка. Мягкая и долговечная.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["белый", "кремовый", "светло-серый"]),
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
    material: "Органический хлопок 100%"
  },
  {
    name: "Женская футболка с принтом",
    price: 55000, // 550 рублей в копейках
    category: "women",
    description: "Яркая женская футболка с авторским принтом. Для тех, кто любит выделяться.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["коралловый", "мятный", "лавандовый"]),
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
    material: "Хлопок 100%"
  },
  {
    name: "Мужская спортивная футболка",
    price: 59000, // 590 рублей в копейках
    category: "men",
    description: "Технологичная спортивная футболка с отводом влаги. Для активного образа жизни.",
    image: "/assets/catalog/placeholder.svg",
    colors: JSON.stringify(["черный", "серый", "синий", "красный"]),
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    material: "Полиэстер 65%, хлопок 35%"
  }
]

async function initializeDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...')

    // Проверяем, есть ли уже товары
    const existingProducts = await prisma.product.count()
    
    if (existingProducts > 0) {
      console.log(`✅ В базе уже есть ${existingProducts} товаров. Пропускаем инициализацию.`)
      return
    }

    // Добавляем начальные товары
    console.log('📦 Добавляем начальные товары...')
    
    for (const product of initialProducts) {
      await prisma.product.create({
        data: product
      })
      console.log(`✅ Добавлен товар: ${product.name}`)
    }

    console.log('🎉 База данных успешно инициализирована!')
    console.log(`📊 Добавлено товаров: ${initialProducts.length}`)

  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем только если файл вызван напрямую
if (require.main === module) {
  initializeDatabase()
}

module.exports = { initializeDatabase } 