'use client'

import { useState } from 'react'

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

  const handlePlayVideo = (index: number) => {
    setPlayingVideos(prev => ({
      ...prev,
      [index]: true
    }))
  }

  return (
    <section className="section bg-black text-white">
      <div className="container">
        <h2 className="section-title text-white">
          СМОТРИ НА КАЧЕСТВО
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video, index) => (
            <div key={index} className="card-dark relative overflow-hidden hover:border-primary/50 transition-colors group">
              <div className="relative">
                <video 
                  className="w-full h-80 sm:h-96 md:h-[500px] object-cover rounded-lg" 
                  muted 
                  loop 
                  playsInline
                  preload="metadata"
                  controls={playingVideos[index]}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                
                {!playingVideos[index] && (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 