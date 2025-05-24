"use client";
import { Map } from "lucide-react";
import styles from "./styleModules/aboutSection.module.css";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Czym jest GoTale?</h2>
        <p className={styles.sectionSubtitle}>
          GoTale to nowy sposób na storytelling. Zamiast siedzieć przed ekranem,
          wchodzisz w sam środek historii.
        </p>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutContent}>
            <p className={styles.aboutParagraph}>
              To nie są tylko współrzędne. To punkty zwrotne Twojej historii.
              GoTale łączy geolokalizację z narracją, tworząc przygody, które
              rozgrywają się dokładnie tam, gdzie jesteś.
            </p>
            <p className={styles.aboutParagraph}>
              Niezależnie od tego, czy odkrywasz swoją okolicę, czy zwiedzasz
              nowe miasta, każda podróż może stać się fabularną przygodą. Ty i
              Twoja drużyna jesteście bohaterami. Rozwiązujcie zagadki oparte na
              lokalizacji, odkrywajcie sekrety i odblokowujcie kolejne rozdziały
              opowieści, przemierzając świat.
            </p>
            <p className={styles.aboutParagraph}>
              <span style={{ color: "#ff7f00" }}>
                A co, jeśli to Ty masz pomysł na historię?
              </span>{" "}
              W GoTale możesz samodzielnie tworzyć własne scenariusze,
              umieszczać punkty fabularne na mapie, projektować zagadki i
              ścieżki wydarzeń. Zaproś znajomych i rozegrajcie przygodę, którą
              sam wymyśliłeś. To jak mistrzowanie w grze RPG, tylko że planszą
              staje się prawdziwe miasto, las czy kampus.
            </p>
          </div>
          <div className={styles.aboutImage}>
            <Image
              src="/phones.png"
              alt="Phones UI"
              fill
              style={{ objectFit: "cover", zIndex: 0, opacity: 0.8 }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={styles.aboutImageContent}>
              <Map size={80} color="#ff7f00" className={styles.aboutIcon} />
              <span className={styles.aboutImageText}>
                Jak daleko zajdziesz?
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
