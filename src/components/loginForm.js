import Link from "next/link";
import "./styles.css"; // Importujemy plik CSS

export default function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="back-div">
          <div className="form-container">
            <h1 className="form-title">Zaloguj się!</h1>
            <form action="#" method="post" className="form">
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