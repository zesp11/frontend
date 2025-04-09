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
        <h3>Edit Node</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="label">Label:</label>
            <input
              type="text"
              id="label"
              name="label"
              value={nodeData.label}
              onChange={handleChange}
              required
              maxLength="255"
            />
          </div>
          <div className="form-group">
            <label htmlFor="text">Description:</label>
            <textarea
              maxLength="1024"
              id="text"
              name="text"
              value={nodeData.text}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Image:</label>
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
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="location-section">
            <h4>Location</h4>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="longitude">Longitude:</label>
                <input
                  type="number"
                  step="0.000001"
                  id="longitude"
                  name="longitude"
                  value={nodeData.longitude}
                  onChange={handleChange}
                  placeholder="-180 to 180"
                />
              </div>
              <div className="form-group half">
                <label htmlFor="latitude">Latitude:</label>
                <input
                  type="number"
                  step="0.000001"
                  id="latitude"
                  name="latitude"
                  value={nodeData.latitude}
                  onChange={handleChange}
                  placeholder="-90 to 90"
                />
              </div>
            </div>

            <div style={{ height: "300px", marginBottom: "15px" }}>
              <NodeMapView
                node={{ data: nodeData }}
                onCoordinateChange={handleCoordinateChange}
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="delete-button"
              >
                Delete Node
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
