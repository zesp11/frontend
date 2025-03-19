"use client";
import Link from "next/link";
import Image from "next/image";
import "@/components/generalComponents/styleModules/styles.css";
import { useState, useEffect } from "react";

export default function CreatorNavBar() {
  const [username, setUsername] = useState("Zaloguj");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    setIsClient(true);
    const user = localStorage.getItem("user");
    if (user) {
      setUsername(user);
    }
  }, []);

  return (
    <div className="navBarWrapper">
      <div className="logoWrapper">
        <Link href="/creator">
          <Image
            src="/temp-logo.png"
            alt="Background image"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div className="buttonWraper">
        <div className="button">🔔</div>
        <div className="button">⚙️</div>
        <div className="button">{username}</div>
      </div>
    </div>
  );
}
