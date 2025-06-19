'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
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
        setFormData({ name: '', phone: '' })
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
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen flex items-center overflow-hidden">
      <div className="hero__bg absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        {/* Желтые капли сверху */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 200" className="w-full h-auto">
            <path d="M0,0 Q150,50 300,20 T600,40 T900,10 T1200,30 L1200,0 Z" fill="#F9E547" opacity="0.8"/>
            <path d="M0,10 Q200,60 400,30 T800,50 T1200,20 L1200,0 Z" fill="#F9E547" opacity="0.6"/>
            <circle cx="100" cy="80" r="15" fill="#F9E547" opacity="0.7"/>
            <circle cx="250" cy="60" r="10" fill="#F9E547" opacity="0.8"/>
            <circle cx="450" cy="90" r="12" fill="#F9E547" opacity="0.6"/>
            <circle cx="650" cy="70" r="8" fill="#F9E547" opacity="0.9"/>
            <circle cx="850" cy="85" r="14" fill="#F9E547" opacity="0.7"/>
            <circle cx="1050" cy="65" r="11" fill="#F9E547" opacity="0.8"/>
          </svg>
        </div>
      </div>
      
      <div className="container relative z-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка с контентом */}
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white">
              ТВОЙ ОПТОВЫЙ<br/>
              ПОСТАВЩИК<br/>
              {/* <span className="text-6xl md:text-8xl">❤️</span> */}
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
                    placeholder="+7 (999) 123-45-67" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[\+]?[7-8]?[\(\s]?[0-9]{3}[\)\s]?[0-9]{3}[\-\s]?[0-9]{2}[\-\s]?[0-9]{2}"
                    title="Введите номер в формате: +7 (999) 123-45-67"
                    className="w-full px-4 py-3 input-dark rounded-lg focus:outline-none focus:ring-2"
                  />

                  <button 
                    type="submit" 
                    className="w-full bg-primary text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-400 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    📱 ПОЛУЧИТЬ КАТАЛОГ С ЦЕНАМИ
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Менеджер свяжется с вами в течение 30 минут
                  </p>
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

          {/* Правая колонка с изображением футболки */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Декоративное свечение вокруг футболки */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* Контейнер с футболкой - расширенный на весь блок */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-2xl group">
                <Image
                  src="/assets/catalog/hero-tshirt.jpg"
                  alt="Качественная белая футболка RUBOLKA"
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  priority
                />
                
                {/* Градиентный оверлей для лучшего контраста */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-primary/10"></div>
                
                {/* Декоративные элементы */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary/60 rounded-full animate-pulse shadow-lg" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-6 w-4 h-4 bg-primary/40 rounded-full animate-pulse shadow-lg" style={{animationDelay: '2s'}}></div>
              </div>

              {/* Информация о качестве */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-6 py-3 border border-primary/30 shadow-xl">
                  <p className="text-primary text-sm font-bold">100% качество</p>
                  <p className="text-gray-300 text-xs">Премиум материалы</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 