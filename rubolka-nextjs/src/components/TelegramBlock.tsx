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
                href="https://t.me/Rubolka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0088CC] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#006699] transition-colors flex items-center justify-center gap-3"
              >
                <span className="text-xl">📢</span>
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
                <h3 className="text-xl font-bold text-white mb-2">@Rubolka</h3>
                <p className="text-gray-400 mb-4">Официальный канал RUBOLKA</p>
                
                {/* QR-код placeholder */}
                <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-600">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      />
                    ))}
                  </div>
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