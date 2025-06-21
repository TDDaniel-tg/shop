'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Все товары' },
    { id: 'basic', name: 'Базовые модели' },
    { id: 'premium', name: 'Премиум' },
    { id: 'kids', name: 'Детские' },
  ]

  const products = [
    {
      id: 1,
      name: 'Футболка базовая',
      category: 'basic',
      price: 'от 350 ₽',
      description: '100% хлопок, плотность 160 г/м²',
      colors: ['белый', 'черный', 'серый', 'синий'],
      sizes: '42-60',
      image: '/assets/catalog/hero-tshirt.jpg'
    },
    {
      id: 2,
      name: 'Футболка премиум',
      category: 'premium',
      price: 'от 550 ₽',
      description: 'Премиум хлопок, плотность 200 г/м²',
      colors: ['белый', 'черный', 'бежевый'],
      sizes: '44-58',
      image: '/assets/catalog/men.jpg'
    },
    {
      id: 3,
      name: 'Футболка оверсайз',
      category: 'basic',
      price: 'от 450 ₽',
      description: 'Свободный крой, 100% хлопок',
      colors: ['белый', 'черный', 'хаки', 'бежевый'],
      sizes: 'S-XXL',
      image: '/assets/catalog/unisex.jpg'
    },
    {
      id: 4,
      name: 'Детская футболка',
      category: 'kids',
      price: 'от 250 ₽',
      description: 'Мягкий хлопок, яркие принты',
      colors: ['белый', 'розовый', 'голубой', 'желтый'],
      sizes: '92-152',
      image: '/assets/catalog/kids-placeholder.jpg'
    }
  ]

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  return (
    <section id="catalog" className="section bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 dark:text-white mb-4">Каталог продукции</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Широкий ассортимент качественных футболок для любых задач
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="card group hover:shadow-lg transition-all fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge badge-primary">
                    Хит продаж
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {product.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 w-20">Размеры:</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{product.sizes}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 w-20">Цвета:</span>
                  <span className="text-gray-700 dark:text-gray-300">{product.colors.length} вариантов</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {product.price}
                </span>
                <Link 
                  href={`/catalog#${product.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Не нашли подходящую модель?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Мы можем изготовить футболки по вашим требованиям: 
              особый крой, уникальная ткань или специальная обработка
            </p>
            <Link href="/catalog" className="btn btn-primary btn-lg">
              Смотреть весь каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 