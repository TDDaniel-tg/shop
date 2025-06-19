import Image from 'next/image'

export default function About() {
  return (
    <section className="section bg-gray-900" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              О нашем производстве
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Мы производим высококачественные футболки уже более 10 лет. 
              Наша фабрика оснащена современным оборудованием, а команда состоит 
              из опытных специалистов.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Собственное производство</h4>
                  <p className="text-gray-400">Полный контроль качества от ткани до готового изделия</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Качественные материалы</h4>
                  <p className="text-gray-400">Используем только проверенные ткани от надежных поставщиков</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Быстрые сроки</h4>
                  <p className="text-gray-400">Производство заказа от 3 до 14 дней в зависимости от объема</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <p className="text-gray-400">лет опыта</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">500k+</div>
              <p className="text-gray-400">изделий в месяц</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <p className="text-gray-400">довольных клиентов</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-400">поддержка</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 