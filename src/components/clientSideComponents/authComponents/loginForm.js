"use client";
import Link from "next/link";
import "./styleModules/authStyles.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isTokenValid from "@/components/generalComponents/TokenValidation";

export default function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [mess, setMess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenValid(token)) {
        router.push("/creator");
      }
    }
  }, []);
  async function fetchData(event) {
    event.preventDefault();

    try {
      const res = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login: login, password: password }),
        }
      );

      const data = await res.json();
      if (data.error === "Invalid credentials.") {
        setMess("Niepoprawny login lub hasło");
      }
      if (data.message === "Login successful.") {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", data.user.login);
        localStorage.setItem("userId", data.user.id_user);
        localStorage.setItem("photoUrl", data.user.photo_url);
        localStorage.setItem("role", data.user.role);
        router.push("/creator");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleForgotPassword = () => {
    router.push("/#contact");
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="authContainer">
      <div className="authBackground"></div>
      <div className="authWrapper">
        <div className="authCard">
          <h1 className="authTitle">Zaloguj się!</h1>
          <form onSubmit={fetchData} className="authForm">
            <div className="formGroup">
              <label className="formLabel" htmlFor="username">
                Login
              </label>
              <input
                id="username"
                className="formInput"
                type="text"
                placeholder="Wprowadź swój login"
                required
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label className="formLabel" htmlFor="password">
                Hasło
              </label>
              <input
                autoComplete="current-password"
                id="password"
                className="formInput"
                type="password"
                placeholder="Wprowadź swoje hasło"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="forgotPassword"
              onClick={handleForgotPassword}
            >
              Zapomniałeś hasła?
            </button>
            <button className="submitButton" type="submit">
              ZALOGUJ SIĘ
            </button>
          </form>
          <div style={{ color: "red" }}>{mess}</div>
          <div className="authLink">
            <h3>
              Nie masz jeszcze konta?&nbsp;
              <Link className="authLinkText" href="/register">
                Zarejestruj się!
              </Link>
            </h3>
          </div>
          <div className="terms">
            <p>
              Logując się, zgadzasz się z&nbsp;
              <Link className="termsLink" href="/terms">
                Regulaminem
              </Link>
              &nbsp;oraz&nbsp;
              <Link className="termsLink" href="/privacy">
                Polityką Prywatności
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
