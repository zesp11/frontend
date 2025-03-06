import Link from "next/link";
import Image from "next/image";
import "@/components/generalComponents/styleModules/styles.css";
//Navbar rendered only in "/creator" part.
//To implement: events when buttons are hovered and clicked
export default function CreatorNavBar() {
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
        <div className="button">
          {localStorage.getItem("user")
            ? localStorage.getItem("user")
            : "Zaloguj"}
        </div>
      </div>
    </div>
  );
}
