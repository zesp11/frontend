'use client'
import { useEffect } from 'react'
import Navbar from '../components/generalComponents/navbar'
import HomeSection from '../components/generalComponents/HomeSection'
import AboutSection from '../components/generalComponents/AboutSection'
import ServicesSection from '../components/generalComponents/ServicesSection'
import ContactSection from '../components/generalComponents/ContactSection'
import Fade from '../components/generalComponents/fade'

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 50) {
        navbar.style.padding = '15px 0'
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)'
      } else {
        navbar.style.padding = '20px 0'
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.9)'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main>
      <Navbar />
      <HomeSection />
      <AboutSection />
      <Fade id="first"/>
      <ServicesSection />
      <Fade id="second"/>
      <ContactSection />
    </main>
  )
}
