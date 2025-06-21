'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agreement: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreement) {
      alert('Пожалуйста, дайте согласие на обработку персональных данных')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: 'Запрос каталога с главной страницы'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', phone: '', agreement: false })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      console.error('Hero form error:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <section id="hero" className="section pt-24 lg:pt-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="slide-in-left">
            <div className="mb-6">
              <span className="badge badge-primary mb-4 inline-block">
                Производство с 2015 года
              </span>
              <h1 className="text-gray-900 dark:text-white mb-6">
                Оптовые поставки футболок от производителя
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Собственное производство качественных футболок для маркетплейсов, 
                корпоративных заказов и мерча. Работаем с заказами от 50 штук.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Собственное производство</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Полный цикл от ткани до готового изделия</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">От 50 штук</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Минимальный заказ всего 50 единиц</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Доставка по России</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Отправка в любой регион страны</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Гарантия качества</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">100% хлопок, плотность от 160 г/м²</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card card-lg max-w-md">
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Получите каталог с актуальными ценами
                </h3>
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Ваше имя
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    placeholder="Иван Иванов" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Телефон
                  </label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone" 
                    placeholder="+7 (999) 123-45-67" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[\+]?[7-8]?[\s\-\(]?[0-9]{3}[\s\-\)]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}"
                    title="Введите номер в формате: +7 (999) 123-45-67"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="form-checkbox mt-0.5"
                      disabled={isSubmitting}
                      required
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Даю согласие на обработку персональных данных в соответствии с{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        политикой конфиденциальности
                      </a>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Отправка...
                    </span>
                  ) : (
                    'Получить каталог'
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="alert alert-success mt-4 fade-in">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Спасибо! Мы свяжемся с вами в течение 30 минут.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error mt-4 fade-in">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Произошла ошибка. Пожалуйста, попробуйте еще раз.</span>
                  </div>
                )}

                <p className="text-xs text-center text-gray-500 mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки данных
                </p>
              </form>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative slide-in-right">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-3xl transform rotate-3"></div>
              
              {/* Main image container */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                <Image
                  src="/assets/catalog/hero-tshirt.jpg"
                  alt="Качественные футболки RUBOLKA"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
                
                {/* Quality badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">Премиум качество</h4>
                        <p className="text-sm text-gray-600">100% хлопок, плотность 180 г/м²</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 