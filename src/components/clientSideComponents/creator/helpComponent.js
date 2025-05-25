import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function HelpComponent({ onVisibleHelp }) {
  const [currentImage, setCurrentImage] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const popupRef = useRef(null);

  const totalImages = 7;

  const handleClose = () => {
    onVisibleHelp(false);
  };

  const nextImage = () => {
    setIsImageLoading(true);
    setCurrentImage((prev) => (prev < totalImages ? prev + 1 : 1));
  };

  const prevImage = () => {
    setIsImageLoading(true);
    setCurrentImage((prev) => (prev > 1 ? prev - 1 : totalImages));
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div
        ref={popupRef}
        className="relative bg-black rounded-3xl w-full max-w-3xl aspect-square shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <X size={20} />
        </button>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading State */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Main Image */}
          <img
            key={currentImage}
            src={`/help/${currentImage}.png`}
            alt={`Pomoc - krok ${currentImage}`}
            onLoad={handleImageLoad}
            className={`w-full h-full object-contain transition-all duration-500 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Navigation Arrows - Only show when not loading */}
          {!isImageLoading && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Dot Indicators - Positioned over the image */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {Array.from({ length: totalImages }, (_, i) => {
              const index = i + 1;
              return (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImage === index ? "bg-orange-500 w-8" : "bg-black"
                  }`}
                />
              );
            })}
            <span className="ml-2 text-white text-sm font-medium">
              {currentImage} / {totalImages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
