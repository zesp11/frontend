"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryTile from "@/components/creatorComponents/storyTile";
import "./styleModules/storiesContainerModule.css";

export default function StoriesContainer({ search }) {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);

      // Get token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        // Build params
        const params = `page=${page}&limit=12${
          search ? `&search=${search}` : ""
        }`;

        // Make the request to the API endpoint
        const res = await fetch(
          `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/user?${params}`,
          {
            method: "GET",
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

        // Handle the response data
        if (Array.isArray(data)) {
          setStories(data);
          setTotalResults(data.length);
        } else if (data && Array.isArray(data.data)) {
          setStories(data.data);
          setTotalResults(data.data.length);
        } else {
          console.error("Unexpected data format:", data);
          setStories([]);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("Error fetching user stories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [page, search]);

  return (
    <div className="stories-container">
      <div className="stories-header">
        <h2 className="results-count">
          Jesteś autorem <span className="highlight">{totalResults}</span>{" "}
          historii
        </h2>
        <Link href="/creator/new" className="new-story-button">
          <span className="button-icon">+</span>
          <span className="button-text">Dodaj Nową Opowieść</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ładowanie...</p>
        </div>
      ) : (
        <>
          <div className="stories-grid">
            {stories.length > 0 ? (
              stories.map((story) => <StoryTile key={story.id} story={story} />)
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>Brak wyników</p>
              </div>
            )}
          </div>

          {/* <div className="pagination">
            <button
              className={`page-button ${page === 1 ? "disabled" : ""}`}
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              ← Poprzednia
            </button>
            <span className="page-indicator">Strona {page}</span>
            <button className="page-button" onClick={() => setPage(page + 1)}>
              Następna →
            </button>
          </div> */}
        </>
      )}
    </div>
  );
}
