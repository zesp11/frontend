import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./styleModules/storyTileModule.css";

export default function StoryTile({ story }) {
  const router = useRouter();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
  }, []);

  // Ensure story is an object
  const safeStory = story || {};

  const handleClick = () => {
    router.push(`/creator/new?id=${safeStory.id || ""}`);
  };

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Invalid date format", e);
      return "";
    }
  };

  return (
    <div className="story-tile" onClick={handleClick}>
      <div className="story-image-container">
        {safeStory.photo_url ? (
          <Image
            src={safeStory.photo_url}
            alt={safeStory.name || "Story image"}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="story-image"
            priority={true}
          />
        ) : (
          <div className="placeholder-image">
            <span className="placeholder-icon">📚</span>
          </div>
        )}

        <div className="story-overlay">
          <div className="story-id">#{safeStory.id || "0"}</div>
        </div>
      </div>
      <div className="story-details">
        <h3 className="story-title">{safeStory.name || "Untitled Story"}</h3>
        <div className="story-meta">
          {safeStory.limit_players && (
            <span className="player-limit">
              <span className="meta-icon">👥</span> {safeStory.limit_players}
            </span>
          )}
          {safeStory.creation_date && (
            <span className="creation-date">
              <span className="meta-icon">📅</span>
              {formatDate(safeStory.creation_date)}
            </span>
          )}
        </div>
        {safeStory.description && (
          <p className="story-description">{safeStory.description}</p>
        )}
      </div>
    </div>
  );
}
