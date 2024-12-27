import Image from "next/image";
import NavBar from "../../../components/navbar";
export default function Contact() {
  return (
    <>
      <Image
        src="/contact-bg.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="wrapper">
        <NavBar />
        <h1>Kontakt</h1>
      </div>
    </>
  );
}
