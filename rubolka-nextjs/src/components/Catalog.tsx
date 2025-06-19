import Link from 'next/link'
import Image from 'next/image'

export default function Catalog() {
  const categories = [
    {
      category: 'women',
      image: '/assets/catalog/women.jpg',
      title: 'ЖЕНСКИЕ ФУТБОЛКИ'
    },
    {
      category: 'men',
      image: '/assets/catalog/men.jpg',
      title: 'МУЖСКИЕ ФУТБОЛКИ'
    },
    {
      category: 'unisex',
      image: '/assets/catalog/unisex.jpg',
      title: 'УНИСЕКС ФУТБОЛКИ'
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
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {cat.title}
                  </h3>
                  <span className="text-primary text-3xl group-hover:translate-x-2 inline-block transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 