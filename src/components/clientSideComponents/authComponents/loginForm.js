"use client";
import Link from "next/link";
import "@/components/generalComponents/styleModules/styles.css";
import { useState } from "react";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function fetchData(event) {
    event.preventDefault();

    try {
      const res = await fetch(`/api/proxy/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: login, password }),
      });

      if (!res.ok) {
        console.error("Failed to fetch data", res.status);
        return;
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="back-div">
          <div className="form-container">
            <h1 className="form-title">Zaloguj się!</h1>
            <form onSubmit={fetchData} className="form">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="form-input"
                  type="text"
                  placeholder="Email"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Hasło
                </label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Hasło"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <a className="forgot-password" href="#">
                Zapomniałeś Hasła?
              </a>
              <button className="submit-button" type="submit">
                ZALOGUJ
              </button>
            </form>
            <div className="register-link">
              <h3>
                Nie masz jeszcze konta?&nbsp;
                <Link className="register-link-text" href="/register">
                  Zarejestruj się!
                </Link>
              </h3>
            </div>
            <div className="terms">
              <p>
                Logując się, zgadzasz się z&nbsp;
                <a className="terms-link" href="#">
                  Regulaminem
                </a>
                &nbsp;oraz&nbsp;
                <a className="terms-link" href="#">
                  Polityką Prywatności
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
