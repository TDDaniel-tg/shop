'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
    email: '',
    size: '',
    color: '',
    quantity: 1,
    comment: '',
    privacy: false
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
      email: '',
      size: '',
      color: '',
      quantity: 1,
      comment: '',
      privacy: false
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'quantity' ? parseInt(value) || 1 : value
    }))
  }

  const handleQuantityChange = (newQuantity: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: newQuantity
    }))
  }

  if (!isOpen || !product) return null

  const totalPrice = product.price * formData.quantity

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Оформление заказа</h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ×
            </button>
          </div>

          {product && (
            <div className="flex gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={product.image || '/assets/catalog/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{product.material}</p>
                <p className="text-xl font-bold text-primary mt-2">от {product.price} ₽</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Количество
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(Math.max(1, formData.quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-20 text-center px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(formData.quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Итого
                </label>
                <p className="text-2xl font-bold text-primary">
                  {product ? (formData.quantity * product.price).toLocaleString() : 0} ₽
                </p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Ваше имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Размер
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="">Выберите размер</option>
                  {product?.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Цвет
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="">Выберите цвет</option>
                  {product?.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Комментарий к заказу
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                disabled={isSubmitting}
                placeholder="Дополнительные пожелания..."
              />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacy"
                  checked={formData.privacy}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                  required
                />
                <span className="text-sm text-gray-600">
                  Я согласен на обработку персональных данных в соответствии с{' '}
                  <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSubmitting || !formData.privacy}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Отправка...
                  </>
                ) : (
                  'Оформить заказ'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 