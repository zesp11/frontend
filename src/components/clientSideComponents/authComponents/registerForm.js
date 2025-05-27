"use client";
import Link from "next/link";
import "./styleModules/authStyles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
const url = process.env.NEXT_PUBLIC_API_URL;
export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");
  const [mess, setMess] = useState("");
  const router = useRouter();
  async function fetchData(event) {
    event.preventDefault();
    if (password !== passwordRetype) {
      alert("Hasła nie są takie same!");
      return;
    }
    try {
      const res = await fetch(`${url}/api/auth/register`, {
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

      const data = await res.json();
      if (!res.ok) setMess(data.message);
      else {
        alert("Pomyślnie założono konto. Możesz się teraz zalogować.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="authContainer">
      <div className="authBackground"></div>
      <div className="authWrapper">
        <div className="authCard">
          <h1 className="authTitle">Zarejestruj się!</h1>
          <form onSubmit={fetchData} className="authForm">
            <div className="formGroup">
              <label className="formLabel">Nazwa Użytkownika</label>
              <input
                id="username"
                className="formInput"
                type="text"
                placeholder="Wprowadź nazwę użytkownika"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Email</label>
              <input
                id="email"
                className="formInput"
                type="email"
                placeholder="Wprowadź swój email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Hasło</label>
              <input
                id="password"
                className="formInput"
                type="password"
                placeholder="Wprowadź hasło"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label className="formLabel">Powtórz Hasło</label>
              <input
                id="password-retype"
                className="formInput"
                type="password"
                placeholder="Powtórz hasło"
                autoComplete="new-password"
                value={passwordRetype}
                onChange={(e) => setPasswordRetype(e.target.value)}
                required
              />
            </div>
            <button className="submitButton" type="submit">
              UTWÓRZ KONTO
            </button>
          </form>
          <div style={{ color: "red" }}>{mess}</div>
          <div className="authLink">
            <h3>
              Masz już konto?&nbsp;
              <Link className="authLinkText" href="/login">
                Zaloguj się!
              </Link>
            </h3>
          </div>
          <div className="terms">
            <p>
              Tworząc konto, zgadzasz się z&nbsp;
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
