import Image from "next/image";
import NavBar from "../../../components/navbar";
export default function Login() {
  return (
    <>
      <Image
        src="/login-bg.jpg"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="wrapper">
        <NavBar />
        <h1>Logowanie</h1>
      </div>
    </>
  );
}
