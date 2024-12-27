import Image from "next/image";
import NavBar from "../../../components/navbar";
export default function Info() {
  return (
    <>
      <Image
        src="/info-bg.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="wrapper">
        <NavBar />
        <h1>Informacje o projekcie</h1>
      </div>
    </>
  );
}
