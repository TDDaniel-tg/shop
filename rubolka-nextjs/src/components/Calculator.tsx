'use client'

import { useState } from 'react'

export default function Calculator() {
  const [quantity, setQuantity] = useState(100)
  const [printing, setPrinting] = useState(false)

  const basePrice = 320 // базовая цена за футболку
  const printPrice = 50 // цена за печать

  // Система скидок в зависимости от количества
  const getDiscount = (qty: number) => {
    if (qty >= 1000) return 0.15 // 15%
    if (qty >= 500) return 0.1   // 10%
    if (qty >= 200) return 0.05  // 5%
    return 0
  }

  const discount = getDiscount(quantity)
  const pricePerUnit = printing ? basePrice + printPrice : basePrice
  const discountedPrice = pricePerUnit * (1 - discount)
  const totalPrice = discountedPrice * quantity

  return (
    <section className="section bg-gray-800" id="calculator">
      <div className="container">
        <h2 className="section-title">
          Калькулятор стоимости
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Рассчитайте стоимость</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    Количество футболок: {quantity} шт.
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="slider w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>50</span>
                    <span>2000</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="printing"
                    checked={printing}
                    onChange={(e) => setPrinting(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                  <label htmlFor="printing" className="text-white font-medium">
                    Добавить печать логотипа (+{printPrice}₽/шт)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Итого</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Базовая цена:</span>
                  <span>{basePrice}₽/шт</span>
                </div>
                
                {printing && (
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Печать:</span>
                    <span>+{printPrice}₽/шт</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>Скидка:</span>
                    <span>-{(discount * 100).toFixed(0)}%</span>
                  </div>
                )}
                
                <hr className="border-gray-600" />
                
                <div className="flex justify-between items-center text-white">
                  <span>Цена за штуку:</span>
                  <span className="font-bold">{Math.round(discountedPrice)}₽</span>
                </div>
                
                <div className="flex justify-between items-center text-2xl font-bold text-primary">
                  <span>Общая стоимость:</span>
                  <span>{Math.round(totalPrice).toLocaleString()}₽</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300 text-center">
                  💡 Скидки: 5% от 200 шт, 10% от 500 шт, 15% от 1000 шт
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 