import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "RUBOLKA - Твой оптовый поставщик футболок",
  description: "Оптовые поставки футболок собственного производства. Качественные футболки для маркетплейсов, мерча и корпоративов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <Preloader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
