"use client";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import ScenarioSettings from "@/components/clientSideComponents/creator/scenarioSettings";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function New() {
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
        console.log("Creating new scenario");

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
          console.log("Successfully created scenario:", createResponse);
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
      console.log(`Fetching scenario with ID: ${scenarioId}`);
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
      console.log("Successfully fetched scenario:", scenarioData);
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
    <>
      <ScenarioSettings scenario={scenario} setScenario={setScenario} id={id} />
      <FlowComponent
        loading={loading}
        setLoading={setLoading}
        scenario={scenario}
        id_scen={id}
      />
    </>
  );
}
