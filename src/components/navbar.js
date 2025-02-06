import Link from "next/link";
import "./styles.css";
import Image from "next/image";
export default function NavBar() {
  return (
    <div className="navBarWrapper">
      <div className="logoWrapper">
        <Link href="/">
          <Image
            src="/temp-logo.png"
            alt="Background image"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div className="buttonWraper">
        <Link href="about" className="button">
          O nas
        </Link>
        <Link href="info" className="button">
          Możliwości
        </Link>
        <Link href="contact" className="button">
          Kontakt
        </Link>
        <Link href="login" className="loginButton">
          Zaloguj
        </Link>
      </div>
    </div>
  );
}
