"use client";
import ContactSection from "../components/generalComponents/contactSection";
import FeaturesSection from "../components/generalComponents/featuresSection";
import AboutSection from "../components/generalComponents/aboutSection";
import HeroSection from "../components/generalComponents/heroSection";
import Navbar from "../components/generalComponents/navBar";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Smooth scrolling behavior for anchor links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Handle initial hash

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
    </main>
  );
}
