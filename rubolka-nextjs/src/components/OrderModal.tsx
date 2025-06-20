'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    size: '',
    color: '',
    quantity: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (isOpen && product) {
      setFormData(prev => ({
        ...prev,
        size: product.sizes[0] || '',
        color: product.colors[0] || ''
      }))
      setSubmitStatus('idle')
    }
  }, [isOpen, product])

  const handleClose = () => {
    onClose()
    setFormData({
      name: '',
      phone: '',
      size: '',
      color: '',
      quantity: 1
    })
    setSubmitStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Отправляем заявку в AmoCRM через API contact
      const contactResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: `Заказ товара: ${product.name}\nРазмер: ${formData.size}\nЦвет: ${formData.color}\nКоличество: ${formData.quantity} шт.\nЦена: ${product.price * formData.quantity}₽`
        }),
      })

      const contactResult = await contactResponse.json()

      if (contactResult.success) {
        // Также создаем заказ в системе
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: formData.name,
            email: '', // поле не обязательное
            phone: formData.phone,
            totalAmount: product.price * formData.quantity,
            status: 'pending',
            items: [{
              productId: product._id,
              productName: product.name,
              quantity: formData.quantity,
              size: formData.size,
              color: formData.color,
              price: product.price
            }]
          }),
        })

        const orderResult = await orderResponse.json()

        if (orderResult.success) {
          setSubmitStatus('success')
          setTimeout(handleClose, 2000)
        } else {
          throw new Error(orderResult.error || 'Ошибка создания заказа')
        }
      } else {
        throw new Error(contactResult.error || 'Ошибка отправки заявки')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }))
  }

  if (!isOpen || !product) return null

  const totalPrice = product.price * formData.quantity

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Заголовок модального окна */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Оформить заказ</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-3xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          {/* Информация о товаре */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={product.image || '/assets/catalog/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.material}</p>
              <p className="text-primary font-bold text-xl">{product.price}₽</p>
            </div>
          </div>

          {/* Статус отправки */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
              <div className="flex items-center gap-2 text-green-300">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold">Заказ успешно оформлен!</p>
                  <p className="text-sm">Наш менеджер свяжется с вами в ближайшее время</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2 text-red-300">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-semibold">Ошибка оформления заказа</p>
                  <p className="text-sm">Попробуйте еще раз или позвоните по телефону +7 937 560-64-02</p>
                </div>
              </div>
            </div>
          )}

          {/* Форма заказа */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Имя */}
            <div>
              <label className="block text-white font-medium mb-2">Ваше имя *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Введите ваше имя"
              />
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-white font-medium mb-2">Телефон *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                pattern="[\+]?[7-8]?[\(\s]?[0-9]{3}[\)\s]?[0-9]{3}[\-\s]?[0-9]{2}[\-\s]?[0-9]{2}"
                title="Введите номер в формате: +7 (999) 123-45-67"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            {/* Размер */}
            <div>
              <label className="block text-white font-medium mb-2">Размер *</label>
              <select
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                {product.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Цвет */}
            <div>
              <label className="block text-white font-medium mb-2">Цвет *</label>
              <select
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                {product.colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Количество */}
            <div>
              <label className="block text-white font-medium mb-2">Количество</label>
              <input
                type="number"
                name="quantity"
                min="1"
                max="100"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Итоговая сумма */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Итого:</span>
                <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()}₽</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="flex-1 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Оформляем заказ...
                  </>
                ) : submitStatus === 'success' ? (
                  'Заказ оформлен!'
                ) : (
                  'Оформить заказ'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              Нажимая "Оформить заказ", вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        </div>
      </div>
    </div>
  )
} 