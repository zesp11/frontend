"use client";
import { useState } from "react";
import "./searchFieldModule.css";
export default function SearchField() {
  const [query, setQuery] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Wyszukano: ${query}`);
  };
  return (
    <div className="searchFieldWrapper">
      <form onSubmit={handleSearch} className="searchForm">
        <input
          type="text"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="searchInput"
        />
        <button type="submit" className="searchButton">
          🔍
        </button>
      </form>
    </div>
  );
}
