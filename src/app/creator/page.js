"use client";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import "./creator.css";
import StoriesContainer from "@/components/clientSideComponents/creator/storiesContainer";
import { useState } from "react";
export default function Creator() {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="creatorContainer">
        <SearchField search={search} onSearch={setSearch} />
        <StoriesContainer search={search} />
      </div>
    </>
  );
}
