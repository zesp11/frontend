import { useState, useRef, useEffect } from "react";
import flowComponentModule from "./styleModules/flowComponentModule.css";

export default function NodeEditor({
  node,
  onSave,
  onClose,
  onDelete,
  canDelete,
}) {
  const [nodeData, setNodeData] = useState({
    label: node.data.label,
    text: node.data.text,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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
