/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },
  eslint: {
    // Отключаем ESLint во время сборки для продакшена
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Отключаем проверку TypeScript во время сборки для продакшена
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production',
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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