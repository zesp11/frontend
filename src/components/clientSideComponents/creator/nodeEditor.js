import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Upload, Save, Trash2, MapPin, Loader2 } from "lucide-react";
import NodeMapView from "./nodeMapView";

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

  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

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

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError(null);

    try {
      if (typeof onSave === "function") {
        await onSave(node.id, nodeData, scenarioId);
        // Simulate minimum loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 800));
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

  const handleDelete = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten krok?")) {
      setIsLoading(true);
      try {
        if (typeof onDelete === "function") {
          await onDelete(node.id);
          onClose();
        }
      } catch (error) {
        console.error("Delete failed:", error);
        setSaveError(error.message || "Wystąpił błąd podczas usuwania");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

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
              Edytuj Krok Opowieści
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

          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-orange-400 font-medium">Tytuł</label>
            <div className="relative">
              <input
                type="text"
                name="label"
                value={nodeData.label}
                onChange={handleChange}
                required
                maxLength="255"
                disabled={isLoading}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Wprowadź tytuł kroku..."
              />
              <div className="absolute bottom-2 right-3 text-xs text-orange-400/60">
                {nodeData.label.length}/255
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-orange-400 font-medium">Opis</label>
            <div className="relative">
              <textarea
                name="text"
                value={nodeData.text}
                onChange={handleChange}
                maxLength="1024"
                rows={6}
                disabled={isLoading}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Opisz szczegóły tego kroku..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-orange-400/60">
                {nodeData.text.length}/1024
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-orange-400 font-medium">Zdjęcie</label>
            <div className="relative">
              {nodeData.photoPreview ? (
                <div className="group relative rounded-xl overflow-hidden border border-zinc-700">
                  <img
                    src={nodeData.photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={handleImageUploadClick}
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Camera size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  disabled={isLoading}
                  className="w-full h-32 border-2 border-dashed border-zinc-600 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 hover:border-orange-500/50 transition-all duration-200 flex flex-col items-center justify-center text-zinc-400 hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={24} className="mb-2" />
                  <span>Kliknij aby dodać zdjęcie</span>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-orange-400 font-medium">
              <MapPin size={20} />
              <span>Lokalizacja</span>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <div className="h-72">
                <NodeMapView
                  node={{ data: nodeData }}
                  onCoordinateChange={handleCoordinateChange}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Reorganized Layout */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-700/50">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
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

            {/* Delete Action - Separated */}
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
                <span>Usuń Krok</span>
              </button>
            )}
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
