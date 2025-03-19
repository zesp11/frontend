"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryTile from "@/components/creatorComponents/storyTile";
import "./styleModules/storiesContainerModule.css";

export default function StoriesContainer({ search }) {
  const [story, setStory] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function FetchItems() {
      setStory([]);
      const params =
        (search.length !== 0 ? `search=${search}&` : "") +
        `page=${page}&limit=50`;
      const res = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/scenarios?${params}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch data", res.status);
        return;
      }

      const data = await res.json();
      setStory(data.data);
    }

    FetchItems();
  }, [page, search]);
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
