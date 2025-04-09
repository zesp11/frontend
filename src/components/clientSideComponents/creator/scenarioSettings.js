"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./styleModules/scenarioSettingsModule.css";

export default function ScenarioSettings({ scenario, setScenario, id }) {
  const [name, setName] = useState(scenario?.name || "");
  const [description, setDescription] = useState(scenario?.description || "");
  const [numPlayers, setNumPlayers] = useState(scenario?.limit_players || 1);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(scenario?.photo_url || null);
  const fileInputRef = useRef(null);
  const router = useRouter();

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
    <div className="scenarioSettingsWrapper">
      <div className="scenarioPhotoContainer">
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Scenario Preview"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority
          />
        )}

        <div
          className="scenarioPhotoUpload"
          onClick={() => fileInputRef.current.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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

      <div className="settingsSection">
        <input
          type="text"
          placeholder="Scenario Name"
          className="settingsInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="255"
        />

        <input
          type="number"
          placeholder="Number of Players"
          className="settingsInput"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
        />

        <textarea
          placeholder="Scenario Description"
          className="settingsInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength="4096"
        />

        <button onClick={handleSubmit} className="actionButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
            width="20"
            height="20"
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

        <div className="bottomActions">
          <button className="actionButton" onClick={onSaveAndExit}>
            Zapisz i Wyjdź
          </button>
          <button className="actionButton" onClick={onHelp}>
            Pomoc
          </button>
        </div>
      </div>
    </div>
  );
}
