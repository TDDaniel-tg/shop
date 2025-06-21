import Hero from '@/components/Hero'
import Advantages from '@/components/Advantages'
import Catalog from '@/components/Catalog'
import About from '@/components/About'
import WorkProcess from '@/components/WorkProcess'
import Contacts from '@/components/Contacts'

export default function Home() {
  return (
    <main>
      <Hero />
      <Advantages />
      <Catalog />
      <About />
      <WorkProcess />
      <Contacts />
    </main>
  )
}
