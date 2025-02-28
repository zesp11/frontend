"use client";
import React, { useCallback } from "react";
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
const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

export default function FlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to handle node click
  const onNodeClick = useCallback((event, node) => {
    alert(`Clicked on node: ${node.id}`);
  }, []);

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ddd" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
