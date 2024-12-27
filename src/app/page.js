import NavBar from "../../components/navbar";
import "./globals.css";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Image
        src="/home-bg.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="wrapper">
        <NavBar />
        <h1>Strona startowa!</h1>
      </div>
    </>
  );
}
