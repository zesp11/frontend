import PlainText from "@/components/plainText";
import "./about.css";
import NavBar from "@/components/navbar";
export default function About() {
  return (
    <>
      <div className="aboutContainer" />
      <div className="wrapper">
        <PlainText text="Jakiś tekst co będzie nas opisywał" />
      </div>
    </>
  );
}
