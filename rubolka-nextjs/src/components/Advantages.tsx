export default function Advantages() {
  const advantages = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
      ),
      title: 'Гарантия качества',
      description: 'Используем только проверенные материалы и современное оборудование'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
      title: 'Выгодные цены',
      description: 'Прямые поставки от производителя без наценок посредников'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
      ),
      title: 'Быстрое производство',
      description: 'Изготовление заказа от 3 дней в зависимости от объема'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
          />
        </svg>
      ),
      title: 'Широкий ассортимент',
      description: 'Большой выбор моделей, размеров и цветов футболок'
    }
  ]

  return (
    <section id="advantages" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-gray-900 mb-4">Почему выбирают нас</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Более 8 лет мы производим качественные футболки для российского рынка
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="text-center fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-4">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {advantage.title}
              </h3>
              <p className="text-gray-600">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">500+</div>
            <div className="text-sm text-gray-600">Довольных клиентов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">1М+</div>
            <div className="text-sm text-gray-600">Произведено футболок</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">8 лет</div>
            <div className="text-sm text-gray-600">На рынке</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">3 дня</div>
            <div className="text-sm text-gray-600">Минимальный срок</div>
          </div>
        </div>
      </div>
    </section>
  )
} 