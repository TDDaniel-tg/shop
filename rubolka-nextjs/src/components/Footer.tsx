import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/assets/logo.svg" alt="RUBOLKA" width={40} height={40} />
              <span className="text-xl font-bold text-white">RUBOLKA</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Производство качественных футболок для оптовых продаж
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                <span>📞</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                <span>✉️</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Каталог</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog?category=women" className="text-gray-400 hover:text-primary transition-colors">Женские футболки</Link></li>
              <li><Link href="/catalog?category=men" className="text-gray-400 hover:text-primary transition-colors">Мужские футболки</Link></li>
              <li><Link href="/catalog?category=unisex" className="text-gray-400 hover:text-primary transition-colors">Унисекс футболки</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Информация</h4>
            <ul className="space-y-2">
              <li><Link href="/#about" className="text-gray-400 hover:text-primary transition-colors">О производстве</Link></li>
              <li><Link href="/#calculator" className="text-gray-400 hover:text-primary transition-colors">Калькулятор</Link></li>
              <li><Link href="/#contacts" className="text-gray-400 hover:text-primary transition-colors">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Контакты</h4>
            <div className="space-y-3 text-gray-400">
              <a href="tel:+79388786880" className="block hover:text-primary transition-colors">
                +7 938 878-68-80
              </a>
              <a href="mailto:info@rubolka.ru" className="block hover:text-primary transition-colors">
                info@rubolka.ru
              </a>
              <p>г. Ростов-на-Дону,<br/>ул. Производственная, 15</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RUBOLKA. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
} 