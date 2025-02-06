import Link from "next/link";
import "./styles.css"; // Importujemy plik CSS

export default function RegisterForm() {
  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="back-div">
          <div className="form-container">
            <h1 className="form-title">Zarejestruj się!</h1>
            <form action="#" method="post" className="form">
              <div className="form-group">
                <label className="form-label">Nazwa Użytkownika</label>
                <input
                  id="username"
                  className="form-input"
                  type="text"
                  placeholder="Nazwa Użytkownika"
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