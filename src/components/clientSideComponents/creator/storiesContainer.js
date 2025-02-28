"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryTile from "@/components/creatorComponents/storyTile";
import "./styleModules/storiesContainerModule.css";

export default function StoriesContainer() {
  const [story, setStory] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function FetchItems() {
      setStory([]);
      const res = await fetch(`/api/proxy/scenarios?page=${page}&limit=5`, {
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
  }, [page]);
  const onPageDown = () => {
    if (page == 1) return;
    setPage((e) => e - 1);
  };
  const onPageUp = () => {
    setPage((e) => e + 1);
  };
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
      <div className="pageWrapper">
        <button className="pageButton" onClick={onPageDown}>
          Poprzednia strona
        </button>
        <button className="pageButton" onClick={onPageUp}>
          Następna strona
        </button>
      </div>
    </div>
  );
}
