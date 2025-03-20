"use client";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import ScenarioSettings from "@/components/clientSideComponents/creator/scenarioSettings";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function New() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState(null);
  const [id, setId] = useState(searchParams.get("id"));

  useEffect(() => {
    async function fetchData() {
      // Get Bearer token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        // If no ID is provided, create a new scenario
        if (!id) {
          const createRes = await fetch(
            `https://squid-app-p63zw.ondigitalocean.app/api/scenarios`,
            {
              method: "POST",
              body: JSON.stringify({
                name: "Nowy scenariusz",
                limit_players: 1,
                description: "Tu wpisz opis swojego nowego scenariusza...",
                step_title: "Początek przygody",
                step_text: "Za górami, za lasami...",
              }),
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!createRes.ok) {
            console.error("Failed to create scenario", await createRes.text());
            setLoading(false);
            return;
          }

          const createResponse = await createRes.json();
          const newId = createResponse.id_scen;
          setId(newId);

          // Fetch the newly created scenario
          const fetchRes = await fetch(
            `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${newId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!fetchRes.ok) {
            console.error(
              "Failed to fetch new scenario",
              await fetchRes.text()
            );
            setLoading(false);
            return;
          }

          const scenarioData = await fetchRes.json();
          setScenario(scenarioData);
          setLoading(false);
        }
        // If ID is provided, fetch the existing scenario
        else {
          const fetchRes = await fetch(
            `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!fetchRes.ok) {
            console.error("Failed to fetch scenario", await fetchRes.text());
            setLoading(false);
            return;
          }

          const scenarioData = await fetchRes.json();
          setScenario(scenarioData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in scenario handling:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [id]); // Only re-run if ID changes

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
        id={id}
      />
    </>
  );
}
