import React, { useState, useRef, useEffect } from "react";
import NodeMapView from "./nodeMapView";
import "./styleModules/nodeEditorModule.css";

export default function NodeEditor({
  node,
  onSave,
  onClose,
  onDelete,
  canDelete,
  scenarioId,
}) {
  const [nodeData, setNodeData] = useState({
    label: node.data.label || "",
    text: node.data.text || "",
    longitude: node.data.longitude || 0,
    latitude: node.data.latitude || 0,
    photo: null,
    photoPreview: node.data.photo_url || null,
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (name, value) => {
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNodeData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setNodeData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(node.id, nodeData, scenarioId);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <h3>Edytuj Krok Opowieści</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="label">Tytuł:</label>

            <div className="edgearea-container">
              <input
                style={{ width: "100%" }}
                type="text"
                id="label"
                name="label"
                value={nodeData.label}
                onChange={handleChange}
                required
                maxLength="255"
              />
              <div className="character-counter">
                {nodeData.label.length}/255
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="text">Opis:</label>
            <div className="textarea-container">
              <textarea
                maxLength="1024"
                id="text"
                name="text"
                value={nodeData.text}
                onChange={handleChange}
                rows={4}
              />
              <div className="character-counter">
                {nodeData.text.length}/1024
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Zdjęcie:</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {nodeData.photoPreview && (
              <div className="image-preview-container">
                <img
                  src={nodeData.photoPreview}
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

          <div className="location-section">
            <h4>Lokalizacja</h4>

            <div style={{ height: "300px", marginBottom: "15px" }}>
              <NodeMapView
                node={{ data: nodeData }}
                onCoordinateChange={handleCoordinateChange}
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="mr-2"
              style={{
                margin: "8px",
                padding: "10px 20px",
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.85) 100%)",
                color: "white",
                border: "2px solid rgba(34, 197, 94, 0.4)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 3px 8px rgba(34, 197, 94, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(16, 185, 129, 0.95) 100%)";
                e.target.style.borderColor = "rgba(34, 197, 94, 0.6)";
                e.target.style.boxShadow = "0 5px 15px rgba(34, 197, 94, 0.4)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.85) 100%)";
                e.target.style.borderColor = "rgba(34, 197, 94, 0.4)";
                e.target.style.boxShadow = "0 3px 8px rgba(34, 197, 94, 0.3)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                margin: "8px",
                padding: "10px 20px",
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)",
                color: "#dc2626",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 2px 6px rgba(239, 68, 68, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.2) 100%)";
                e.target.style.borderColor = "#dc2626";
                e.target.style.color = "#b91c1c";
                e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)";
                e.target.style.borderColor = "rgba(239, 68, 68, 0.3)";
                e.target.style.color = "#dc2626";
                e.target.style.boxShadow = "0 2px 6px rgba(239, 68, 68, 0.2)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Anuluj
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="delete-button"
              >
                Usuń Krok
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
