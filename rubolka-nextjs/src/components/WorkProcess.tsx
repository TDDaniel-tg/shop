export default function WorkProcess() {
  const steps = [
    {
      number: '01',
      title: 'Заявка',
      description: 'Оставляете заявку на сайте или связываетесь с менеджером',
      icon: '📝'
    },
    {
      number: '02', 
      title: 'Расчет',
      description: 'Рассчитываем стоимость и отправляем коммерческое предложение',
      icon: '💰'
    },
    {
      number: '03',
      title: 'Договор',
      description: 'Заключаем договор и получаем предоплату 50%',
      icon: '📋'
    },
    {
      number: '04',
      title: 'Производство', 
      description: 'Запускаем производство вашего заказа',
      icon: '⚙️'
    },
    {
      number: '05',
      title: 'Контроль',
      description: 'Проводим контроль качества готовой продукции',
      icon: '🔍'
    },
    {
      number: '06',
      title: 'Отправка',
      description: 'Упаковываем и отправляем заказ удобным способом',
      icon: '📦'
    }
  ]

  return (
    <section className="section bg-gray-900">
      <div className="container">
        <h2 className="section-title text-white mb-16">
          Как мы работаем
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary transform -translate-x-1/2"></div>
          
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                  <div className="card p-8 hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{step.icon}</span>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-gray-900">
                    <span className="text-black font-black text-xl">{step.number}</span>
                  </div>
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 