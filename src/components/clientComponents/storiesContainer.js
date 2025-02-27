"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryTile from "@/components/creatorComponents/storyTile";
export default function StoriesContainer() {
  const [story, setStory] = useState([]);
  useEffect(() => {
    async function FetchItems() {
      setStory([]);
      const res = await fetch(`/api/proxy/scenarios?page=1&limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch data", res.status);
        return;
      }

      const data = await res.json();
      console.log(data);
      setStory(data.data);
    }

    FetchItems();
  }, []);

  return (
    <div className="storiesContainerWrapper">
      <div className="upperPanel">
        <h2>Znaleziono {story.length} wyników</h2>
        <Link href="/creator/new" className="newStoryButton">
          Dodaj Nową Opowieść
        </Link>
      </div>
      <div className="storyWrapper">
        {story.map((e) => (
          <StoryTile key={e.id} story={e} />
        ))}
      </div>
    </div>
  );
}
