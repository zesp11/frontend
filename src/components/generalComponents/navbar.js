import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import "./styleModules/styles.css";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navBarWrapper">
      <div className="navContainer">
        <div className="logoWrapper">
          <Link href="../#section1">
            <Image src="/temp-logo.png" alt="Logo" width={50} height={50} />
          </Link>
        </div>
        <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          <Link href="../#section2" className="nav-link">O nas</Link>
          <Link href="../#section3" className="nav-link">Możliwości</Link>
          <Link href="../#section4" className="nav-link">Kontakt</Link>
          <Link href="creator" className="nav-link">Kreator</Link>
          <Link href="login" className="loginButton">Zaloguj</Link>
        </div>
      </div>
    </nav>
  );
}