import { useState, useRef, useEffect } from "react";
import flowComponentModule from "./styleModules/flowComponentModule.css";

export default function EdgeEditor({ edge, onSave, onClose, limitPlayers }) {
  const [edgeData, setEdgeData] = useState({
    label: edge.label || "Continue",
    animated: edge.animated || false,
    id_players: edge.id_players || [],
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
      if (name.startsWith("player_")) {
        const playerIndex = parseInt(name.split("_")[1], 10);

        setEdgeData((prev) => {
          const updatedPlayers = checked
            ? [...prev.id_players, playerIndex]
            : prev.id_players.filter((id) => id !== playerIndex);

          return {
            ...prev,
            id_players: updatedPlayers,
          };
        });
      } else {
        setEdgeData((prev) => ({ ...prev, [name]: checked }));
      }
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
  const renderPlayerCheckboxes = () => {
    const handlePlayerToggle = (playerIndex) => {
      setEdgeData((prev) => {
        const isAlreadySelected = prev.id_players.includes(playerIndex);
        return {
          ...prev,
          id_players: isAlreadySelected
            ? prev.id_players.filter((id) => id !== playerIndex)
            : [...prev.id_players, playerIndex],
        };
      });
    };

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: limitPlayers }, (_, i) => {
          const playerIndex = i + 1;
          const isChecked = edgeData.id_players.includes(playerIndex);

          return (
            <label
              key={`player-${playerIndex}`}
              htmlFor={`player_${playerIndex}`}
              className={`
                group relative flex flex-col items-center justify-center rounded-xl p-4
                border-2 transition-all cursor-pointer select-none
                ${
                  isChecked
                    ? "bg-orange-500 border-orange-500 text-white shadow-md"
                    : "bg-zinc-800 border-zinc-700 text-orange-400 hover:bg-zinc-700"
                }
              `}
              onClick={() => handlePlayerToggle(playerIndex)}
            >
              <input
                type="checkbox"
                id={`player_${playerIndex}`}
                name={`player_${playerIndex}`}
                checked={isChecked}
                readOnly
                className="absolute opacity-0 w-0 h-0"
              />
              {isChecked ? (
                <span className="text-sm font-semibold text-black">
                  Gracz {playerIndex}
                </span>
              ) : (
                <span className="text-sm font-semibold">
                  Gracz {playerIndex}
                </span>
              )}
              {isChecked && (
                <span className="absolute top-3 right-2 text-white text-lg">
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <h3>Edytuj Wybór</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="text">Tekst wyboru:</label>
            <div className="edgearea-container">
              <input
                style={{ width: "100%" }}
                type="text"
                id="label"
                name="label"
                value={edgeData.label}
                onChange={handleChange}
                required
                maxLength="255"
              />
              <div className="character-counter">
                {edgeData.label.length}/255
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Wybrani gracze:</label>
            <div className="mt-2">{renderPlayerCheckboxes()}</div>
          </div>

          <div className="button-group mt-4">
            <button type="submit" className="mr-2">
              Zapisz
            </button>
            <button type="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
