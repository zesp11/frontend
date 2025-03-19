"use client";
import { useEffect, useState } from "react";
import "./styleModules/searchFieldModule.css";
//Component which is used to create query parameters based on user's input.
export default function ScenarioSettings({ scenario, setScenario, id }) {
  const [name, setName] = useState(scenario ? scenario.name : "");
  const [description, setDescription] = useState(
    scenario ? scenario.description : ""
  );
  const [numPlayers, setNumPlayers] = useState(
    scenario ? scenario.limit_players : 1
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      console.log(
        JSON.stringify({
          name: name,
          limitPlayers: Number(numPlayers),
          description: description,
          id_photo: 44,
        })
      );
      const res = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: name,
            limitPlayers: numPlayers,
            description: description,
            id_photo: 44,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setScenario((s) => ({
          ...s,
          name: { name },
          limit_players: { numPlayers },
          description: { description },
        }));
      }
    } catch (error) {
      console.log(error);
    }
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
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="searchInput"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="searchButton">
          OK
        </button>
      </form>
    </div>
  );
}
