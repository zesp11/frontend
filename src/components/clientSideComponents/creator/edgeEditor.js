import { useState, useRef, useEffect } from "react";
import { Loader2, X, Save, Users } from "lucide-react";

export default function EdgeEditor({
  edge,
  onSave,
  onClose,
  limitPlayers,
  edges,
  scenario,
}) {
  const [edgeData, setEdgeData] = useState({
    label: edge.label || "Kontynuuj",
    animated: edge.animated || false,
    id_players: edge.id_players || [],
    style: {
      stroke: edge.style?.stroke || "#333",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const popupRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError(null);

    try {
      if (typeof onSave === "function") {
        await onSave(edge.id, edgeData);
        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));
        onClose();
      } else {
        throw new Error("onSave function is not available");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveError(error.message || "Wystąpił błąd podczas zapisywania");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !isLoading
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isLoading]);

  const handlePlayerToggle = (playerIndex) => {
    if (isLoading) return;

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

  const renderPlayerCheckboxes = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: limitPlayers }, (_, i) => {
          const playerIndex = i + 1;
          const isChecked = edgeData.id_players.includes(playerIndex);
          const players_to_render = [
            ...new Set(
              edges
                .filter((e) => e.target === edge.source)
                .flatMap((e) => e.id_players)
            ),
          ];

          if (
            !players_to_render.includes(playerIndex) &&
            !(edge.source == scenario.first_step.id_step)
          ) {
            return null;
          }

          return (
            <button
              key={`player-${playerIndex}`}
              type="button"
              onClick={() => handlePlayerToggle(playerIndex)}
              disabled={isLoading}
              className={`
                group relative flex flex-col items-center justify-center rounded-xl p-4
                border-2 transition-all duration-200 cursor-pointer select-none transform hover:scale-105
                ${isLoading ? "opacity-50 cursor-not-allowed scale-100" : ""}
                ${
                  isChecked
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-zinc-800 border-zinc-700 text-orange-400 hover:bg-zinc-700 hover:border-orange-500/50"
                }
              `}
            >
              <Users size={18} className="mb-1" />
              <span className="text-sm font-semibold">Gracz {playerIndex}</span>
              {isChecked && (
                <div className="absolute -top-1 -right-1 bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        ref={popupRef}
        onSubmit={handleSubmit}
        className="relative bg-zinc-900 border border-orange-500/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-orange-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Edytuj Wybór
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {saveError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{saveError}</p>
            </div>
          )}

          {/* Choice Text Field */}
          <div className="space-y-2">
            <label className="block text-orange-400 font-medium">
              Tekst wyboru
            </label>
            <div className="relative">
              <input
                type="text"
                name="label"
                value={edgeData.label}
                onChange={handleChange}
                required
                maxLength="255"
                disabled={isLoading}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Wprowadź tekst wyboru..."
              />
              <div className="absolute bottom-2 right-3 text-xs text-orange-400/60">
                {edgeData.label.length}/255
              </div>
            </div>
          </div>

          {/* Player Selection */}
          {scenario.limit_players > 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-orange-400 font-medium">
                <Users size={20} />
                <span>Wybrani gracze</span>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                {renderPlayerCheckboxes()}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-700/50">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-500/50 disabled:to-emerald-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex-1"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span>{isLoading ? "Zapisywanie..." : "Zapisz"}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-700/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex-1"
            >
              <X size={18} />
              <span>Anuluj</span>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="bg-zinc-800 p-6 rounded-xl border border-orange-500/20 flex items-center space-x-3 shadow-2xl">
              <Loader2 size={24} className="animate-spin text-orange-400" />
              <span className="text-white font-medium">
                Zapisywanie zmian...
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
