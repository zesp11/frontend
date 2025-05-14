"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./styleModules/creatorNavBarModule.css";

export default function CreatorNavBar() {
  const [username, setUsername] = useState("Zaloguj");
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    setIsClient(true);
    const user = localStorage.getItem("user");
    if (user) {
      setUsername(user);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/creator" className="navbar-logo">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="logo-image"
          />
          <span className="logo-text">
            Go <span className="logo-highlight">Tale</span>
          </span>
        </Link>

        <div className="navbar-actions">
          {/* <button className="navbar-button notification-button">
            <span className="button-icon">🔔</span>
            <span className="notification-badge">2</span>
          </button>

          <button className="navbar-button settings-button">
            <span className="button-icon">⚙️</span>
          </button> */}

          <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="avatar-container">
              <span className="avatar-text">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="username">{username}</span>
            <span className="dropdown-icon">{menuOpen ? "▲" : "▼"}</span>

            {menuOpen && (
              <div className="dropdown-menu">
                <Link href="/creator/profile" className="menu-item">
                  Profil
                </Link>
                <div className="menu-divider"></div>
                <Link href="/logout" className="menu-item logout">
                  Wyloguj
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
