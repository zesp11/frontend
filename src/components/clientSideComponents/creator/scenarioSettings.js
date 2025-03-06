"use client";
import { useState } from "react";
import "./styleModules/searchFieldModule.css";
//Component which is used to create query parameters based on user's input.
export default function ScenarioSettings() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", query);
  };

  return (
    <div className="searchFieldWrapper">
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa scenariusza"
          className="searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="searchButton">
          OK
        </button>
      </form>
      {/* To implement: filters which will be used in query parameters */}
    </div>
  );
}
