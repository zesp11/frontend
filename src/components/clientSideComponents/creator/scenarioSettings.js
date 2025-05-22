"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./styleModules/scenarioSettingsModule.css";

export default function ScenarioSettings({
  scenario,
  setScenario,
  id,
  isOpen,
  setIsOpen,
}) {
  const [name, setName] = useState(scenario?.name || "");
  const [description, setDescription] = useState(scenario?.description || "");
  const [numPlayers, setNumPlayers] = useState(scenario?.limit_players || 1);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(scenario?.photo_url || null);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const settingsRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Uzupełnij dane scenariusza!");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("limitPlayers", numPlayers);
      form.append("description", description);

      if (photo) {
        form.append("photo", photo);
      }

      const res = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${id}`,
        {
          method: "PUT",
          body: form,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Zaktualizowano dane scenariusza!");
        setScenario((s) => ({
          ...s,
          name: name,
          limit_players: Number(numPlayers),
          description: description,
          photo_url: previewUrl,
        }));
      } else {
        const errorText = await res.text();
        console.error("Failed to update scenario:", errorText);
      }
    } catch (error) {
      console.error("Error updating scenario:", error);
    }
  };

  const onDeleteScenario = async () => {
    const confirmed = confirm("Czy na pewno chcesz usunąć ten scenariusz?");
    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        router.push("/creator");
      } else {
        const errorText = await res.text();
        console.error("Failed to delete scenario:", errorText);
      }
    } catch (error) {
      console.error("Error deleting scenario:", error);
    }
  };

  const onSaveAndExit = () => {
    router.push("/creator");
  };

  const onHelp = () => {
    alert("Tu będzie popup z poradnikiem");
  };

  return (
    <div
      className={`scenarioSettingsWrapper ${isOpen ? "open" : "closed"}`}
      ref={settingsRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Mobile header with close button */}
      <div className="mobileHeader">
        <h2>Ustawienia scenariusza</h2>
        <button className="closeButton" onClick={() => setIsOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Photo section */}
      <div className="photoSection">
        <div className="fieldLabel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Zdjęcie scenariusza
        </div>
        <div className="scenarioPhotoContainer">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Scenario Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div className="photoPlaceholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Dodaj zdjęcie</span>
            </div>
          )}

          <div
            className="scenarioPhotoUpload"
            onClick={() => fileInputRef.current.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="settingsSection">
        {/* Scenario Name */}
        <div className="inputGroup">
          <label className="fieldLabel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Nazwa scenariusza
          </label>
          <input
            type="text"
            placeholder="Wprowadź nazwę scenariusza..."
            className="settingsInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="255"
          />
          <div className="charCounter">{name.length}/255</div>
        </div>

        {/* Number of Players */}
        <div className="inputGroup">
          <label className="fieldLabel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Limit graczy (1-6)
          </label>
          <input
            type="number"
            placeholder="Maksymalna liczba graczy"
            className="settingsInput"
            value={numPlayers}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (parseInt(value) >= 1 && parseInt(value) <= 6)
              ) {
                setNumPlayers(value);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value === "" || parseInt(value) < 1) {
                setNumPlayers(1);
              } else if (parseInt(value) > 6) {
                setNumPlayers(6);
              }
            }}
            min="1"
            max="6"
          />
        </div>

        {/* Description */}
        <div className="inputGroup">
          <label className="fieldLabel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Opis scenariusza
          </label>
          <div className="textareaContainer">
            <textarea
              placeholder="Opisz swój scenariusz w szczegółach..."
              className="settingsInput textareaInput"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength="4096"
            />
            <div className="charCounter">{description.length}/4096</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actionButtons">
          <button onClick={handleSubmit} className="actionButton primaryButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Zapisz zmiany
          </button>

          <button
            onClick={onDeleteScenario}
            className="actionButton deleteButton"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Usuń scenariusz
          </button>
        </div>

        <div className="bottomActions">
          <button
            className="actionButton secondaryButton"
            onClick={onSaveAndExit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1"></path>
              <path d="M15 13l3-3 3 3"></path>
              <path d="M21 10v9a2 2 0 0 1-2 2h-4"></path>
            </svg>
            Wyjdź
          </button>

          <button className="actionButton secondaryButton" onClick={onHelp}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Pomoc
          </button>
        </div>
      </div>
    </div>
  );
}
