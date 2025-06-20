'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function Clients() {
  const clients = [
    { 
      name: 'Лукойл', 
      logo: '/assets/icons/clients/lukoil.png', 
      description: 'Нефтяная компания',
      hasImage: true 
    },
    { 
      name: 'Газпром Арена', 
      logo: '/assets/icons/clients/gazprom-arena.png', 
      description: 'Спортивный комплекс', 
      case: '5000 футболок для мероприятия',
      hasImage: true 
    },
    { 
      name: 'Газпром Нефть', 
      logo: '/assets/icons/clients/gazprom-neft.png', 
      description: 'Нефтегазовая компания',
      hasImage: true 
    },
    { 
      name: 'Балтбет', 
      logo: '/assets/icons/clients/baltbet.png', 
      description: 'Букмекерская контора',
      hasImage: true 
    },
    { 
      name: 'Селлеры WB', 
      logo: '/assets/icons/clients/wildberries.png', 
      description: 'Сотни магазинов одежды',
      hasImage: true 
    },
    { 
      name: 'Селлеры Ozon', 
      logo: '/assets/icons/clients/ozon.png', 
      description: 'Предприниматели на маркетплейсах',
      hasImage: true 
    },

  ]

  // Создаем CSS для placeholder изображений с имитацией отзывов
  const createReviewPlaceholder = (index: number, type: 'telegram' | 'whatsapp' | 'viber') => {
    const colors = {
      telegram: { bg: '#0088cc', dark: '#2b5278' },
      whatsapp: { bg: '#075e54', dark: '#128c7e' },  
      viber: { bg: '#665cac', dark: '#7360a5' }
    }
    
    const messages = [
      'Добро утро!\nПолучил заказ - футболки🔥\nОчень качественные!\nТкань приятная\nРазмеры точные\nСпасибо за работу! 🙏',
      'Каролина, ожидайте!\n\nСупер спасибо! Большое\nОтзыв клиента 🔥\n\nПолучили номер сегодня\nОт 1-го клиента #3',
      'Хорошо\nА номер для отслеживания\nможно?\n\nПолучил номер сегодня\nОт 1-го клиента #3',
      'Привет!\nВчера получила заказ\nОтличное качество 👍\nФутболки супер!\nБудем заказывать еще',
      'Спасибо большое!\nТовар получен\nВсе идеально 💯\nКачество отличное\nРекомендую!',
      'Заказ пришел быстро\nУпаковка аккуратная 📦\nФутболки как на фото\nОчень довольны!\nОбязательно закажем еще'
    ]
    
    const color = colors[type]
    const message = messages[index % messages.length]
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${index}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color.dark};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Фон -->
        <rect width="300" height="480" fill="url(#grad${index})"/>
        
        <!-- Заголовок чата -->
        <rect x="0" y="0" width="300" height="60" fill="rgba(0,0,0,0.2)"/>
        <circle cx="30" cy="30" r="15" fill="rgba(255,255,255,0.3)"/>
        <text x="55" y="25" fill="white" font-family="Arial" font-size="14" font-weight="bold">Клиент ${index + 1}</text>
        <text x="55" y="40" fill="rgba(255,255,255,0.7)" font-family="Arial" font-size="11">онлайн</text>
        
        <!-- Сообщение -->
        <rect x="20" y="80" width="260" height="320" rx="15" fill="rgba(255,255,255,0.95)"/>
        <foreignObject x="30" y="90" width="240" height="300">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            font-family: Arial, sans-serif; 
            font-size: 14px; 
            line-height: 1.4; 
            color: #333;
            padding: 10px;
            white-space: pre-line;
          ">
            ${message}
          </div>
        </foreignObject>
        
        <!-- Время -->
        <text x="270" y="415" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="10" text-anchor="end">${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</text>
        
        <!-- Иконки статуса -->
        <text x="280" y="430" fill="rgba(255,255,255,0.6)" font-family="Arial" font-size="12">✓✓</text>
      </svg>
    `)}`
  }

  // Фотографии отзывов с fallback placeholder'ами
  const reviewPhotos = [
    { 
      id: 1, 
      src: '/assets/reviews/review-1.jpg', 
      alt: 'Отзыв клиента 1',
      fallback: createReviewPlaceholder(0, 'telegram')
    },
    { 
      id: 2, 
      src: '/assets/reviews/review-2.jpg', 
      alt: 'Отзыв клиента 2',
      fallback: createReviewPlaceholder(1, 'whatsapp')
    },
    { 
      id: 3, 
      src: '/assets/reviews/review-3.jpg', 
      alt: 'Отзыв клиента 3',
      fallback: createReviewPlaceholder(2, 'viber')
    },
    { 
      id: 4, 
      src: '/assets/reviews/review-4.jpg', 
      alt: 'Отзыв клиента 4',
      fallback: createReviewPlaceholder(3, 'telegram')
    },
    { 
      id: 5, 
      src: '/assets/reviews/review-5.jpg', 
      alt: 'Отзыв клиента 5',
      fallback: createReviewPlaceholder(4, 'whatsapp')
    },
    { 
      id: 6, 
      src: '/assets/reviews/review-6.jpg', 
      alt: 'Отзыв клиента 6',
      fallback: createReviewPlaceholder(5, 'viber')
    },
  ]

  return (
    <>
      {/* Swiper CSS */}
      <style jsx global>{`
        .reviews-swiper {
          width: 100%;
          padding: 60px 0 !important;
          overflow: visible !important;
        }

        .reviews-swiper .swiper-wrapper {
          align-items: center;
        }

        .reviews-swiper .swiper-slide {
          width: 300px !important;
          height: 480px !important;
          background: linear-gradient(145deg, #1e293b, #334155);
          border-radius: 20px;
          border: 1px solid rgba(255, 215, 0, 0.15);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          overflow: hidden;
          position: relative;
        }

        .reviews-swiper .swiper-slide::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 1;
        }

        .reviews-swiper .swiper-slide:hover {
          transform: translateY(-15px);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 30px 60px -10px rgba(255, 215, 0, 0.3);
        }

        .reviews-swiper .swiper-slide:hover::before {
          opacity: 1;
        }

        .reviews-swiper .swiper-slide-active {
          transform: scale(1.05);
          border-color: rgba(255, 215, 0, 0.4);
          z-index: 2;
        }

        .reviews-swiper .swiper-slide-active:hover {
          transform: scale(1.05) translateY(-15px);
        }

        .review-image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }

        .review-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        .reviews-swiper .swiper-slide:hover .review-image {
          transform: scale(1.05);
        }

        .review-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          padding: 20px;
          z-index: 2;
        }

        .review-number {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 215, 0, 0.9);
          color: #000;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          z-index: 3;
        }

        .reviews-navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 40px;
        }

        .reviews-swiper .swiper-button-prev,
        .reviews-swiper .swiper-button-next {
          width: 60px !important;
          height: 60px !important;
          border-radius: 50%;
          background: linear-gradient(145deg, #1e293b, #334155) !important;
          border: 1px solid rgba(255, 215, 0, 0.2);
          color: #ffd700 !important;
          font-size: 18px;
          position: relative;
          overflow: hidden;
          margin-top: 0 !important;
          transition: all 0.4s ease;
        }

        .reviews-swiper .swiper-button-prev::before,
        .reviews-swiper .swiper-button-next::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          opacity: 0;
          transition: all 0.4s ease;
          z-index: -1;
        }

        .reviews-swiper .swiper-button-prev:hover,
        .reviews-swiper .swiper-button-next:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(255, 215, 0, 0.3);
          color: #000 !important;
          border-color: transparent;
        }

        .reviews-swiper .swiper-button-prev:hover::before,
        .reviews-swiper .swiper-button-next:hover::before {
          opacity: 1;
        }

        .reviews-swiper .swiper-button-prev:after,
        .reviews-swiper .swiper-button-next:after {
          font-size: 18px !important;
          font-weight: bold;
        }

        .reviews-swiper .swiper-pagination {
          position: relative;
          margin-top: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .reviews-swiper .swiper-pagination-bullet {
          width: 14px !important;
          height: 14px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
          transition: all 0.4s ease;
          border-radius: 14px;
          margin: 0 5px !important;
        }

        .reviews-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
          transform: scale(1.2);
          width: 30px !important;
        }

        @media (max-width: 768px) {
          .reviews-swiper {
            padding: 0 20px;
          }

          .reviews-swiper .swiper-slide {
            width: 85vw !important;
            max-width: 320px !important;
            height: 420px !important;
            margin: 0 auto;
          }

          .reviews-swiper .swiper-button-prev,
          .reviews-swiper .swiper-button-next {
            width: 50px !important;
            height: 50px !important;
            top: 50% !important;
            margin-top: -25px !important;
          }

          .reviews-swiper .swiper-button-prev {
            left: 10px !important;
          }

          .reviews-swiper .swiper-button-next {
            right: 10px !important;
          }

          .reviews-swiper .swiper-button-prev:after,
          .reviews-swiper .swiper-button-next:after {
            font-size: 16px !important;
          }

          .reviews-navigation {
            gap: 15px;
            margin-top: 30px;
          }

          .review-overlay {
            padding: 15px;
          }

          .review-number {
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            font-size: 12px;
          }

          /* Улучшенная видимость навигации на мобильных */
          .reviews-swiper .swiper-button-prev,
          .reviews-swiper .swiper-button-next {
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(10px);
            z-index: 10;
          }
        }

        @media (max-width: 480px) {
          .reviews-swiper {
            padding: 0 15px;
          }

          .reviews-swiper .swiper-slide {
            width: 90vw !important;
            max-width: 280px !important;
            height: 400px !important;
          }

          .reviews-swiper .swiper-button-prev,
          .reviews-swiper .swiper-button-next {
            width: 45px !important;
            height: 45px !important;
          }

          .reviews-swiper .swiper-button-prev {
            left: 5px !important;
          }

          .reviews-swiper .swiper-button-next {
            right: 5px !important;
          }

          .reviews-swiper .swiper-button-prev:after,
          .reviews-swiper .swiper-button-next:after {
            font-size: 14px !important;
          }

          .review-overlay {
            padding: 12px;
          }

          .review-number {
            top: 8px;
            right: 8px;
            width: 28px;
            height: 28px;
            font-size: 11px;
          }
        }

        @media (max-width: 375px) {
          .reviews-swiper {
            padding: 0 10px;
          }

          .reviews-swiper .swiper-slide {
            width: 95vw !important;
            max-width: 260px !important;
            height: 380px !important;
          }

          .reviews-swiper .swiper-button-prev,
          .reviews-swiper .swiper-button-next {
            width: 40px !important;
            height: 40px !important;
          }

          .reviews-swiper .swiper-button-prev {
            left: 2px !important;
          }

          .reviews-swiper .swiper-button-next {
            right: 2px !important;
          }

          .reviews-swiper .swiper-button-prev:after,
          .reviews-swiper .swiper-button-next:after {
            font-size: 12px !important;
          }

          .reviews-navigation {
            margin-top: 20px;
          }
        }

        /* Дополнительная адаптивность для очень маленьких экранов */
        @media (max-width: 320px) {
          .reviews-swiper {
            padding: 0 5px;
          }

          .reviews-swiper .swiper-slide {
            width: 98vw !important;
            max-width: 240px !important;
            height: 360px !important;
          }

          h3.text-2xl {
            font-size: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>

      <section className="section bg-gray-900">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title text-white mb-4">
              Нам доверяют
            </h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Крупные корпорации, сотни магазинов одежды по всей России и предприниматели на маркетплейсах выбирают нас
            </p>
          </div>
          
          {/* Логотипы клиентов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {clients.map((client, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center hover:bg-gray-750 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {client.hasImage ? (
                      <div className="w-16 h-16 mx-auto mb-2 relative">
                        <Image
                          src={client.logo}
                          alt={`Логотип ${client.name}`}
                          fill
                          className="object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                          onError={(e) => {
                            // Fallback на эмодзи если изображение не загрузилось
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.parentNode?.querySelector('.fallback-emoji')
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'block'
                            }
                          }}
                        />
                                                 <div className="fallback-emoji hidden text-4xl">
                           {index === 0 ? '⛽' : 
                            index === 1 ? '🏟️' : 
                            index === 2 ? '🛢️' : 
                            index === 3 ? '🎰' : 
                            index === 4 ? '🛒' : '🛍️'}
                         </div>
                      </div>
                    ) : (
                      <div className="text-4xl mb-3">
                        {client.logo}
                      </div>
                    )}
                  </div>
                  <h3 className="text-gray-300 group-hover:text-white transition-colors font-bold text-lg mb-2">
                    {client.name}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-300 transition-colors text-sm mb-2">
                    {client.description}
                  </p>
                  {client.case && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-primary text-xs font-medium">
                        💼 {client.case}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Карусель отзывов */}
          <div>
            <h3 className="text-2xl md:text-2xl font-bold text-center text-white mb-8 md:mb-12">
              Отзывы наших клиентов
            </h3>
            
            <div className="relative px-4 md:px-0">
              {/* Swiper Container */}
              <Swiper
                className="reviews-swiper"
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                loop={true}
                touchRatio={1}
                touchAngle={45}
                simulateTouch={true}
                allowTouchMove={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                coverflowEffect={{
                  rotate: 5,
                  stretch: 0,
                  depth: 100,
                  modifier: 1.5,
                  slideShadows: false,
                }}
                pagination={{
                  el: '.swiper-pagination',
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    centeredSlides: true,
                    coverflowEffect: {
                      rotate: 0,
                      stretch: 0,
                      depth: 0,
                      modifier: 1,
                    },
                    effect: 'slide'
                  },
                  480: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    centeredSlides: true,
                    effect: 'slide'
                  },
                  640: {
                    slidesPerView: 1.2,
                    spaceBetween: 25,
                    centeredSlides: true
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    centeredSlides: false
                  },
                  992: {
                    slidesPerView: 2.5,
                    spaceBetween: 35,
                    centeredSlides: true
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                    centeredSlides: true
                  }
                }}
              >
                {reviewPhotos.map((photo, index) => (
                  <SwiperSlide key={photo.id}>
                    <div className="review-number">
                      {index + 1}
                    </div>
                    <div className="review-image-container">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="review-image"
                        onError={(e) => {
                          // Fallback на красивый placeholder
                          const target = e.target as HTMLImageElement
                          target.src = photo.fallback
                        }}
                      />
                      <div className="review-overlay">
                        <div className="text-white text-sm font-medium">
                          Отзыв клиента #{index + 1}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                
                {/* Navigation */}
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-pagination"></div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 