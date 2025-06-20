'use client'

import { useState } from 'react'

interface QuickProductFormProps {
  onSubmit: (productData: any) => void
  loading: boolean
}

const PRODUCT_TEMPLATES = {
  tshirt: {
    category: 'tshirts',
    material: 'Хлопок 100%',
    colors: 'Белый, Черный, Серый, Синий',
    sizes: 'XS, S, M, L, XL, XXL',
    description: 'Классическая футболка из 100% хлопка. Комфортная посадка, высокое качество пошива.'
  },
  hoodie: {
    category: 'hoodies',
    material: 'Хлопок 80%, Полиэстер 20%',
    colors: 'Черный, Серый, Белый, Бордовый',
    sizes: 'S, M, L, XL, XXL',
    description: 'Теплое худи с капюшоном. Мягкий флисовый подклад, удобный крой.'
  },
  cap: {
    category: 'caps',
    material: 'Хлопок 100%',
    colors: 'Черный, Белый, Синий, Красный',
    sizes: 'One Size',
    description: 'Стильная кепка-снэпбэк. Регулируемый размер, качественная вышивка.'
  }
}

export default function QuickProductForm({ onSubmit, loading }: QuickProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'tshirts',
    description: '',
    material: 'Хлопок 100%',
    colors: '',
    sizes: '',
    template: ''
  })

  const handleTemplateSelect = (templateKey: string) => {
    const template = PRODUCT_TEMPLATES[templateKey as keyof typeof PRODUCT_TEMPLATES]
    if (template) {
      setFormData(prev => ({
        ...prev,
        ...template,
        template: templateKey
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      material: formData.material,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      image: '/assets/catalog/placeholder.svg'
    }
    
    onSubmit(productData)
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">⚡ Быстрое добавление товара</h3>
      
      {/* Шаблоны товаров */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Выберите шаблон (необязательно)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleTemplateSelect('tshirt')}
            className={`p-3 rounded-lg border transition-colors ${
              formData.template === 'tshirt' 
                ? 'border-primary bg-yellow-400 bg-opacity-20 text-primary' 
                : 'border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            👕 Футболка
          </button>
          <button
            type="button"
            onClick={() => handleTemplateSelect('hoodie')}
            className={`p-3 rounded-lg border transition-colors ${
              formData.template === 'hoodie' 
                ? 'border-primary bg-yellow-400 bg-opacity-20 text-primary' 
                : 'border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            🧥 Худи
          </button>
          <button
            type="button"
            onClick={() => handleTemplateSelect('cap')}
            className={`p-3 rounded-lg border transition-colors ${
              formData.template === 'cap' 
                ? 'border-primary bg-yellow-400 bg-opacity-20 text-primary' 
                : 'border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            🧢 Кепка
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Основные поля */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Название*
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Название товара"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Цена (₽)*
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="450"
            />
          </div>
        </div>

        {/* Предзаполненные поля */}
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Описание
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Описание товара..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Цвета
            </label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) => setFormData({...formData, colors: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Белый, Черный, Серый"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Размеры
            </label>
            <input
              type="text"
              value={formData.sizes}
              onChange={(e) => setFormData({...formData, sizes: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="XS, S, M, L, XL"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Добавление...
            </>
          ) : (
            '⚡ Быстро добавить товар'
          )}
        </button>
      </form>
      
      <p className="text-sm text-gray-400 mt-4">
        💡 Товар будет создан с изображением-заглушкой. Вы сможете загрузить фото позже через редактирование.
      </p>
    </div>
  )
} 