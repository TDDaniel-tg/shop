// Тестовые данные для локальной разработки без базы данных

const initialProducts = [
  {
    id: '1',
    name: "Классическая футболка унисекс",
    price: 450,
    category: "unisex",
    description: "Удобная базовая футболка из 100% хлопка. Идеально подходит для повседневной носки.",
    image: "/assets/catalog/placeholder.svg",
    colors: ["белый", "черный", "серый", "синий"],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Хлопок 100%",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: "Женская приталенная футболка",
    price: 390,
    category: "women",
    description: "Стильная приталенная модель специально для женщин. Подчеркивает фигуру.",
    image: "/assets/catalog/placeholder.svg",
    colors: ["розовый", "белый", "лавандовый", "мятный"],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Хлопок 95%, эластан 5%",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: "Мужская oversize футболка",
    price: 520,
    category: "men",
    description: "Свободная мужская футболка в стиле oversize. Модный и комфортный крой.",
    image: "/assets/catalog/placeholder.svg",
    colors: ["черный", "белый", "хаки", "темно-синий"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "Хлопок 100%",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const initialOrders = [
  {
    id: '1',
    customerName: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 900 123-45-67",
    totalAmount: 1360,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: '1',
        productId: '1',
        productName: "Классическая футболка унисекс",
        quantity: 2,
        size: "L",
        color: "черный",
        price: 450
      },
      {
        id: '2',
        productId: '2',
        productName: "Женская приталенная футболка",
        quantity: 1,
        size: "M",
        color: "розовый", 
        price: 390
      }
    ]
  }
]

// 🚀 СЕРВЕРНОЕ хранилище в памяти (работает между запросами)
class ServerStorage {
  private static products: any[] = [...initialProducts]
  private static orders: any[] = [...initialOrders]
  private static initialized = false

  private static init() {
    if (!this.initialized) {
      console.log('🔄 Инициализация серверного хранилища')
      this.products = [...initialProducts]
      this.orders = [...initialOrders]
      this.initialized = true
    }
  }

  static getAllProducts() {
    this.init()
    return [...this.products] // Возвращаем копию
  }

  static createProduct(productData: any) {
    this.init()
    const newProduct = {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.products.push(newProduct)
    console.log(`✅ Товар добавлен в память: "${newProduct.name}" (ID: ${newProduct.id})`)
    console.log(`📦 Всего товаров в памяти: ${this.products.length}`)
    return newProduct
  }

  static updateProduct(id: string, updateData: any) {
    this.init()
    const index = this.products.findIndex((p: any) => p.id === id)
    
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      console.log(`✅ Товар обновлен: "${this.products[index].name}" (ID: ${id})`)
      return this.products[index]
    }
    
    console.log(`❌ Товар не найден для обновления: ${id}`)
    return null
  }

  static deleteProduct(id: string) {
    this.init()
    const initialLength = this.products.length
    this.products = this.products.filter((p: any) => p.id !== id)
    
    if (this.products.length !== initialLength) {
      console.log(`✅ Товар удален: ${id}`)
      console.log(`📦 Осталось товаров в памяти: ${this.products.length}`)
      return true
    }
    
    console.log(`❌ Товар не найден для удаления: ${id}`)
    return false
  }

  static getAllOrders() {
    this.init()
    return [...this.orders] // Возвращаем копию
  }

  static createOrder(orderData: any) {
    this.init()
    const newOrder = {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.orders.push(newOrder)
    console.log(`✅ Заказ добавлен: ${newOrder.customerName} (ID: ${newOrder.id})`)
    return newOrder
  }

  // Метод для отладки
  static getStorageInfo() {
    this.init()
    return {
      products: this.products.length,
      orders: this.orders.length,
      initialized: this.initialized,
      productIds: this.products.map((p: any) => p.id)
    }
  }
}

// Экспортируем старые переменные для обратной совместимости
export const mockProducts = ServerStorage.getAllProducts()
export const mockOrders = ServerStorage.getAllOrders()

// Экспортируем новый API
export { ServerStorage as MockStorage }

// Функция для проверки доступности базы данных
export const isDatabaseAvailable = () => {
  // Простая проверка - если DATABASE_URL есть и не является заглушкой
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.log('🔄 DATABASE_URL not found, using mock data')
    return false
  }
  
  // Проверяем что это не локальная заглушка
  if (dbUrl.includes('localhost') || dbUrl.includes('password@localhost')) {
    console.log('🔄 Local development detected, using mock data')
    return false
  }
  
  // Если URL выглядит как настоящий (содержит домен)
  if (dbUrl.includes('planetscale.app') || dbUrl.includes('railway') || dbUrl.includes('mysql://') && !dbUrl.includes('localhost')) {
    console.log('✅ Real database detected, using Prisma')
    return true
  }
  
  console.log('🔄 Database URL not recognized, using mock data')
  return false
} 