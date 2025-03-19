"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import "./styleModules/flowComponentModule.css";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Panel,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import "./styleModules/flowComponentModule.css";
import { initialEdges, initialNodes } from "./initialData";
import NodeEditor from "./nodeEditor";
import EdgeEditor from "./edgeEditor";
import getLayoutedElements from "./functionalComponents/dagreComponent";
import FillNode from "./functionalComponents/fillNode";
// Define node dimensions for layout calculations
const nodeWidth = 180;
const nodeHeight = 80;

// Function to create a proper tree layout

export default function FlowComponent({ loading, setLoading, scenario, id }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const reactFlowInstance = useRef(null);

  // Initial render
  useEffect(() => {
    async function fetchItem() {
      // If we want to add new scenario
      if (!scenario) {
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(initialNodes, initialEdges, "TB");
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        return;
      }

      setLoading(true);
      // Get Bearer token from localStorage

      try {
        if (scenario.first_step) {
          FillNode(scenario, setNodes, setEdges, nodeWidth, nodeHeight);
        }
      } catch (error) {
        console.error("Error processing scenario:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, []);

  const onConnect = useCallback(
    async (params) => {
      // Prevent self-connections
      if (params.source !== params.target) {
        // Check if an edge already exists between these nodes
        const existingEdge = edges.find(
          (edge) =>
            edge.source === params.source && edge.target === params.target
        );
        const token = localStorage.getItem("accessToken");
        if (!token) {
          return;
        }
        if (existingEdge) {
          // If edge exists, remove it
          try {
            const response = await fetch(
              `https://squid-app-p63zw.ondigitalocean.app/api/choices/${existingEdge.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (error) {
            console.log(error);
          }
          setEdges((eds) => eds.filter((edge) => edge.id !== existingEdge.id));
        } else {
          // If no edge exists, add a new one
          try {
            const responseChoice = await fetch(
              `https://squid-app-p63zw.ondigitalocean.app/api/choices`,
              {
                method: "POST",
                body: JSON.stringify({
                  text: "Continue",
                  id_next_step: Number(params.target),
                  id_step: Number(params.source),
                }),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (!responseChoice.ok) {
              throw new Error("Cannot connect");
            }

            const res = await responseChoice.json();

            setEdges((eds) =>
              addEdge(
                {
                  ...params,
                  id: res.id_choice,
                  animated: false,
                  style: { stroke: "#333" },
                  label: "Continue",
                  markerEnd: {
                    type: "arrowclosed",
                  },
                },
                eds
              )
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    [edges, setEdges]
  );

  // Function to update node data after editing
  const updateNodeData = useCallback(
    async (id, data) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      try {
        const response = await fetch(
          `https://squid-app-p63zw.ondigitalocean.app/api/steps/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title: data.label,
              text: data.text,
              longitude: -0.15,
              latitude: 51.48,
              choices: [],
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to create node");
        }
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: data.label,
                  text: data.text,
                },
              };
            }
            return node;
          })
        );
      } catch (error) {
        console.log(error);
      }
    },
    [setNodes]
  );

  // Function to handle node click - open edit popup instead of alert
  const onNodeClick = useCallback((event, node) => {
    console.log(node);
    setSelectedNode(node);
  }, []);

  const updateEdgeData = useCallback(
    async (edgeId, data) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        // First, make sure we have the most current edges array
        const currentEdge = edges.find((e) => e.id === edgeId);

        if (!currentEdge) {
          console.error(`Edge with ID ${edgeId} not found in the edges array`);
          return;
        }

        // Extract target and source safely
        const targetId = currentEdge.target;
        const sourceId = currentEdge.source;

        if (!targetId || !sourceId) {
          console.error("Edge is missing target or source:", currentEdge);
          return;
        }

        const response = await fetch(
          `https://squid-app-p63zw.ondigitalocean.app/api/choices/${edgeId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              text: data.label,
              id_next_step: Number(targetId),
              id_step: Number(sourceId),
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Check response
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        // Only update state if the API call was successful
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === edgeId) {
              return {
                ...edge,
                label: data.label,
                animated: data.animated,
                style: {
                  ...edge.style,
                  stroke: data.style.stroke,
                },
              };
            }
            return edge;
          })
        );
      } catch (error) {
        console.error("Error updating edge:", error);
      }
    },
    [edges, setEdges]
  );

  const onEdgeClick = useCallback((event, edge) => {
    console.log(edge);
    setSelectedEdge(edge);
  }, []);

  // Close the popup
  const closePopup = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Function to add a new node
  const addNode = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const response = await fetch(
        `https://squid-app-p63zw.ondigitalocean.app/api/steps?id_scen=${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            title: "New Step",
            text: "This is a new step in the scenario.",
            longitude: -0.15,
            latitude: 51.48,
            choices: [],
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create node");
      }

      const r = await response.json();
      const newNodeId = String(r.id_step);
      const centerX = window.innerWidth / 2 - nodeHeight; // half node width
      const centerY = window.innerHeight / 2 - nodeWidth; // half node height

      const newNode = {
        id: newNodeId,
        data: {
          label: "New Node",
          text: "Add description here",
        },
        position: { x: centerX, y: centerY },
        style: {
          background: "#f0f0f0",
          border: "1px solid red",
          padding: 10,
          borderRadius: 5,
          width: nodeWidth,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      // Immediately open the node editor for the new node
      setSelectedNode(newNode);
    } catch (error) {
      console.log(error);
    }
  }, [setNodes, id]);

  // Function to check if a node can be deleted (no connected edges)
  const canDeleteNode = useCallback(
    (nodeId) => {
      // Check if node has any connected edges (either as source or target)
      return !edges.some(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );
    },
    [edges]
  );

  // Function to delete a node
  const deleteNode = useCallback(
    async (nodeId) => {
      // Only delete if the node has no connected edges
      if (canDeleteNode(nodeId)) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        try {
          const response = await fetch(
            `https://squid-app-p63zw.ondigitalocean.app/api/steps/${nodeId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to create node");
          }
          setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        } catch (error) {
          console.log(error);
        }
      } else {
        alert(
          "Cannot delete a node with connected edges. Remove the connections first."
        );
      }
    },
    [setNodes, canDeleteNode]
  );

  // Layout the diagram
  const layoutDiagram = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      "TB",
      nodeWidth,
      nodeHeight
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div
      style={{
        position: "fixed",
        left: "8vw",
        width: "92vw",
        height: "100vh",
        border: "1px solid #ddd",
      }}
    >
      {loading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Loading scenario tree...
        </div>
      ) : (
        <>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onInit={(instance) => (reactFlowInstance.current = instance)}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />

            {/* Add Node button at the bottom-right */}
            <Panel position="bottom-right">
              <button onClick={layoutDiagram} className="layout-button">
                Auto Layout
              </button>
              <button onClick={addNode} className="add-node-button">
                Add Node
              </button>
            </Panel>
          </ReactFlow>

          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onSave={updateNodeData}
              onClose={closePopup}
              onDelete={deleteNode}
              canDelete={canDeleteNode(selectedNode.id)}
            />
          )}
          {selectedEdge && (
            <EdgeEditor
              edge={selectedEdge}
              onSave={updateEdgeData}
              onClose={closePopup}
            />
          )}
        </>
      )}
    </div>
  );
}
