'use client'

import { useEffect, useState } from 'react'

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000) // Показываем preloader 2 секунды

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`preloader ${!isVisible ? 'hidden' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo">
          R
        </div>
        <div className="preloader-text">RUBOLKA</div>
        <div className="preloader-subtitle">Твой оптовый поставщик</div>
        <div className="spinner"></div>
      </div>
    </div>
  )
} 