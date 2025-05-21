'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'

export default function HomeSection() {
  const imageRef = useRef(null)

  useEffect(() => {
    // Opcjonalne: Lazy load observer dla lepszej wydajności
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-image')
        }
      })
    }, { threshold: 0.1 })

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="home" className="home-section">
      <div className="container home-container">
        <div className="home-content">
          <h1 className="animate">Witaj w nowoczesnym designie</h1>
          <p className="animate">Strona stworzona z myślą o minimalizmie i funkcjonalności.</p>
          <p className="animate">Połączenie czerni i pomarańczy tworzy dynamiczny kontrast.</p>
        </div>
        
        <div className="home-image-wrapper" ref={imageRef}>
          <Image
            src="/people.png" // Zmień na właściwą ścieżkę
            alt="Modern design"
            width={1200}
            height={800}
            className="home-image"
            priority
            quality={85}
          />
        </div>
      </div>
    </section>
  )
}