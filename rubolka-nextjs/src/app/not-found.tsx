import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mt-4 mb-8">
          К сожалению, запрашиваемая страница не существует.
        </p>
        <Link href="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
} 