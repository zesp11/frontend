"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./styleModules/creatorNavBarModule.css";

export default function CreatorNavBar() {
  const [username, setUsername] = useState("Zaloguj");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const refresh = () => {
      const user = localStorage.getItem("user");
      const image = localStorage.getItem("photoUrl");

      if (user) setUsername(user);
      if (image && image !== "null") setPhotoUrl(image);
      else setPhotoUrl(null);
    };

    window.addEventListener("localStorageUpdated", refresh);
    return () => window.removeEventListener("localStorageUpdated", refresh);
  }, []);
  useEffect(() => {
    // This code only runs on the client
    setIsClient(true);
    const user = localStorage.getItem("user");
    const image = localStorage.getItem("photoUrl");

    if (user) {
      setUsername(user);
    }
    if (image && image !== "null") {
      setPhotoUrl(image);
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }
      const res = await fetch(
        "https://squid-app-p63zw.ondigitalocean.app/api/auth/logout",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
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
          <div className="logo-image">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <span className="logo-text">
            Go<span className="logo-highlight">Tale</span>
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
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={username}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span className="avatar-text">
                  {username.charAt(0).toUpperCase()}
                </span>
              )}
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
