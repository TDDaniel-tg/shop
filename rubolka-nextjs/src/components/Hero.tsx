'use client'

import { useState } from 'react'

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          message: 'Запрос каталога с главной страницы'
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Спасибо! Мы отправим вам каталог в ближайшее время.')
        setFormData({ name: '', phone: '', email: '' })
      } else {
        alert(result.error || 'Произошла ошибка')
      }
    } catch (err) {
      console.error('Hero form error:', err)
      alert('Произошла ошибка при отправке формы')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 pb-16 overflow-hidden">
      <div className="hero__bg absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white">
            ТВОЙ ОПТОВЫЙ<br/>
            ПОСТАВЩИК<br/>
            <span className="text-6xl md:text-8xl">❤️</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Производство и оптовая продажа качественных футболок<br/>
            для маркетплейсов, мерча и корпоративов
          </p>
          
          <div className="mb-8">
            <form className="card p-6 max-w-md" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ваше имя" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Телефон" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                />
                <button 
                  type="submit" 
                  className="w-full bg-primary text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
                >
                  ПОЛУЧИТЬ КАТАЛОГ С ЦЕНАМИ
                </button>
              </div>
            </form>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span className="text-gray-300">Собственное производство</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span className="text-gray-300">От 50 штук</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span className="text-gray-300">Доставка по всей России</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 