'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="logo flex items-center gap-2">
            <Image src="/assets/logo.svg" alt="RUBOLKA" width={40} height={40} className="logo__img" />
            <span className="logo__text text-xl font-bold text-white">RUBOLKA</span>
          </Link>
          
          <nav className="nav hidden md:flex items-center gap-8">
            <Link href="/#catalog" className="nav__link text-gray-300 hover:text-primary transition-colors">
              Каталог
            </Link>
            <Link href="/#about" className="nav__link text-gray-300 hover:text-primary transition-colors">
              О производстве
            </Link>
            <Link href="/#calculator" className="nav__link text-gray-300 hover:text-primary transition-colors">
              Калькулятор
            </Link>
            <Link href="/#contacts" className="nav__link text-gray-300 hover:text-primary transition-colors">
              Контакты
            </Link>
            <Link href="/catalog" className="btn btn-primary">
              Получить каталог
            </Link>
          </nav>
          
          <button 
            className="nav__toggle md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="nav--open md:hidden">
            <div className="flex flex-col gap-4">
              <Link 
                href="/#catalog" 
                className="nav__link text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link 
                href="/#about" 
                className="nav__link text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                О производстве
              </Link>
              <Link 
                href="/#calculator" 
                className="nav__link text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Калькулятор
              </Link>
              <Link 
                href="/#contacts" 
                className="nav__link text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              <Link 
                href="/catalog" 
                className="btn btn-primary w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Получить каталог
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
} 