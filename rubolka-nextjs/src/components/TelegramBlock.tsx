'use client'

export default function TelegramBlock() {
  return (
    <section className="section bg-gray-900">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              Эксклюзивы и скидки в нашем канале
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Подпишитесь на наш Telegram-канал и получайте первыми:
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-300">Скидки до 20% для подписчиков</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-300">Новинки раньше всех</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-300">Эксклюзивные предложения</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://t.me/rubolka_opt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0088CC] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#006699] transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.47-4.03c.19-.17-.04-.27-.3-.1l-5.52 3.48-2.38-.74c-.52-.16-.53-.52.11-.77l9.3-3.58c.43-.16.81.1.67.76z"/>
                </svg>
                Подписаться на канал
              </a>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full border border-gray-700">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0088CC] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl">📢</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">@rubolka_opt</h3>
                <p className="text-gray-400 mb-4">Официальный канал RUBOLKA OPT</p>
                
                {/* QR-код для Telegram канала */}
                <div 
                  className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-600 p-2 hover:border-[#0088CC] transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => window.open('https://t.me/rubolka_opt', '_blank')}
                >
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://t.me/rubolka_opt"
                    alt="QR-код для Telegram канала @rubolka_opt"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback на локальный SVG QR-код
                      const target = e.currentTarget as HTMLImageElement
                      target.src = '/assets/qr-telegram.svg'
                      target.onerror = null // Предотвращаем бесконечный цикл
                    }}
                  />

                </div>
                
                <p className="text-sm text-gray-500">
                  Отсканируйте QR-код для<br/>быстрого перехода
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 