export default function Clients() {
  const clients = [
    { name: 'Wildberries', logo: '🛒' },
    { name: 'Ozon', logo: '🛍️' },
    { name: 'Яндекс.Маркет', logo: '🛒' },
    { name: 'Avito', logo: '📱' },
    { name: 'DNS', logo: '💻' },
    { name: 'М.Видео', logo: '📺' },
    { name: 'Спортмастер', logo: '⚽' },
    { name: 'Decathlon', logo: '🏃' }
  ]

  const testimonials = [
    {
      name: 'Алексей Петров',
      company: 'ИП Петров А.А.',
      text: 'Отличное качество футболок! Заказываем уже 3-й раз. Быстрая доставка и приятные цены.',
      avatar: '👨'
    },
    {
      name: 'Мария Сидорова', 
      company: 'ООО "Мерч Студия"',
      text: 'Профессиональный подход к каждому заказу. Помогли с выбором материала и дизайном.',
      avatar: '👩'
    },
    {
      name: 'Дмитрий Козлов',
      company: 'Event Agency',
      text: 'Сделали 500 футболок за 5 дней! Качество на высоте, все участники довольны.',
      avatar: '👨‍💼'
    }
  ]

  return (
    <section className="section bg-gray-900">
      <div className="container">
        <h2 className="section-title text-white mb-16">
          Нам доверяют
        </h2>
        
        {/* Логотипы клиентов */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-20">
          {clients.map((client, index) => (
            <div key={index} className="group">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center hover:bg-gray-750 hover:border-primary/30 transition-all duration-300">
                <div className="text-4xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {client.logo}
                </div>
                <p className="text-gray-400 group-hover:text-white transition-colors font-medium">
                  {client.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Отзывы */}
        <div>
          <h3 className="text-2xl font-bold text-center text-white mb-12">
            Что говорят наши клиенты
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-primary/30 hover:bg-gray-750 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 