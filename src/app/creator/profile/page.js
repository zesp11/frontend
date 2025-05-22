"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./profile.module.css";

export default function Profile() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [bio, setBio] = useState("");
  const [profileData, setProfileData] = useState({
    photo: null,
    photoPreview: null,
  });
  const [creationDate, setCreationDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fileName, setFileName] = useState("Wybierz plik");
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://squid-app-p63zw.ondigitalocean.app/api/users/profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          setIsLoading(false);
          return;
        }
        const res = await response.json();
        setLogin(res.login);
        setEmail(res.email);
        setBio(res.bio || "");
        setProfileData((prev) => ({
          ...prev,
          photoPreview: res.photo_url || null,
        }));
        setCreationDate(res.creation_date);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();

    if (password !== retypePassword) {
      alert("Hasła nie są takie same!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const formData = new FormData();
      formData.append("login", login);
      formData.append("email", email);
      if (password) {
        formData.append("password", password);
      }
      formData.append("bio", bio);

      if (profileData.photo instanceof File) {
        formData.append("photo", profileData.photo);
      }

      setIsLoading(true);
      const response = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      setIsLoading(false);

      if (!response.ok) alert("Coś poszło nie tak...");
      else alert("Profil zaktualizowany!");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
      setFileName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setProfileData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null,
    }));
    setFileName("Wybierz plik");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className={styles.profileWrapper}>
        <div className={styles.loadingIndicator}>Loading</div>
      </div>
    );
  }

  return (
    <div className={styles.profileWrapper}>
      <h1 className={styles.profileTitle}>Edycja Profilu</h1>

      <div className={styles.settingsSection}>
        <form onSubmit={handleUpdate} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label>Zdjęcie profilowe:</label>
            <div className={styles.fileInputContainer}>
              <div className={styles.fileInputButton}>
                <span>{fileName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>

            {profileData.photoPreview && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={profileData.photoPreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Usuń
                </button>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="login">Login</label>
            <input
              id="login"
              className={styles.settingsInput}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.settingsInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              className={styles.settingsInput}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zostaw puste, jeśli nie chcesz zmieniać hasła"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="retypePassword">Powtórz Hasło</label>
            <input
              id="retypePassword"
              className={styles.settingsInput}
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="bio">Biogram</label>
            <textarea
              id="bio"
              className={`${styles.settingsInput} ${styles.bioInput}`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button className={styles.actionButton} type="submit">
            Zapisz zmiany
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      {creationDate && (
        <div className={styles.creationDateContainer}>
          <p className={styles.creationDate}>
            Konto stworzone: {new Date(creationDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
