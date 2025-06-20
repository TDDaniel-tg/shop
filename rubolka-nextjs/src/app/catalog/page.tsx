'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import OrderModal from '@/components/OrderModal'

interface Product {
  _id: string
  name: string
  category: string
  image: string
  price: number
  sizes: string[]
  colors: string[]
  material: string
  description: string
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedSize, setSelectedSize] = useState('all')
  const [selectedColor, setSelectedColor] = useState('all')
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSize = selectedSize === 'all' || product.sizes.includes(selectedSize)
    const matchesColor = selectedColor === 'all' || product.colors.includes(selectedColor)
    
    return matchesCategory && matchesSize && matchesColor
  })

  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)))
  const allColors = Array.from(new Set(products.flatMap(p => p.colors)))

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product)
    setIsOrderModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsOrderModalOpen(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка каталога...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">
          Каталог продукции
        </h1>

        {/* Фильтры */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Категория</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 input-dark rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="all">Все категории</option>
                <option value="tshirts">Футболки</option>
                <option value="hoodies">Худи</option>
                <option value="sweatshirts">Свитшоты</option>
                <option value="longsleeves">Лонгсливы</option>
                <option value="kids">Детская одежда</option>
                <option value="caps">Кепки</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Размер</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-2 input-dark rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="all">Все размеры</option>
                {allSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Цвет</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-4 py-2 input-dark rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="all">Все цвета</option>
                {allColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Товары */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl mb-4">Товары не найдены</p>
            <p className="text-gray-500">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="card overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative h-64">
                  <Image
                    src={product.image || '/assets/catalog/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized={product.image?.startsWith('data:') ? true : false}
                    onError={(e) => {
                      console.log('❌ Catalog image load error for:', product.image)
                      e.currentTarget.src = '/assets/catalog/placeholder.svg'
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      от {product.price}₽
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.material}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Размеры:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((size, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-1">Цвета:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((color, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-white text-xs rounded">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleOrderClick(product)}
                    className="w-full bg-primary text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Модальное окно заказа */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
} 