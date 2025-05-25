"use client";
import "./new.css";
import { Suspense, useState, useEffect } from "react";
import FlowComponent from "@/components/clientSideComponents/creator/flowComponent";
import ScenarioSettings from "@/components/clientSideComponents/creator/scenarioSettings";
import LoadingAnimation from "@/components/clientSideComponents/creator/loadingAnimation";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import HelpComponent from "@/components/clientSideComponents/creator/helpComponent";
import FlowContext from "@/components/clientSideComponents/creator/functionalComponents/flowContext";
import { useEdgesState } from "@xyflow/react";
const url = process.env.NEXT_PUBLIC_API_URL;
// Create a child component that uses useSearchParams
function ScenarioLoader() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scenario, setScenario] = useState(null);
  const [id, setId] = useState(searchParams.get("id"));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visibleHelp, setVisibleHelp] = useState(false);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const requestInProgress = useRef(false);
  const isInitialMount = useRef(true);
  // Effect to handle screen size changes
  useEffect(() => {
    // Initialize settings panel state based on screen size
    const handleResize = () => {
      setSettingsOpen(window.innerWidth > 768);
    };

    // Set initial state
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Show initial loading animation
    const initialTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 300);

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

    return () => clearTimeout(initialTimer);
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

          const createRes = await fetch(`${url}/api/scenarios`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
              // Do NOT set Content-Type header when using FormData
              // The browser will set the correct multipart/form-data boundary
            },
          });

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
      const fetchRes = await fetch(`${url}/api/scenarios/${scenarioId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const toggleSettings = () => {
    setSettingsOpen((prevState) => !prevState);
  };

  if (initialLoading || loading) {
    return <LoadingAnimation visible={loading} />;
  }

  if (!scenario) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>Nie można załadować scenariusza</h2>
          <p>Spróbuj odświeżyć stronę lub wróć do listy scenariuszy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appWrapper">
      {/* Mobile settings toggle button */}
      {window.innerWidth <= 768 && (
        <button
          className={`settingsToggle ${settingsOpen ? "active" : ""}`}
          onClick={toggleSettings}
          aria-label="Toggle settings panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      )}

      {/* Background overlay that appears when settings panel is open on mobile */}
      {window.innerWidth <= 768 && (
        <div
          className={`settings-overlay ${settingsOpen ? "visible" : ""}`}
          onClick={() => setSettingsOpen(false)}
        />
      )}
      <FlowContext.Provider value={{ edges, setEdges, onEdgesChange }}>
        <div className="scenarioSettings">
          <ScenarioSettings
            scenario={scenario}
            setScenario={setScenario}
            id={id}
            isOpen={settingsOpen}
            setIsOpen={setSettingsOpen}
            onVisibleHelp={setVisibleHelp}
          />
        </div>
        <div className="flowContainer">
          <FlowComponent
            scenario={scenario}
            id_scen={id}
            isOpen={settingsOpen}
          />
        </div>
      </FlowContext.Provider>
      {visibleHelp && <HelpComponent onVisibleHelp={setVisibleHelp} />}
    </div>
  );
}

// Main component with Suspense boundary
export default function New() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <ScenarioLoader />
    </Suspense>
  );
}
