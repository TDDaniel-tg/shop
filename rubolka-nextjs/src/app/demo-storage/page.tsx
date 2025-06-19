'use client'

import { useState, useEffect } from 'react'

export default function DemoStoragePage() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState('')
  const [loading, setLoading] = useState(false)
  const [storageInfo, setStorageInfo] = useState<any>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
        console.log('📦 Загружено товаров:', data.products.length)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const checkStorage = async () => {
    try {
      const res = await fetch('/api/debug')
      const data = await res.json()
      if (data.success) {
        setStorageInfo(data.storage)
        console.log('🔧 Состояние хранилища:', data.storage)
      }
    } catch (error) {
      console.error('Error checking storage:', error)
    }
  }

  const addProduct = async () => {
    if (!newProduct.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct,
          price: 299,
          category: 'unisex',
          description: 'Тестовый товар',
          colors: ['белый'],
          sizes: ['M'],
          material: 'Хлопок 100%'
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          console.log('✅ Товар добавлен:', data.product)
          await fetchProducts() // Перезагружаем список
          await checkStorage() // Обновляем инфо о хранилище
          setNewProduct('')
        }
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
    setLoading(false)
  }

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          console.log('✅ Товар удален:', id)
          await fetchProducts() // Перезагружаем список
          await checkStorage() // Обновляем инфо о хранилище
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const clearAddedProducts = async () => {
    try {
      const res = await fetch('/api/debug', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        console.log('🗑️ Очистка:', data.message)
        alert(data.message)
        await fetchProducts()
        await checkStorage()
      }
    } catch (error) {
      console.error('Error clearing products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    checkStorage()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Демо серверного хранилища</h1>
        
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">✅ ИСПРАВЛЕНО!</h2>
          <p className="mb-4">
            Теперь используется <strong>серверное хранилище в памяти</strong> вместо localStorage.
            Данные сохраняются между запросами на сервере!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-green-400">✅ Теперь работает:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Добавление товаров ✅</li>
                <li>Удаление товаров ✅</li>
                <li>Сохранение на сервере ✅</li>
                <li>Данные остаются после F5 ✅</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">ℹ️ Как работает:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Данные в памяти сервера</li>
                <li>Живут до перезапуска сервера</li>
                <li>Общие для всех пользователей</li>
                <li>Подходит для разработки</li>
              </ul>
            </div>
          </div>
        </div>

        {storageInfo && (
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">📊 Состояние хранилища</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-400 font-semibold">Товаров:</span> {storageInfo.products}
              </div>
              <div>
                <span className="text-blue-400 font-semibold">Заказов:</span> {storageInfo.orders}
              </div>
              <div>
                <span className="text-blue-400 font-semibold">Инициализировано:</span> {storageInfo.initialized ? '✅' : '❌'}
              </div>
            </div>
            {storageInfo.productIds && storageInfo.productIds.length > 0 && (
              <div className="mt-4">
                <span className="text-blue-400 font-semibold">ID товаров:</span>
                <div className="mt-2 text-xs bg-gray-800 rounded p-2 font-mono">
                  {storageInfo.productIds.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">➕ Добавить товар</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="Название товара..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addProduct()}
            />
            <button
              onClick={addProduct}
              disabled={loading || !newProduct.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Добавляю...' : 'Добавить'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📦 Товары ({products.length})</h2>
          
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Товаров пока нет</p>
          ) : (
            <div className="space-y-3">
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-400">
                      {product.price}₽ • {product.category} • {product.material}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {product.id}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            🔄 Обновить страницу
          </button>
          <button
            onClick={checkStorage}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            🔧 Проверить хранилище
          </button>
          <button
            onClick={clearAddedProducts}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            🗑️ Очистить добавленные
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Для продакшена</h3>
          <p className="text-gray-300 mb-4">
            Чтобы данные сохранялись в реальную базу, настройте один из вариантов:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">PlanetScale (MySQL)</h4>
              <p className="text-gray-300">Рекомендуется. Serverless MySQL с бесплатным планом.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Railway PostgreSQL</h4>
              <p className="text-gray-300">Встроенная PostgreSQL база данных.</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">Supabase</h4>
              <p className="text-gray-300">PostgreSQL с дополнительными функциями.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 