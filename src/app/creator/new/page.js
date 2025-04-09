"use client";
import "./new.css";
import { Suspense } from "react";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import ScenarioSettings from "@/components/clientSideComponents/creator/scenarioSettings";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Create a child component that uses useSearchParams
function ScenarioLoader() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState(null);
  const [id, setId] = useState(searchParams.get("id"));
  const requestInProgress = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the effect on initial mount when id is null
    // We'll handle that case separately to avoid multiple creations
    if (isInitialMount.current && !id) {
      isInitialMount.current = false;
      handleScenario();
      return;
    }

    // Skip if there's an ongoing request
    if (!requestInProgress.current && id) {
      handleScenario();
    }
  }, [id]); // Only re-run if ID changes

  async function handleScenario() {
    // Prevent concurrent requests
    if (requestInProgress.current) return;
    requestInProgress.current = true;

    // Get Bearer token from localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      requestInProgress.current = false;
      return;
    }

    try {
      // If no ID is provided, create a new scenario
      if (!id) {
        try {
          // Create FormData for scenario creation
          const formData = new FormData();
          formData.append("name", "Nowy scenariusz");
          formData.append("limit_players", "1");
          formData.append(
            "description",
            "Tu wpisz opis swojego nowego scenariusza..."
          );
          // Optional: Add a default photo if you have one
          // formData.append('photo', photoFile);

          const createRes = await fetch(
            `https://squid-app-p63zw.ondigitalocean.app/api/scenarios`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
                // Do NOT set Content-Type header when using FormData
                // The browser will set the correct multipart/form-data boundary
              },
            }
          );

          if (!createRes.ok) {
            const errorText = await createRes.text();
            console.error("Failed to create scenario", errorText);
            setLoading(false);
            requestInProgress.current = false;
            return;
          }

          const createResponse = await createRes.json();
          const newId = createResponse.id_scen;

          // Update the ID state without triggering a re-render immediately
          setId(newId);

          // Fetch the newly created scenario
          await fetchScenario(newId, token);
        } catch (error) {
          console.error("Error creating scenario:", error);
          setLoading(false);
          requestInProgress.current = false;
        }
      } else {
        // If ID is provided, fetch the existing scenario
        await fetchScenario(id, token);
      }
    } catch (error) {
      console.error("Error in scenario handling:", error);
      setLoading(false);
      requestInProgress.current = false;
    }
  }

  async function fetchScenario(scenarioId, token) {
    try {
      const fetchRes = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${scenarioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!fetchRes.ok) {
        const errorText = await fetchRes.text();
        console.error(`Failed to fetch scenario ${scenarioId}`, errorText);
        setLoading(false);
        requestInProgress.current = false;
        return;
      }

      const scenarioData = await fetchRes.json();
      setScenario(scenarioData);
      setLoading(false);
      requestInProgress.current = false;
    } catch (error) {
      console.error(`Error fetching scenario ${scenarioId}:`, error);
      setLoading(false);
      requestInProgress.current = false;
    }
  }

  if (loading) {
    return <div>Wczytywanie scenariusza...</div>;
  }

  if (!scenario) {
    return <div>Nie można załadować scenariusza</div>;
  }

  return (
    <div className="appWrapper">
      <div className="scenarioSettings">
        <ScenarioSettings
          scenario={scenario}
          setScenario={setScenario}
          id={id}
        />
      </div>
      <div className="flowContainer">
        <FlowComponent
          loading={loading}
          setLoading={setLoading}
          scenario={scenario}
          id_scen={id}
        />
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function New() {
  return (
    <Suspense fallback={<div>Wczytywanie...</div>}>
      <ScenarioLoader />
    </Suspense>
  );
}
