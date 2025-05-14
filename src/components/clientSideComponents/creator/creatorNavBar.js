"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./styleModules/creatorNavBarModule.css";

export default function CreatorNavBar() {
  const [username, setUsername] = useState("Zaloguj");
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // This code only runs on the client
    setIsClient(true);
    const user = localStorage.getItem("user");
    if (user) {
      setUsername(user);
    }

    // Add click outside listener to close dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function onLogout() {
    try {
      const res = await fetch(
        "https://squid-app-p63zw.ondigitalocean.app/api/auth/logout"
      );
      if (!res.ok) {
        throw new Error("failed to logout");
      }
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }

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

          <div
            className="user-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            ref={dropdownRef}
          >
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
                <Link href="/" className="menu-item logout" onClick={onLogout}>
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
