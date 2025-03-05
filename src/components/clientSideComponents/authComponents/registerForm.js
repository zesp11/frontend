"use client";
import Link from "next/link";
import "@/components/generalComponents/styleModules/styles.css";
import { useState } from "react";

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");

  async function fetchData(event) {
    event.preventDefault();
    if (password !== passwordRetype) {
      alert("Hasła nie są takie same!");
      return;
    }
    try {
      const res = await fetch(`/api/proxy/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        console.error("Failed to fetch data", res.status);
        return;
      }

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="back-div">
          <div className="form-container">
            <h1 className="form-title">Zarejestruj się!</h1>
            <form onSubmit={fetchData} className="form">
              <div className="form-group">
                <label className="form-label">Nazwa Użytkownika</label>
                <input
                  id="username"
                  className="form-input"
                  type="text"
                  placeholder="Nazwa Użytkownika"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hasło</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Powtórz Hasło</label>
                <input
                  id="password-retype"
                  className="form-input"
                  type="password"
                  placeholder="Powtórz Hasło"
                  value={passwordRetype}
                  onChange={(e) => setPasswordRetype(e.target.value)}
                  required
                />
              </div>
              <button className="submit-button" type="submit">
                UTWÓRZ KONTO
              </button>
            </form>
            <div className="login-link">
              <h3>
                Masz konto?&nbsp;
                <Link className="login-link-text" href="/login">
                  Zaloguj się!
                </Link>
              </h3>
            </div>
            <div className="terms">
              <p>
                Tworząc konto, zgadzasz się z&nbsp;
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
