"use client";
import "./termsStyles.css";

export default function Terms() {
  return (
    <div className="policyContainer">
      <div className="policyBackground"></div>
      <div className="policyWrapper">
        <div className="policyCard">
          <div className="policyHeader">
            <h1 className="policyTitle">Regulamin Aplikacji</h1>
            <p className="policySubtitle">
              Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
            </p>
          </div>

          <div className="policyContent">
            <section className="policySection">
              <h2 className="sectionTitle">1. Postanowienia ogólne</h2>
              <p className="sectionText">
                Niniejszy regulamin określa zasady korzystania z oprogramowania
                do tworzenia oraz rozgrywania gier paragrafowych w terenie,
                wykorzystującej funkcje geolokalizacji. Korzystając z aplikacji,
                użytkownik akceptuje warunki określone w niniejszym regulaminie.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">2. Definicje</h2>
              <p className="sectionText">
                <strong>"Aplikacja"</strong> – platforma mobilna i webowa
                umożliwiająca tworzenie, edycję i uczestnictwo w grach
                terenowych.
                <br />
                <strong>"Użytkownik"</strong> – osoba fizyczna posiadająca konto
                w aplikacji.
                <br />
                <strong>"Gra"</strong> – interaktywna przygoda oparta o
                fabularne decyzje i lokalizację GPS.
                <br />
                <strong>"Twórca"</strong> – użytkownik tworzący i publikujący
                grę.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">3. Rejestracja i konto</h2>
              <p className="sectionText">
                Aby korzystać z aplikacji, użytkownik musi założyć konto.
                Rejestracja wymaga podania prawdziwego adresu e-mail oraz nazwy
                użytkownika. Użytkownik zobowiązany jest do nieudostępniania
                swojego hasła osobom trzecim.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">4. Korzystanie z aplikacji</h2>
              <ul className="policyList">
                <li>
                  Użytkownik zobowiązuje się do korzystania z aplikacji zgodnie
                  z obowiązującym prawem i niniejszym regulaminem.
                </li>
                <li>
                  Gry muszą być tworzone z poszanowaniem prywatności i
                  bezpieczeństwa innych osób.
                </li>
                <li>
                  Zabrania się publikowania treści obraźliwych, nieprawdziwych
                  lub naruszających prawo.
                </li>
                <li>
                  Użytkownik odpowiada za treść gier, które tworzy i udostępnia.
                </li>
              </ul>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">5. Geolokalizacja</h2>
              <p className="sectionText">
                Aplikacja wykorzystuje dane lokalizacyjne użytkownika w celu
                umożliwienia interaktywnego udziału w grach terenowych. Dane te
                są przetwarzane wyłącznie w zakresie niezbędnym do działania
                aplikacji i nie są udostępniane osobom trzecim bez zgody
                użytkownika.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">6. Prawa autorskie</h2>
              <p className="sectionText">
                Twórca gry zachowuje prawa autorskie do jej treści, jednak
                poprzez publikację udziela aplikacji niewyłącznej licencji na
                jej udostępnianie innym użytkownikom. Zabronione jest kopiowanie
                cudzych gier bez zgody ich autora.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">7. Odpowiedzialność</h2>
              <p className="sectionText">
                Aplikacja nie ponosi odpowiedzialności za zachowanie
                użytkowników podczas rozgrywek w terenie. Użytkownik bierze
                udział w grach na własną odpowiedzialność i zobowiązuje się do
                zachowania ostrożności, zwłaszcza w miejscach publicznych i przy
                poruszaniu się po trasie gry.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">8. Zmiany w regulaminie</h2>
              <p className="sectionText">
                Zastrzegamy sobie prawo do zmiany niniejszego regulaminu w
                dowolnym momencie. O zmianach użytkownicy zostaną poinformowani
                poprzez aplikację lub drogą mailową.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">9. Usunięcie konta</h2>
              <p className="sectionText">
                Użytkownik może w każdej chwili usunąć swoje konto poprzez
                ustawienia w aplikacji. Usunięcie konta jest nieodwracalne i
                skutkuje usunięciem danych oraz gier powiązanych z kontem.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">10. Kontakt</h2>
              <p className="sectionText">
                W przypadku pytań dotyczących działania aplikacji lub
                regulaminu, prosimy niekontaktowanie się. Poniższe dane są
                fikcyjne:
              </p>
              <div className="contactInfo">
                <p>Email: zesp11@gotale.com</p>
                <p>Telefon: +48 123 456 789</p>
                <p>Adres: ul. Przygodowa 123, 87-100 Toruń</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
