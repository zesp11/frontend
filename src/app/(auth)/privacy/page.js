"use client";
import "./policyStyles.css";
export default function PrivacyPolicy() {
  return (
    <div className="policyContainer">
      <div className="policyBackground"></div>
      <div className="policyWrapper">
        <div className="policyCard">
          <div className="policyHeader">
            <h1 className="policyTitle">Polityka Prywatności</h1>
            <p className="policySubtitle">
              Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
            </p>
          </div>

          <div className="policyContent">
            <section className="policySection">
              <h2 className="sectionTitle">1. Informacje ogólne</h2>
              <p className="sectionText">
                Niniejsza Polityka Prywatności określa zasady przetwarzania i
                ochrony danych osobowych użytkowników naszej platformy. Dbamy o
                Twoją prywatność i bezpieczeństwo danych zgodnie z przepisami
                RODO.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">2. Administrator danych</h2>
              <p className="sectionText">
                Administratorem Twoich danych osobowych jest zespół 11, z
                siedzibą w [jeszcze nie uzbieraliśmy]. W sprawach dotyczących
                ochrony danych możesz się z nami nie kontaktować, bo się
                kompletnie na tym nie znamy, a całe te prawa zostały
                wygenerowane przez AI.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">3. Jakie dane zbieramy</h2>
              <div className="dataList">
                <div className="dataItem">
                  <h3>Dane rejestracyjne:</h3>
                  <p>
                    nazwa użytkownika, adres email, hasło (w formie
                    zaszyfrowanej)
                  </p>
                </div>
                <div className="dataItem">
                  <h3>Dane techniczne:</h3>
                  <p>
                    adres IP, typ przeglądarki, system operacyjny, logi dostępu
                  </p>
                </div>
                <div className="dataItem">
                  <h3>Dane użytkowania:</h3>
                  <p>
                    informacje o aktywności na platformie, preferencje, historia
                    działań
                  </p>
                </div>
              </div>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">4. Cel przetwarzania danych</h2>
              <ul className="policyList">
                <li>Świadczenie usług i funkcjonalności platformy</li>
                <li>Zarządzanie kontem użytkownika</li>
                <li>Komunikacja z użytkownikami</li>
                <li>Zapewnienie bezpieczeństwa platformy</li>
                <li>Analiza i ulepszanie naszych usług</li>
                <li>Wypełnianie obowiązków prawnych</li>
              </ul>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">5. Podstawa prawna</h2>
              <p className="sectionText">
                Przetwarzamy Twoje dane osobowe na podstawie:
              </p>
              <ul className="policyList">
                <li>Wykonania umowy (świadczenie usług)</li>
                <li>
                  Prawnie uzasadnionego interesu (bezpieczeństwo, analityka)
                </li>
                <li>Zgody użytkownika (marketing, komunikacja)</li>
                <li>Obowiązku prawnego (archiwizacja, raportowanie)</li>
              </ul>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">6. Udostępnianie danych</h2>
              <p className="sectionText">
                Twoje dane osobowe mogą być udostępniane wyłącznie:
              </p>
              <ul className="policyList">
                <li>Dostawcom usług technicznych (hosting, płatności)</li>
                <li>Organom państwowym na podstawie przepisów prawa</li>
                <li>Partnerom biznesowym za Twoją wyraźną zgodą</li>
              </ul>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">7. Twoje prawa</h2>
              <p className="sectionText">
                Przysługują Ci następujące prawa w zakresie ochrony danych
                osobowych:
              </p>
              <ul className="policyList">
                <li>Prawo dostępu do danych</li>
                <li>Prawo do sprostowania danych</li>
                <li>Prawo do usunięcia danych</li>
                <li>Prawo do ograniczenia przetwarzania</li>
                <li>Prawo do przenoszenia danych</li>
                <li>Prawo sprzeciwu wobec przetwarzania</li>
                <li>Prawo cofnięcia zgody</li>
              </ul>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">8. Okres przechowywania danych</h2>
              <p className="sectionText">
                Twoje dane osobowe przechowujemy przez okres niezbędny do
                realizacji celów, dla których zostały zebrane, nie dłużej jednak
                niż przez okres wynikający z przepisów prawa lub do momentu
                cofnięcia zgody.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">9. Bezpieczeństwo danych</h2>
              <p className="sectionText">
                Stosujemy odpowiednie środki techniczne i organizacyjne w celu
                ochrony Twoich danych osobowych przed nieuprawnionym dostępem,
                utratą, zniszczeniem lub nieuprawnionym przetwarzaniem.
              </p>
            </section>

            <section className="policySection">
              <h2 className="sectionTitle">10. Kontakt</h2>
              <p className="sectionText">
                W przypadku pytań dotyczących niniejszej Polityki Prywatności
                lub przetwarzania Twoich danych osobowych, nie kontaktuj się z
                nami. Poniższe dane nawet nie są prawdziwe:
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
