export default function Advantages() {
  const advantages = [
    {
      icon: '⭐',
      title: 'Премиум качество',
      text: 'Используем только качественные ткани и современное оборудование'
    },
    {
      icon: '💰',
      title: 'Оптовые цены',
      text: 'Прямые поставки с производства без посредников'
    },
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      text: 'Отправка заказов по всей России за 1-3 дня'
    },
    {
      icon: '📏',
      title: 'Все размеры',
      text: 'Полный размерный ряд от 42 до 60 размера'
    },
    {
      icon: '🎨',
      title: 'Нанесение логотипов',
      text: '4 способа нанесения для любых задач'
    },
    {
      icon: '👨‍💼',
      title: 'Личный менеджер',
      text: 'Консультация и помощь на всех этапах сотрудничества'
    }
  ]

  return (
    <section className="section bg-gray-900">
      <div className="container">
        <h2 className="section-title">
          Почему выбирают нас
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="card text-center p-6 hover:bg-gray-800 hover:border-primary/30 transition-all duration-300 group">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">
                    {advantage.icon}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {advantage.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {advantage.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 