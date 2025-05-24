"use client";

import HeroSection from "@/components/generalComponents/HeroSection";
import AboutSection from "@/components/generalComponents/AboutSection";
import ContactSection from "@/components/generalComponents/ContactSection";
import FeaturesSection from "@/components/generalComponents/FeaturesSection";
import Navbar from "@/components/generalComponents/NavBar";
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
      {/* <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection /> */}
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
    </main>
  );
}
