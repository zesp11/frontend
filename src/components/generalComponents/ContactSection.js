"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import styles from "./styleModules/contactSection.module.css";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Wiadomość została wysłana!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactBackground}></div>
      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h2 className={styles.contactTitle}>Skontaktuj się z nami</h2>
          <p className={styles.contactSubtitle}>
            Masz pytania o GoTale? Chcesz podzielić się swoją przygodą? Napisz
            do nas - jesteśmy tutaj, aby Ci pomóc!
          </p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h3 className={styles.contactInfoTitle}>Znajdź nas</h3>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Mail size={24} />
              </div>
              <div className={styles.contactDetails}>
                <h4>Email</h4>
                <p>kontakt@gotale.com</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Phone size={24} />
              </div>
              <div className={styles.contactDetails}>
                <h4>Telefon</h4>
                <p>+48 123 456 789</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <MapPin size={24} />
              </div>
              <div className={styles.contactDetails}>
                <h4>Adres</h4>
                <p>
                  ul. Przygodowa 123
                  <br />
                  87-100 Toruń
                </p>
              </div>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Imię i nazwisko
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>
                Temat
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Wiadomość
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows={5}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Wyślij wiadomość
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
