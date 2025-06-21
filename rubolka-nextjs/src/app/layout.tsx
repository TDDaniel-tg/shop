import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "RUBOLKA — Производство и оптовые поставки футболок",
  description: "Собственное производство качественных футболок для маркетплейсов, корпоративных заказов и мерча. Оптовые цены от производителя, минимальный заказ от 50 штук.",
  keywords: "футболки оптом, производство футболок, футболки для маркетплейсов, корпоративные футболки, мерч, оптовые поставки",
  authors: [{ name: "RUBOLKA" }],
  creator: "RUBOLKA",
  publisher: "RUBOLKA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "RUBOLKA — Производство и оптовые поставки футболок",
    description: "Собственное производство качественных футболок для маркетплейсов и корпоративных заказов",
    url: "https://rubolka.ru",
    siteName: "RUBOLKA",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans antialiased">
        <Preloader />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
