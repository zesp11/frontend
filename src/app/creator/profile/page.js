"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import setLocalStorageItem from "@/components/clientSideComponents/creator/functionalComponents/localStorageSetItem";
const url = process.env.NEXT_PUBLIC_API_URL;
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
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${url}/api/users/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const response = await fetch(`${url}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      setIsLoading(false);

      if (!response.ok) alert("Coś poszło nie tak...");
      else {
        const r = await response.json();
        setLocalStorageItem("user", r.login);
        setLocalStorageItem("photoUrl", r.photo_url);
      }
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
    }
  };

  const handleRemoveImage = () => {
    setProfileData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBackToCreator = () => {
    router.push("/creator");
  };

  const handleAccountDelete = async () => {
    const confirmed = confirm("Czy na pewno chcesz usunąć konto?");
    if (!confirmed) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Brak tokenu jwt");
      return;
    }
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`${url}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Twoje konto zostało pomyślnie usunięte.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.profileWrapper}>
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Ładowanie profilu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileBackground}>
      <div className={styles.profileContainer}>
        <div className={styles.profileWrapper}>
          {/* Header with back button */}
          <div className={styles.profileHeader}>
            <button onClick={handleBackToCreator} className={styles.backButton}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Powrót
            </button>
            <h1 className={styles.profileTitle}>Edycja Profilu</h1>
          </div>

          <form onSubmit={handleUpdate} className={styles.profileForm}>
            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarWrapper}>
                  {profileData.photoPreview ? (
                    <img
                      src={profileData.photoPreview}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.avatarEditButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>
                {profileData.photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeAvatarButton}
                  >
                    Usuń zdjęcie
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className={styles.hiddenFileInput}
              />
            </div>

            {/* Form Fields Grid */}
            <div className={styles.formGrid}>
              <div className={styles.formColumn}>
                <div className={styles.inputGroup}>
                  <label htmlFor="login" className={styles.formLabel}>
                    Login
                  </label>
                  <input
                    id="login"
                    className={styles.formInput}
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email
                  </label>
                  <input
                    id="email"
                    className={styles.formInput}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.formColumn}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.formLabel}>
                    Nowe hasło
                  </label>
                  <input
                    id="password"
                    className={styles.formInput}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zostaw puste, aby nie zmieniać"
                    autoComplete="new-password"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="retypePassword" className={styles.formLabel}>
                    Powtórz hasło
                  </label>
                  <input
                    id="retypePassword"
                    className={styles.formInput}
                    type="password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    placeholder="Powtórz nowe hasło"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className={styles.inputGroup}>
              <label htmlFor="bio" className={styles.formLabel}>
                Biogram
              </label>
              <textarea
                id="bio"
                className={`${styles.formInput} ${styles.bioTextarea}`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Opowiedz coś o sobie..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17,21 17,13 7,13 7,21" />
                      <polyline points="7,3 7,8 15,8" />
                    </svg>
                    Zapisz zmiany
                  </>
                )}
              </button>

              <button
                className={styles.deleteButton}
                onClick={handleAccountDelete}
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Usuń konto
              </button>
            </div>
          </form>

          {/* Account Info Footer */}
          {creationDate && (
            <div className={styles.accountInfo}>
              <div className={styles.creationDate}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Konto utworzone:{" "}
                {new Date(creationDate).toLocaleDateString("pl-PL")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
