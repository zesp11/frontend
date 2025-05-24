"use client";
import {
  MapPin,
  Users,
  Gamepad2,
  Star,
  Trophy,
  Compass,
  Globe,
  BookOpenCheck,
} from "lucide-react";
import styles from "./styleModules/featuresSection.module.css";

export default function FeaturesSection() {
  const features = [
    {
      icon: <MapPin size={24} color="#ff7f00" />,
      title: "Historie oparte na lokalizacji",
      description:
        "Przeżywaj opowieści, które zmieniają się w zależności od Twojego położenia. Każdy krok odkrywa nowe rozdziały i ukryte elementy fabuły powiązane z konkretnymi miejscami.",
    },
    {
      icon: <Users size={24} color="#ff7f00" />,
      title: "Przygody wieloosobowe",
      description:
        "Połącz siły ze znajomymi lub poznaj innych graczy w interaktywnych opowieściach. Wspólnie rozwiązujcie zagadki, podejmujcie decyzje i twórzcie niezapomniane wspomnienia w prawdziwym świecie.",
    },
    {
      icon: <Gamepad2 size={24} color="#ff7f00" />,
      title: "Interaktywna rozgrywka",
      description:
        "Podejmuj decyzje, które wpływają na bieg opowieści. Rozwiązuj zagadki zależne od lokalizacji i wchodź w interakcje z elementami przygotowanymi przez twórcę - zupełnie jak w grze terenowej!",
    },
    {
      icon: <Star size={24} color="#ff7f00" />,
      title: "Twórz własne historie",
      description:
        "Skorzystaj z naszego intuicyjnego kreatora, aby tworzyć własne przygody nanosząc je na rzeczywistość. Dziel się nimi z innymi i pozwól graczom przeżyć Twoją unikalną wizję interaktywnej narracji.",
    },
    {
      icon: <Globe size={24} color="#ff7f00" />,
      title: "Interaktywne przewodniki turystyczne",
      description:
        "Twórz własne ścieżki zwiedzania z elementami narracji, zagadkami i lokalnymi ciekawostkami. Przeobraź zwykłe miejsca w fascynujące opowieści i oprowadzaj użytkowników w zupełnie nowy sposób.",
    },
    {
      icon: <BookOpenCheck size={24} color="#ff7f00" />,
      title: "Edukacyjne scenariusze terenowe",
      description:
        "Projektuj gry i spacery edukacyjne dla szkół, muzeów lub wydarzeń lokalnych. Łącz wiedzę z ruchem i zabawą — ucz, angażując graczy w świecie rzeczywistym.",
    },
  ];

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Narzędzia Bohatera</h2>
        <p className={styles.sectionSubtitle}>
          Poznaj możliwości platformy, która przenosi interaktywne opowieści do
          prawdziwego świata.
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
