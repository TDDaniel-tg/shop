'use client'

import { useState } from 'react'

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert('Спасибо! Ваше сообщение отправлено.')
        setFormData({ name: '', phone: '', message: '' })
      } else {
        alert(result.error || 'Произошла ошибка')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      alert('Произошла ошибка при отправке сообщения')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="section bg-gray-900" id="contacts">
      <div className="container">
        <h2 className="section-title">
          Свяжитесь с нами
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Контактная информация</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xl">📞</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Телефон</h4>
                  <a href="tel:+79388786880" className="text-gray-300 hover:text-primary transition-colors text-lg">
                    +7 938 878-68-80
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xl">✉️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Email</h4>
                  <a href="mailto:info@rubolka.ru" className="text-gray-300 hover:text-primary transition-colors text-lg">
                    info@rubolka.ru
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xl">⏰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Время работы</h4>
                  <p className="text-gray-300">Пн-Пт: 9:00-18:00</p>
                  <p className="text-gray-300">Сб-Вс: по договоренности</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xl">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Адрес производства</h4>
                  <p className="text-gray-300">г. Москва</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-6 text-white">Оставьте заявку</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (999) 123-45-67"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[\+]?[7-8]?[\(\s]?[0-9]{3}[\)\s]?[0-9]{3}[\-\s]?[0-9]{2}[\-\s]?[0-9]{2}"
                  title="Введите номер в формате: +7 (999) 123-45-67"
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                />
              </div>
              

              
              <div>
                <textarea
                  name="message"
                  placeholder="Ваше сообщение"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2 resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-400 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                🚀 Отправить заявку
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Ответим в течение 1 часа в рабочее время
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 