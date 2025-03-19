import React, { useState, useRef, useEffect } from "react";
import NodeMapView from "./nodeMapView";

export default function NodeEditor({
  node,
  onSave,
  onClose,
  onDelete,
  canDelete,
}) {
  const [nodeData, setNodeData] = useState({
    label: node.data.label || "",
    text: node.data.text || "",
    longitude: node.data.longitude || "",
    latitude: node.data.latitude || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (name, value) => {
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(node.id, nodeData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  // Handle clicks outside the popup to close it
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="text">Description:</label>
            <textarea
              id="text"
              name="text"
              value={nodeData.text}
              onChange={handleChange}
              rows={4}
            />
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

            {/* Map component with fixed height */}
            <div style={{ height: "300px", marginBottom: "15px" }}>
              <NodeMapView
                node={{ data: nodeData }}
                onCoordinateChange={handleCoordinateChange}
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
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
