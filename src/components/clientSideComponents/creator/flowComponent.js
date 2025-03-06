"use client";
import React, { useCallback, useEffect } from "react";
import "./styleModules/flowComponentModule.css";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./styleModules/flowComponentModule.css";
import { initialEdges, initialNodes } from "./initialData";
export default function FlowComponent({ id }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    async function fetchItem() {
      if (!id && nodes.length === 0 && edges.length === 0) {
        setEdges(initialEdges);
        setNodes(initialNodes);
        return;
      }

      // Pobierz token Bearer z localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // Sprawdź ID i token w konsoli

      const url = `/api/proxy/scenarios/${id}`;

      // Wykonaj zapytanie
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
      console.log(data);
    }

    // Wywołanie funkcji FetchItem
    fetchItem();
    fetchNodes();
  }, []);
  const fetchNodes = () => {};
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to handle node click
  const onNodeClick = useCallback((event, node) => {
    alert(`Clicked on node: ${node.id}`);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: "8vw",
        width: "100vw",
        height: "100vh",
        border: "1px solid #ddd",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
