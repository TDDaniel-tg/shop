import Hero from '@/components/Hero'
import Advantages from '@/components/Advantages'
import VideoGallery from '@/components/VideoGallery'
import Catalog from '@/components/Catalog'
import About from '@/components/About'
import WorkProcess from '@/components/WorkProcess'
import TelegramBlock from '@/components/TelegramBlock'
import Clients from '@/components/Clients'
import Calculator from '@/components/Calculator'
import Contacts from '@/components/Contacts'
import FloatingSocial from '@/components/FloatingSocial'

export default function Home() {
  return (
    <main>
      <Hero />
      <Advantages />
      <VideoGallery />
      <Catalog />
      <About />
      <WorkProcess />
      <TelegramBlock />
      <Clients />
      <Calculator />
      <Contacts />
      <FloatingSocial />
    </main>
  )
}
