"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryTile from "@/components/creatorComponents/storyTile";
import "./styleModules/storiesContainerModule.css";

export default function StoriesContainer({ search }) {
  const [story, setStory] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      setStory([]);

      // Get token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        // Build params if needed
        const params =
          `page=${page}&limit=50` +
          (search && search.length !== 0 ? `&search=${search}` : "");

        // Make the request to the user endpoint
        const res = await fetch(
          `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/user?${params}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch data", res.status);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log("API response:", data);

        // Check if data is directly an array or has a data property
        if (Array.isArray(data)) {
          setStory(data);
        } else if (data && Array.isArray(data.data)) {
          setStory(data.data);
        } else {
          console.error("Unexpected data format:", data);
          setStory([]);
        }
      } catch (error) {
        console.error("Error fetching user stories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [page, search]);

  const onPageDown = () => {
    if (page === 1) return;
    setPage((e) => e - 1);
  };

  const onPageUp = () => {
    setPage((e) => e + 1);
  };

  return (
    <div className="storiesContainerWrapper">
      <div className="upperPanel">
        <h2>Znaleziono {Array.isArray(story) ? story.length : 0} wyników</h2>
        <Link href="/creator/new" className="newStoryButton">
          Dodaj Nową Opowieść
        </Link>
      </div>

      {isLoading ? (
        <div className="loading">Ładowanie...</div>
      ) : (
        <>
          <div className="storyWrapper">
            {Array.isArray(story) && story.length > 0 ? (
              story.map((e) => <StoryTile key={e.id} story={e} />)
            ) : (
              <div className="no-results">Brak wyników</div>
            )}
          </div>

          <div className="pageWrapper">
            <button
              className="pageButton"
              onClick={onPageDown}
              disabled={page === 1}
            >
              Poprzednia strona
            </button>
            <span className="page-indicator">Strona {page}</span>
            <button className="pageButton" onClick={onPageUp}>
              Następna strona
            </button>
          </div>
        </>
      )}
    </div>
  );
}
