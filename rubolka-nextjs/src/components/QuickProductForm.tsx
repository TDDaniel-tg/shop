'use client'

import React, { useState } from 'react'
import Image from 'next/image'

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
    template: '',
    image: ''
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
      image: formData.image
    }
    
    onSubmit(productData)
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Быстрое добавление товара</h3>
      
      {/* Область перетаскивания */}
      <div className="mb-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          {formData.image ? (
            <div className="space-y-4">
              <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                <Image
                  src={formData.image}
                  alt="Превью"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, image: '' }))
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Удалить изображение
              </button>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">Перетащите изображение сюда или</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-primary-dark font-medium"
              >
                выберите файл
              </button>
            </>
          )}
        </div>
      </div>

      {/* Поля формы в 2 колонки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Название *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Например: Футболка базовая"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Цена (₽) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            min="0"
            className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="450"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Описание *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          rows={2}
          className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Краткое описание товара..."
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Размеры (через запятую)
        </label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={(e) => setFormData({...formData, sizes: e.target.value})}
          className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="S, M, L, XL"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Цвета (через запятую)
        </label>
        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={(e) => setFormData({...formData, colors: e.target.value})}
          className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Белый, Черный, Серый"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Добавление...
          </>
        ) : (
          '+ Добавить товар'
        )}
      </button>
    </div>
  )
} 