'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="#" className="logo">
          Orange<span>Black</span>
        </Link>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            O nas
          </Link>
          <Link href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Usługi
          </Link>
          <Link href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Kontakt
          </Link>
          <Link href="/creator" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Kreator
          </Link>
          <Link href="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Zaloguj
          </Link>
          
        </div>
        <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}