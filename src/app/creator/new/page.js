"use client";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import ScenarioSettings from "@/components/clientSideComponents/creator/scenarioSettings";
import SearchField from "@/components/clientSideComponents/creator/searchField";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function New() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [newId, setNewId] = useState(null);
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      if (!id) {
        return;
      }
      //   try {
      //     const res = await fetch(
      //       `https://squid-app-p63zw.ondigitalocean.app/api/scenarios`,
      //       {
      //         method: "POST",
      //         body: JSON.stringify({
      //           name: "Nowy scenariusz",
      //           limit_players: 4,
      //           description: "Wpisz opis swojej przygody...",
      //         }),
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );

      //     if (!res.ok) {
      //       return;
      //     }
      //     const response = await res.json();
      //     setNewId(response.id_scen);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }

      // Get Bearer token from localStorage

      const url = `https://squid-app-p63zw.ondigitalocean.app/api/scenarios/${id}`;
      setLoading(true);

      try {
        // Execute request
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch data", res.status, errorText);
          return;
        }

        const data = await res.json();
        setScenario(data);
      } catch (error) {
        console.error(`Error fetching scenario:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // Call the function inside useEffect
  }, []); // Add id as a dependency

  return (
    <>
      {(id && scenario) || !id ? (
        <>
          <ScenarioSettings scenario={scenario} setScenario={setScenario} />
          <FlowComponent
            loading={loading}
            setLoading={setLoading}
            scenario={scenario}
            id={id}
          />
        </>
      ) : (
        <div>Wczytywanie scenariusza</div>
      )}
    </>
  );
}
