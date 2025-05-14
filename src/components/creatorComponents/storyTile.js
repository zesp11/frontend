import { useRouter } from "next/navigation";
import Image from "next/image";
import "./styleModules/storyTileModule.css";

export default function StoryTile({ story }) {
  const router = useRouter();

  // Ensure story is an object
  const safeStory = story || {};

  const handleClick = () => {
    router.push(`/creator/new?id=${safeStory.id || ""}`);
  };

  return (
    <div className="story-tile" onClick={handleClick}>
      <div className="story-image-container">
        {safeStory.photo_url ? (
          <Image
            src={safeStory.photo_url}
            alt={safeStory.name || "Story image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="story-image"
            priority={false}
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
              {new Date(safeStory.creation_date).toLocaleDateString()}
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
