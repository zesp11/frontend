import Image from "next/image";
import NavBar from "../../../components/navbar";

export default function Login() {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/login-bg.jpg')",
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
      <div>
        <h1>Logowanie</h1>
      </div>
    </>
  );
}
