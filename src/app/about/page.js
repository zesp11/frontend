import PlainText from "@/components/generalComponents/PlainText";
import "./about.css";
import NavBar from "@/components/generalComponents/navbar";
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
