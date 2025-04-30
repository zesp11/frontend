import "./globals.css";
import PlainText from "@/components/generalComponents/PlainText";

export default function Home() {
  return (
    <>
      <div className="section" id="section1">
        <PlainText
          headerText="GoTale"
          bodyText="Nasz projekt ułatwia integrację w zespole dzięki wspólnemu odkrywaniu opowieści, poznawaniu nowych miejsc i budowie świata na podstawie podejmowanych decyzji."
        />
        <img
          src="/temp-logo.png"
          alt="Ilustracja współpracy zespołowej"
          className="animated-image"
        />
      </div>

      <div className="section" id="section2">
        <PlainText
          headerText=""
          bodyText="Projekt GoTale to innowacyjne rozwiązanie, które łączy miłośników przygód i gier miejskich w jednym interaktywnym systemie..."
        />
        <img
          src="/logos.png" 
          alt="Plakat gry miejskiej"
          className="animated-image2"
        />
      </div>

      <div className="section" id="section3">
        <PlainText
          headerText="Możliwości projektu"
          bodyText="GoTale umożliwia tworzenie i edytowanie interaktywnych historii..."
        />
        <img
          src="/main.png"
          alt="Interaktywna książka"
          className="animated-image3"
        />
      </div>

      <div className="section" id="section4">
      <PlainText headerText=""bodyText="Kontakt" />
      <img
          src="/hero.png"
          alt="Interaktywna książka"
          className="animated-image4"
        />
      </div>
    </>
  );
}