import Link from 'next/link'
import Image from 'next/image'

export default function Catalog() {
  const categories = [
    {
      category: 'tshirts',
      image: '/assets/catalog/hero-tshirt.jpg',
      title: 'ФУТБОЛКИ',
      description: 'Классические и стильные футболки'
    },
    {
      category: 'caps',
      image: '/assets/catalog/caps-placeholder.svg',
      title: 'КЕПКИ',
      description: 'Модные кепки и бейсболки'
    },
    {
      category: 'kids',
      image: '/assets/catalog/kids-placeholder.svg',
      title: 'ДЕТСКИЕ ФУТБОЛКИ',
      description: 'Качественная одежда для детей'
    },
    {
      category: 'hoodies',
      image: '/assets/catalog/hoodies-placeholder.svg',
      title: 'ХУДИ',
      description: 'Теплые и комфортные худи'
    },
    {
      category: 'sweatshirts',
      image: '/assets/catalog/sweatshirts-placeholder.svg',
      title: 'СВИТШОТЫ',
      description: 'Стильные свитшоты для любого случая'
    },
    {
      category: 'longsleeves',
      image: '/assets/catalog/longsleeves-placeholder.svg',
      title: 'ЛОНГСЛИВЫ',
      description: 'Футболки с длинным рукавом'
    }
  ]

  return (
    <section className="section bg-gray-800" id="catalog">
      <div className="container">
        <h2 className="section-title">
          Каталог продукции
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link 
              key={index}
              href={`/catalog?category=${cat.category}`}
              className="group relative block overflow-hidden rounded-lg border border-gray-700 hover:border-primary/50 transition-all"
            >
              <Image 
                src={cat.image} 
                alt={cat.title} 
                width={400}
                height={300}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-40">
                <div className="text-center text-white p-4">
                  <h3 className="text-2xl font-bold mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {cat.description}
                  </p>
                  <span className="text-primary text-3xl group-hover:translate-x-2 inline-block transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/catalog" 
            className="btn btn-primary inline-flex items-center gap-3"
          >
            <span>📦</span>
            Посмотреть весь каталог
          </Link>
        </div>
      </div>
    </section>
  )
} 