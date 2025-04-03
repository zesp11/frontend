import "./globals.css";
import PlainText from "@/components/generalComponents/PlainText";

export default function Home() {
  return (
    <>
      <div className="section1" id="section1">
      <PlainText headerText="GoTale" bodyText="Nasz projekt ułatwia integrację w zespole dzięki wspólnemu odkrywaniu opowieści, poznawaniu nowych miejsc i budowie świata na podstawie podejmowanych decyzji." /></div>
      <div className="parallax home">
      </div>
      <div className="overlayblur" style={{ top: "99%" }}></div>
      <div className="section2" id="section2">
      <PlainText headerText=""bodyText="Projekt GoTale to innowacyjne rozwiązanie, które łączy miłośników przygód i gier miejskich w jednym interaktywnym systemie.
       Naszym celem jest stworzenie aplikacji umożliwiającej graczom odkrywanie świata poprzez wspólne tworzenie i przeżywanie interaktywnych książek
        przygodowych (gamebooków). Gracze mogą tworzyć zespoły, podejmować decyzje w grze, a ich działania będą wymagały fizycznego przemieszczania
         się po mieście przy użyciu GPS." /></div>
      <div className="parallax about">
      </div>
      <div className="overlayblur" style={{ top: "199%" }}></div>
      <div className="section3" id="section3">
      <PlainText headerText="Możliwości projektu"bodyText="GoTale umożliwia tworzenie i edytowanie interaktywnych historii, określanie decyzji graczy, ich konsekwencji, a także lokalizacji, które gracze muszą odwiedzić w trakcie rozgrywki. Aplikacja mobilna Gamebook Explorer pozwala na odtwarzanie stworzonych historii w czasie rzeczywistym, umożliwiając zespołom dynamiczne podejmowanie decyzji i śledzenie ich postępów w grze." /></div>
      <div className="parallax info">
      </div>
      <div className="overlayblur"style={{ top: "299%" }}></div>
      <div className="section4" id="section4">
      <PlainText headerText=""bodyText="Kontakt" /></div>
      <div className="parallax contact">
      </div>
    </>
  );
}