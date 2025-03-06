"use client";
import { useState } from "react";
import "./styleModules/searchFieldModule.css";

//Component which is used to create query parameters based on user's input.
export default function SearchField({ search, onSearch }) {
  return (
    <div className="searchFieldWrapper">
      <form className="searchForm">
        <input
          type="text"
          placeholder="Szukaj..."
          className="searchInput"
          value={search}
          onChange={(e) => {
            onSearch(e.target.value);
          }}
        />
        <button type="submit" className="searchButton">
          🔍
        </button>
      </form>
      {/* To implement: filters which will be used in query parameters */}
    </div>
  );
}
