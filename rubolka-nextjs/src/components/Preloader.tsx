'use client'

import { useEffect, useState } from 'react'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className={`preloader ${!isLoading ? 'hidden' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo"></div>
        <h2 className="text-xl font-semibold text-gray-800 mt-4">RUBOLKA</h2>
        <p className="text-sm text-gray-500 mt-1">Загружаем каталог...</p>
      </div>
    </div>
  )
} 