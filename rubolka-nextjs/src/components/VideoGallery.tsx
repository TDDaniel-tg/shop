'use client'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function VideoGallery() {
  const videos = [
    {
      src: '/assets/catalog/video_1.mp4',
      title: 'Качество наших футболок'
    },
    {
      src: '/assets/catalog/video_2.mp4',
      title: 'Процесс производства'
    },
    {
      src: '/assets/catalog/video_3.mp4',
      title: 'Обзор готовой продукции'
    }
  ]

  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({})
  const [autoPlayedVideos, setAutoPlayedVideos] = useState<{ [key: number]: boolean }>({})
  const [activeSlide, setActiveSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const swiperRef = useRef<any>(null)

  const handlePlayVideo = (index: number) => {
    setPlayingVideos(prev => ({
      ...prev,
      [index]: true
    }))
  }

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Автоплей для активного видео в карусели на мобильных
  useEffect(() => {
    if (isMobile) {
      // Останавливаем все видео
      videoRefs.current.forEach((video, index) => {
        if (video && index !== activeSlide) {
          video.pause()
          video.currentTime = 0
        }
      })

      // Запускаем активное видео
      const activeVideo = videoRefs.current[activeSlide]
      if (activeVideo && !autoPlayedVideos[activeSlide]) {
        setTimeout(() => {
          activeVideo.play().catch(() => {
            console.log('Autoplay blocked for video', activeSlide)
          })
          setAutoPlayedVideos(prev => ({
            ...prev,
            [activeSlide]: true
          }))
          setPlayingVideos(prev => ({
            ...prev,
            [activeSlide]: true
          }))
        }, 300) // Небольшая задержка для плавности
      }
    }
  }, [activeSlide, isMobile, autoPlayedVideos])

  // Intersection Observer для десктопа
  useEffect(() => {
    if (isMobile) return // Не используем на мобильных

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoIndex = parseInt(entry.target.getAttribute('data-video-index') || '0')
          const video = videoRefs.current[videoIndex]
          
          if (entry.isIntersecting && video && !autoPlayedVideos[videoIndex]) {
            // Автоплей при попадании в область видимости
            video.play().catch(() => {
              console.log('Autoplay blocked for video', videoIndex)
            })
            setAutoPlayedVideos(prev => ({
              ...prev,
              [videoIndex]: true
            }))
            setPlayingVideos(prev => ({
              ...prev,
              [videoIndex]: true
            }))
          } else if (!entry.isIntersecting && video) {
            // Паузим видео при выходе из области видимости
            video.pause()
          }
        })
      },
      {
        threshold: 0.6, // Срабатывает когда 60% видео видно
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Наблюдаем за всеми видео контейнерами
    const videoContainers = document.querySelectorAll('[data-video-index]')
    videoContainers.forEach((container) => observer.observe(container))

    return () => {
      videoContainers.forEach((container) => observer.unobserve(container))
    }
  }, [autoPlayedVideos, isMobile])

  const handleVideoRef = (element: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = element
  }

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex)
  }

  const VideoCard = ({ video, index }: { video: any, index: number }) => (
    <div className="card-dark relative overflow-hidden hover:border-primary/50 transition-colors group" data-video-index={index}>
              <div className="relative">
                <video 
          ref={(el) => handleVideoRef(el, index)}
                  className="w-full h-80 sm:h-96 md:h-[500px] object-cover rounded-lg" 
                  muted 
                  loop 
                  playsInline
                  preload="metadata"
                  controls={playingVideos[index]}
          poster={`/assets/catalog/video_${index + 1}_poster.jpg`}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                
        {!autoPlayedVideos[index] && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border-4 border-white mb-4 mx-auto">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="black"/>
                </svg>
              </div>
              <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {isMobile ? 'Свайп для просмотра' : 'Автоплей при скролле'}
              </p>
            </div>
          </div>
        )}

        {/* Кнопка ручного воспроизведения */}
        {!playingVideos[index] && autoPlayedVideos[index] && (
                  <button 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all backdrop-blur-sm"
                    aria-label="Воспроизвести видео"
                    onClick={() => handlePlayVideo(index)}
                  >
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border-4 border-white">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5V19L19 12L8 5Z" fill="black"/>
                      </svg>
                    </div>
                  </button>
                )}
              </div>
              
              <div className="p-4">
                <p className="text-lg font-medium text-white">
                  {video.title}
                </p>
        {isMobile && (
          <div className="mt-2 flex justify-center">
            <div className="flex gap-2">
              {videos.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeSlide ? 'bg-primary' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
              </div>
  )

  return (
    <>
      {/* Стили для Swiper */}
      <style jsx global>{`
        .video-swiper {
          width: 100%;
          padding: 20px 0;
        }

        .video-swiper .swiper-slide {
          height: auto;
        }

        .video-swiper .swiper-pagination {
          position: relative;
          margin-top: 20px;
          display: none;
        }

        .video-swiper .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
          transition: all 0.3s ease;
        }

        .video-swiper .swiper-pagination-bullet-active {
          background: #F9E547 !important;
          transform: scale(1.2);
        }

        @media (max-width: 767px) {
          .video-swiper .swiper-pagination {
            display: block;
          }
        }
      `}</style>

      <section className="section bg-black text-white">
        <div className="container">
          <h2 className="section-title text-white">
            СМОТРИ НА КАЧЕСТВО
          </h2>
          
          {/* Мобильная карусель */}
          {isMobile ? (
            <div className="px-4">
              <Swiper
                ref={swiperRef}
                className="video-swiper"
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                grabCursor={true}
                touchRatio={1}
                touchAngle={45}
                simulateTouch={true}
                allowTouchMove={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                onSlideChange={handleSlideChange}
              >
                {videos.map((video, index) => (
                  <SwiperSlide key={index}>
                    <VideoCard video={video} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            /* Десктопная сетка */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {videos.map((video, index) => (
                <VideoCard key={index} video={video} index={index} />
          ))}
        </div>
          )}
      </div>
    </section>
    </>
  )
} 