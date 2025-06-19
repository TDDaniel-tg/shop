/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Для Railway деплоя
  output: 'standalone',
  trailingSlash: false,
  // Настройки для статических файлов
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig 