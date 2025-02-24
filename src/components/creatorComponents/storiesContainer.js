import Link from "next/link";
import "./storiesContainerModule.css";
import StoryTile from "./storyTile";
import { data } from "./temporaryData"; //temporary data which will be replaced with api call
export default function StoriesContainer() {
  return (
    <div className="storiesContainerWrapper">
      <div className="upperPanel">
        <h2>Znaleziono {data.length} wyników</h2>
        <Link href="/creator/new" className="newStoryButton">
          Dodaj Nową Opowieść
        </Link>
      </div>
      <div className="storyWrapper">
        {data.map((e) => (
          <StoryTile key={e.id} story={e} />
        ))}
      </div>
    </div>
  );
}
