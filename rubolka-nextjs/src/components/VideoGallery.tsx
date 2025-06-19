'use client'

import { useState } from 'react'

export default function VideoGallery() {
  const videos = [
    {
      src: '/assets/videos/video1.mp4',
      poster: '/assets/videos/thumb1.jpg',
      title: 'Обзор женской футболки'
    },
    {
      src: '/assets/videos/video2.mp4',
      poster: '/assets/videos/thumb2.jpg',
      title: 'Процесс производства'
    },
    {
      src: '/assets/videos/video3.mp4',
      poster: '/assets/videos/thumb3.jpg',
      title: 'Качество ткани'
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="card-dark relative overflow-hidden hover:border-primary/50 transition-colors">
              <div className="relative">
                <video 
                  className="w-full h-64 object-cover" 
                  poster={video.poster}
                  muted 
                  loop 
                  playsInline
                  controls={playingVideos[index]}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                
                {!playingVideos[index] && (
                  <button 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all group"
                    aria-label="Воспроизвести видео"
                    onClick={() => handlePlayVideo(index)}
                  >
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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