"use client";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import StoriesContainer from "@/components/clientSideComponents/creator/storiesContainer";
import LoadingAnimation from "@/components/clientSideComponents/creator/loadingAnimation";
import { useState, useEffect } from "react";
import "./creator.css";

export default function Creator() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading
    setIsLoading(true);

    // Set loading to false once the component has mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="creator-page">
      {isLoading && <LoadingAnimation visible={isLoading} />}
      <div className="creator-content">
        <div className="search-section">
          <SearchField setSearch={setSearch} />
        </div>
        <StoriesContainer search={search} />
      </div>
    </div>
  );
}
