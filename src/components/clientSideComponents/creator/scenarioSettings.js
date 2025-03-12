"use client";
import { useEffect, useState } from "react";
import "./styleModules/searchFieldModule.css";
//Component which is used to create query parameters based on user's input.
export default function ScenarioSettings({ scenario, setScenario }) {
  const [name, setName] = useState(scenario ? scenario.name : "");
  const [numPlayers, setNumPlayers] = useState(
    scenario ? scenario.limit_players : 1
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    setScenario((s) => ({
      ...s,
      name: { name },
      limit_players: { numPlayers },
    }));
  };
  return (
    <div className="searchFieldWrapper">
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa scenariusza"
          className="searchInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit" className="searchButton">
          OK
        </button>
      </form>
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="number"
          className="searchInput"
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
        />
        <button type="submit" className="searchButton">
          OK
        </button>
      </form>
      {/* To implement: filters which will be used in query parameters */}
    </div>
  );
}
