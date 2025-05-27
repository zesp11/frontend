"use client";
import { Pencil, ArrowDownToLineIcon, MapPin } from "lucide-react";
import styles from "./styleModules/heroSection.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const onNewStory = () => {
    router.push("/login");
  };
  const onDownload = () => {
    alert("Obecnie aplikacja mobilna jest niedostępna dla użytkowników.");
  };
  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.heroBackground}></div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Twoja wyobraźnia ma teraz mapę.</h1>
          <p className={styles.heroSubtitle}>
            Z GoTale miasto staje się mapą przygód odkrywaj tajemnice, podążaj
            zapomnianymi ścieżkami i ożywiaj historie wpisane w rzeczywistość.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton} onClick={onNewStory}>
              <Pencil size={20} />
              Stwórz przygodę
            </button>
            <button className={styles.secondaryButton} onClick={onDownload}>
              <ArrowDownToLineIcon size={20} />
              Pobierz aplikację
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.heroImagePlaceholder}>
            <Image
              src="/map.png"
              alt="Map Under Pin"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", zIndex: 0, opacity: 0.8 }}
            />
            <div className={styles.heroImageContent}>
              <MapPin size={64} color="#ff7f00" />
              <span className={styles.heroImageText}>Przygoda Czeka</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.creatorImageWrapper}>
        <Image
          src="/creator.png"
          alt="Creator Overlay"
          fill
          priority
          style={{ objectFit: "contain", opacity: 0.1 }}
        />
      </div>
    </section>
  );
}
