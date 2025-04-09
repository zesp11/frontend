import { useState, useRef, useEffect } from "react";
import flowComponentModule from "./styleModules/flowComponentModule.css";

export default function EdgeEditor({ edge, onSave, onClose }) {
  const [edgeData, setEdgeData] = useState({
    label: edge.label || "Continue",
    animated: edge.animated || false,
    style: {
      stroke: edge.style?.stroke || "#333",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "stroke") {
      setEdgeData((prev) => ({
        ...prev,
        style: {
          ...prev.style,
          stroke: value,
        },
      }));
    } else if (type === "checkbox") {
      setEdgeData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEdgeData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(edge.id, edgeData);
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
        <h3>Edit Edge</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="label">Label:</label>
            <input
              type="text"
              id="label"
              name="label"
              value={edgeData.label}
              onChange={handleChange}
              required
              maxLength="255"
            />
          </div>
          <div className="form-group">
            <label htmlFor="stroke">Edge Color:</label>
            <input
              type="color"
              id="stroke"
              name="stroke"
              value={edgeData.style.stroke}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
