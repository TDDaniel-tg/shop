'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import QuickProductForm from '@/components/QuickProductForm'

interface Product {
  id?: string
  _id?: string  // для обратной совместимости
  name: string
  price: number
  category: string
  description: string
  image: string
  colors: string[]
  sizes: string[]
  material: string
  createdAt: string
}

interface Order {
  id?: string
  _id?: string  // для обратной совместимости
  customerName: string
  email: string
  phone: string
  products: Array<{
    productId: string
    quantity: number
    size: string
    color: string
  }>
  totalAmount: number
  status: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form data for new/edit product
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'tshirts',
    description: '',
    material: 'Хлопок 100%',
    colors: '',
    sizes: '',
    image: ''
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Login attempt:', {
      username: loginData.username,
      password: loginData.password,
      usernameMatch: loginData.username === 'admin',
      passwordMatch: loginData.password === 'admin123'
    })
    
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert(`Неверные данные для входа. 
Логин: ${loginData.username} (нужен: admin)
Пароль: ${loginData.password} (нужен: admin123)`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 5MB')
        return
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Выберите файл изображения')
        return
      }

      setSelectedFile(file)
      
      // Создаем оптимизированное превью
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          // Создаем canvas для сжатия изображения
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Устанавливаем максимальные размеры для превью
          const maxWidth = 300
          const maxHeight = 300
          let { width, height } = img
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx?.drawImage(img, 0, 0, width, height)
          setImagePreview(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) {
      return productForm.image || '/assets/catalog/placeholder.svg'
    }

    // Сжимаем изображение перед загрузкой
    const compressedFile = await compressImage(selectedFile)
    
    const formData = new FormData()
    formData.append('file', compressedFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Увеличиваем таймаут только для загрузки изображений
        signal: AbortSignal.timeout(10000) // 10 секунд
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        return result.filePath
      } else {
        throw new Error(result.error || 'Ошибка загрузки изображения')
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      throw error
    }
  }

  // Функция для сжатия изображения
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')
      
      img.onload = () => {
        // Максимальные размеры для оптимизации
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img
        
        // Пропорциональное изменение размера
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          }, 'image/jpeg', 0.7) // 70% качество для баланса размера и качества
        } else {
          resolve(file)
        }
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Быстрая валидация перед отправкой
    if (!productForm.name.trim()) {
      alert('Введите название товара')
      return
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      alert('Введите корректную цену')
      return
    }
    
    try {
      setUploading(true)
      
      const colorsArray = productForm.colors.split(',').map(c => c.trim()).filter(c => c)
      const sizesArray = productForm.sizes.split(',').map(s => s.trim()).filter(s => s)

      // Параллельная загрузка изображения и подготовка данных
      const promises: Promise<any>[] = []
      
      // Подготавливаем данные товара
      const productData = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        material: productForm.material,
        colors: colorsArray,
        sizes: sizesArray,
        image: productForm.image || '/assets/catalog/placeholder.svg'
      }

      // Если есть новое изображение, загружаем его
      if (selectedFile) {
        promises.push(uploadImage())
      } else {
        promises.push(Promise.resolve(productForm.image || '/assets/catalog/placeholder.svg'))
      }

      // Ждем загрузку изображения
      const [imagePath] = await Promise.all(promises)
      productData.image = imagePath

      console.log('💾 Saving product data:', { ...productData, image: productData.image?.substring(0, 50) + '...' })

      let response
      if (editingProduct) {
        // Update existing product
        const productId = getProductId(editingProduct)
        console.log('🔄 Updating product:', { productId })
        
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...productData, id: productId })
        })
      } else {
        // Create new product
        console.log('➕ Creating new product')
        
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      }

      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP Error:', response.status, errorText)
        alert(`Ошибка HTTP ${response.status}: ${errorText}`)
        return
      }
      
      const result = await response.json()
      console.log('📡 API Response data:', result)
      
      if (result.success) {
        // Оптимистичное обновление - не ждем полную перезагрузку
        setShowProductModal(false)
        resetProductForm()
        
        // Показываем успешное уведомление
        const notification = document.createElement('div')
        notification.innerHTML = `
          <div class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            ✅ ${editingProduct ? 'Товар обновлен!' : 'Товар добавлен!'}
          </div>
        `
        document.body.appendChild(notification)
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 3000)
        
        // Обновляем список товаров в фоне
        fetchProducts()
      } else {
        console.error('❌ API Error:', result.error)
        alert(result.error || 'Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('❌ Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Ошибка при сохранении товара')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const response = await fetch(`/api/products?id=${productId}`, {
          method: 'DELETE'
        })
        const result = await response.json()
        if (result.success) {
          await fetchProducts()
          alert('Товар удален!')
        } else {
          alert(result.error || 'Ошибка при удалении товара')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Ошибка при удалении товара')
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      material: product.material,
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      image: product.image || ''
    })
    setImagePreview(product.image || '')
    setSelectedFile(null)
    setShowProductModal(true)
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'tshirts',
      description: '',
      material: 'Хлопок 100%',
      colors: '',
      sizes: '',
      image: ''
    })
    setEditingProduct(null)
    setSelectedFile(null)
    setImagePreview('')
  }

  const handleAddProduct = () => {
    resetProductForm()
    setShowProductModal(true)
  }

  // Быстрое добавление товара без изображения
  const handleQuickProductSubmit = async (productData: any) => {
    try {
      setUploading(true)
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Быстрое уведомление
        const notification = document.createElement('div')
        notification.innerHTML = `
          <div class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            ⚡ Товар быстро добавлен!
          </div>
        `
        document.body.appendChild(notification)
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 2000)
        
        // Обновляем список в фоне
        fetchProducts()
      } else {
        throw new Error(result.error || 'Ошибка создания товара')
      }
    } catch (error) {
      console.error('Quick product creation error:', error)
      alert('Ошибка: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const getProductId = (product: Product): string => {
    return product.id || product._id || ''
  }

  const getOrderId = (order: Order): string => {
    return order.id || order._id || ''
  }

  const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      'tshirts': 'Футболки',
      'hoodies': 'Худи',
      'sweatshirts': 'Свитшоты',
      'longsleeves': 'Лонгсливы',
      'kids': 'Детская одежда',
      'caps': 'Кепки',
      // Поддержка старых категорий для обратной совместимости
      'women': 'Женские',
      'men': 'Мужские',
      'unisex': 'Унисекс'
    }
    return categoryNames[category] || category
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">Администратор</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Логин
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                placeholder="admin"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  placeholder="admin123"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    // Иконка "скрыть"
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    // Иконка "показать"
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Логин: <span className="text-green-400">admin</span> | Пароль: <span className="text-green-400">admin123</span>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Админ-панель RUBOLKA</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Товары ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Заказы ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              Аналитика
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Управление товарами</h2>
                <button 
                  onClick={handleAddProduct}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  📷 Полная форма
                </button>
              </div>
              
              {/* Быстрая форма добавления */}
              <div className="mb-8">
                <QuickProductForm 
                  onSubmit={handleQuickProductSubmit}
                  loading={uploading}
                />
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Загрузка...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">Изображение</th>
                        <th className="px-4 py-2 text-left text-gray-300">Название</th>
                        <th className="px-4 py-2 text-left text-gray-300">Категория</th>
                        <th className="px-4 py-2 text-left text-gray-300">Цена</th>
                        <th className="px-4 py-2 text-left text-gray-300">Дата создания</th>
                        <th className="px-4 py-2 text-left text-gray-300">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={getProductId(product)} className="border-b border-gray-600">
                          <td className="px-4 py-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                  onError={(e) => {
                                    console.log('❌ Image load error for:', product.image)
                                    e.currentTarget.src = '/assets/catalog/placeholder.svg'
                                  }}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">Нет фото</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-gray-300">{product.name}</td>
                          <td className="px-4 py-2 text-gray-300">{getCategoryName(product.category)}</td>
                          <td className="px-4 py-2 text-gray-300">{product.price} ₽</td>
                          <td className="px-4 py-2 text-gray-300">{product.createdAt}</td>
                          <td className="px-4 py-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-400 hover:text-blue-300 mr-2"
                            >
                              Редактировать
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(getProductId(product))}
                              className="text-red-400 hover:text-red-300"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-white">Управление заказами</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left text-gray-300">ID заказа</th>
                      <th className="px-4 py-2 text-left text-gray-300">Клиент</th>
                      <th className="px-4 py-2 text-left text-gray-300">Сумма</th>
                      <th className="px-4 py-2 text-left text-gray-300">Статус</th>
                      <th className="px-4 py-2 text-left text-gray-300">Дата</th>
                      <th className="px-4 py-2 text-left text-gray-300">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={getOrderId(order)} className="border-b border-gray-600">
                        <td className="px-4 py-2 text-gray-300">#{getOrderId(order)}</td>
                        <td className="px-4 py-2 text-gray-300">{order.customerName}</td>
                        <td className="px-4 py-2 text-gray-300">{order.totalAmount.toLocaleString()} ₽</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                            order.status === 'processing' ? 'bg-blue-900 text-blue-300' :
                            order.status === 'completed' ? 'bg-green-900 text-green-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {order.status === 'pending' ? 'Ожидание' :
                             order.status === 'processing' ? 'В обработке' :
                             order.status === 'completed' ? 'Выполнен' : 'Отменен'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{order.createdAt}</td>
                        <td className="px-4 py-2">
                          <button className="text-blue-400 hover:text-blue-300 mr-2">Подробнее</button>
                          <button className="text-green-400 hover:text-green-300">Обновить</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-white">Аналитика</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary bg-opacity-10 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-2 text-white">Общие продажи</h3>
                  <p className="text-3xl font-bold text-primary">₽ 450,000</p>
                  <p className="text-sm text-gray-400">За текущий месяц</p>
                </div>
                
                <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-2 text-white">Количество заказов</h3>
                  <p className="text-3xl font-bold text-green-400">127</p>
                  <p className="text-sm text-gray-400">За текущий месяц</p>
                </div>
                
                <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-2 text-white">Новые клиенты</h3>
                  <p className="text-3xl font-bold text-blue-400">23</p>
                  <p className="text-sm text-gray-400">За текущий месяц</p>
                </div>
              </div>
              
              <p className="text-gray-400">Подробная аналитика будет добавлена в следующих версиях.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Название товара
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Например: Мужская футболка базовая"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="450"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">
                    Категория
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="tshirts">Футболки</option>
                    <option value="hoodies">Худи</option>
                    <option value="sweatshirts">Свитшоты</option>
                    <option value="longsleeves">Лонгсливы</option>
                    <option value="kids">Детская одежда</option>
                    <option value="caps">Кепки</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Материал
                </label>
                <input
                  type="text"
                  value={productForm.material}
                  onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Хлопок 100%"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Изображение товара
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-yellow-400"
                  />
                  {imagePreview && (
                    <div className="relative w-32 h-32 border border-gray-600 rounded-lg overflow-hidden">
                                              <Image
                          src={imagePreview}
                          alt="Превью"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized
                          onError={(e) => {
                            console.log('❌ Preview image load error for:', imagePreview)
                            e.currentTarget.src = '/assets/catalog/placeholder.svg'
                          }}
                        />
                    </div>
                  )}
                  <p className="text-sm text-gray-400">
                    Поддерживаемые форматы: JPG, PNG, GIF, WebP. Максимальный размер: 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Описание
                </label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Описание товара..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Цвета (через запятую)
                </label>
                <input
                  type="text"
                  value={productForm.colors}
                  onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Белый, Черный, Серый"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Размеры (через запятую)
                </label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="XS, S, M, L, XL"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      {uploadProgress > 0 ? `Загрузка ${uploadProgress}%...` : 'Обработка...'}
                    </>
                  ) : (
                    editingProduct ? 'Обновить товар' : 'Добавить товар'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 