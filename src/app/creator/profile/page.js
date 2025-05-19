"use client";
import { useEffect, useState, useRef } from "react";
import "./profile.css";

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
      if (!response.ok) alert("Update failed");
      else alert("Profile updated successfully");
    } catch (error) {
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

  if (isLoading) {
    return (
      <div className="profileWrapper">
        <div className="loadingIndicator">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profileWrapper">
      <h1 className="profileTitle">Profil</h1>

      <div className="settingsSection">
        <form onSubmit={handleUpdate} className="profileForm">
          <div className="form-group">
            <label>Zdjęcie profilowe:</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {profileData.photoPreview && (
              <div className="image-preview-container">
                <img
                  src={profileData.photoPreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                >
                  Usuń zdjęcie
                </button>
              </div>
            )}
          </div>

          <div className="inputGroup">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              className="settingsInput"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="settingsInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              className="settingsInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zostaw puste, jeśli nie chcesz zmieniać hasła"
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="retypePassword">Powtórz Hasło</label>
            <input
              id="retypePassword"
              className="settingsInput"
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="bio">Biogram</label>
            <textarea
              id="bio"
              className="settingsInput bioInput"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button className="actionButton" type="submit">
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
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      {creationDate && (
        <div className="creationDateContainer">
          <p className="creationDate">
            Konto stworzone: {new Date(creationDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
