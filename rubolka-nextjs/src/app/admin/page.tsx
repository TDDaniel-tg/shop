'use client'

import { useState, useEffect } from 'react'

interface Product {
  _id: string
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
  _id: string
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
    category: 'women',
    description: '',
    material: 'Хлопок 100%',
    colors: '',
    sizes: ''
  })

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

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
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Неверные данные для входа')
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const colorsArray = productForm.colors.split(',').map(c => c.trim()).filter(c => c)
      const sizesArray = productForm.sizes.split(',').map(s => s.trim()).filter(s => s)

      const productData = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        description: productForm.description,
        material: productForm.material,
        colors: colorsArray,
        sizes: sizesArray
      }

      let response
      if (editingProduct) {
        // Update existing product
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...productData, _id: editingProduct._id })
        })
      } else {
        // Create new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      }

      const result = await response.json()
      if (result.success) {
        await fetchProducts()
        setShowProductModal(false)
        resetProductForm()
        alert(editingProduct ? 'Товар обновлен!' : 'Товар добавлен!')
      } else {
        alert(result.error || 'Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ошибка при сохранении товара')
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
      sizes: product.sizes.join(', ')
    })
    setShowProductModal(true)
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'women',
      description: '',
      material: 'Хлопок 100%',
      colors: '',
      sizes: ''
    })
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    resetProductForm()
    setShowProductModal(true)
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
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                placeholder="admin123"
              />
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
                  className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Добавить товар
                </button>
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
                        <th className="px-4 py-2 text-left text-gray-300">Название</th>
                        <th className="px-4 py-2 text-left text-gray-300">Категория</th>
                        <th className="px-4 py-2 text-left text-gray-300">Цена</th>
                        <th className="px-4 py-2 text-left text-gray-300">Дата создания</th>
                        <th className="px-4 py-2 text-left text-gray-300">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id} className="border-b border-gray-600">
                          <td className="px-4 py-2 text-gray-300">{product.name}</td>
                          <td className="px-4 py-2 text-gray-300">{product.category}</td>
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
                              onClick={() => handleDeleteProduct(product._id)}
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
                      <tr key={order._id} className="border-b border-gray-600">
                        <td className="px-4 py-2 text-gray-300">#{order._id}</td>
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
                    <option value="women">Женские</option>
                    <option value="men">Мужские</option>
                    <option value="unisex">Унисекс</option>
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
                  className="flex-1 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  {editingProduct ? 'Обновить товар' : 'Добавить товар'}
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