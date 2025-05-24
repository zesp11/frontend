// navBar.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import styles from "./styleModules/navBar.module.css";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrollY > 50 ? styles.scrolled : ""}`}
      >
        <div className={styles.navContainer}>
          <button
            className={styles.navbarLogo}
            onClick={() => scrollToSection("hero")}
          >
            <div className={styles.logoImage}>
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className={styles.logoText}>
              Go <span className={styles.logoHighlight}>Tale</span>
            </span>
          </button>

          <div className={styles.navLinks}>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection("hero")}
            >
              Strona Główna
            </button>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection("about")}
            >
              O nas
            </button>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection("features")}
            >
              Możliwości
            </button>
            <button
              className={styles.navLink}
              onClick={() => scrollToSection("contact")}
            >
              Kontakt
            </button>
            <Link href="/login" className={styles.loginLink}>
              Zaloguj
            </Link>
          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <button
          className={styles.mobileNavLink}
          onClick={() => scrollToSection("hero")}
        >
          Strona główna
        </button>
        <button
          className={styles.mobileNavLink}
          onClick={() => scrollToSection("about")}
        >
          O nas
        </button>
        <button
          className={styles.mobileNavLink}
          onClick={() => scrollToSection("features")}
        >
          Możliwości
        </button>
        <button
          className={styles.mobileNavLink}
          onClick={() => scrollToSection("contact")}
        >
          Kontakt
        </button>
        <Link href="/login" className={styles.mobileNavLink}>
          Zaloguj
        </Link>
      </div>
    </>
  );
}
