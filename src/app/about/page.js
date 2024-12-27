import Image from "next/image";
import NavBar from "../../../components/navbar";
export default function About() {
  return (
    <>
      <Image
        src="/about-bg.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="wrapper">
        <NavBar />
        <h1>O nas</h1>
      </div>
    </>
  );
}
