import NavBar from "../../components/navbar";
import "./globals.css";
import Image from "next/image";
export default function Home() {
  return (
    <>
        <div
        style={{
          backgroundImage: "url('/home-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -9999,
        }}
      />
      <div className="wrapper">
        <h1>Strona startowa!</h1>
      </div>
    </>
  );
}
