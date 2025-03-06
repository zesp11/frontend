import "./styleModules/storyTileModule.css";
import { useRouter } from "next/navigation";

//Story tile: to stylize
export default function StoryTile({ story }) {
  const router = useRouter();
  const onTileClick = () => {
    router.push(`/creator/new?id=${story.id}`);
  };
  return (
    <div className="story-card" onClick={onTileClick}>
      {/* <Image
        src={story.photo}
        alt={story.name}
        width={200}
        height={250}
        className="story-image"
      /> */}
      <div className="story-info">
        <h3 className="story-title">{story.name}</h3>
        {/* <p className="story-author">Autor: {story.author}</p> */}
        <div className="story-tags">
          {/* {story.tags.map((tag, index) => (
            <span key={index} className="story-tag">
              {tag}
            </span>
          ))} */}
        </div>
      </div>
    </div>
  );
}
