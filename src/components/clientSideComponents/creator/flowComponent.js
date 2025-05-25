"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import "./styleModules/flowComponentModule.css";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./styleModules/flowComponentModule.css";
import NodeEditor from "./nodeEditor";
import EdgeEditor from "./edgeEditor";
import getLayoutedElements from "./functionalComponents/dagreComponent";
import FillNode from "./functionalComponents/fillNode";
import LoadingAnimation from "../creator/loadingAnimation"; // Import the LoadingAnimation component
import {
  addChoice,
  deleteChoice,
  editStep,
  deleteStep,
  addStep,
  editChoice,
} from "./functionalComponents/fetchFunctions";

// Define node dimensions for layout calculations
const nodeWidth = 180;
const nodeHeight = 80;

export default function FlowComponent({ scenario, id_scen, isOpen }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [backupNodes, setBackupNodes] = useState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [backupEdges, setBackupEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true); // Add state for initial loading
  const [selectedPlayers, setSelectedPlayers] = useState(
    Array.from({ length: scenario.limit_players }, (_, i) => i + 1)
  );
  const reactFlowInstance = useRef(null);
  useEffect(() => {
    async function fetchItem() {
      // If we want to add new scenario
      if (!scenario) {
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);

      try {
        if (scenario.first_step) {
          await FillNode(
            scenario,
            setNodes,
            setEdges,
            nodeWidth,
            nodeHeight,
            setBackupEdges,
            setBackupNodes
          );
        }
      } catch (error) {
        console.error("Error processing scenario:", error);
      } finally {
        // Make sure the player filter effect runs after nodes are loaded
        setTimeout(() => {
          setInitialLoading(false);

          // Force player filter to run with current selection
          // This ensures nodes appear on initial render
          setSelectedPlayers([...selectedPlayers]);
        }, 300);
      }
    }

    fetchItem();
  }, []);

  // Fix for the layout change issue in the useEffect for selectedPlayers
  useEffect(() => {
    if (!backupEdges || !backupNodes) return;
    const selectedSet = new Set(selectedPlayers);

    // If no players selected, show nothing
    if (selectedSet.size === 0) {
      setEdges([]);
      // Still show first step even when no players selected
      const firstStepNode = backupNodes.find(
        (node) => node.id == scenario.first_step.id_step
      );

      setNodes(firstStepNode ? [firstStepNode] : []);
      return;
    }

    // Filter edges that contain at least one selected player
    const filteredEdges = backupEdges.filter((edge) => {
      if (!Array.isArray(edge.id_players)) return false;
      return edge.id_players.some((id) => selectedSet.has(id));
    });

    // Get node IDs that should be shown (converting everything to strings for consistent comparison)
    const connectedNodeIds = new Set();

    // Add all source and target node IDs from filtered edges
    filteredEdges.forEach((edge) => {
      if (edge.source) connectedNodeIds.add(String(edge.source));
      if (edge.target) connectedNodeIds.add(String(edge.target));
    });

    // Always include first step
    if (scenario.first_step && scenario.first_step.id_step) {
      connectedNodeIds.add(String(scenario.first_step.id_step));
    }

    // We need to identify truly unconnected nodes vs connected nodes
    // A node is "unconnected" if it has no edges connected to it in the entire graph
    const nodesWithEdges = new Set();
    backupEdges.forEach((edge) => {
      nodesWithEdges.add(String(edge.source));
      nodesWithEdges.add(String(edge.target));
    });

    // Filter nodes that are either:
    // 1. Connected to filtered edges for selected players, OR
    // 2. Have no connections at all (truly unconnected nodes)
    const filteredNodes = backupNodes.filter((node) => {
      const nodeId = String(node.id);
      const isConnectedToSelectedPlayers = connectedNodeIds.has(nodeId);
      const isUnconnected = !nodesWithEdges.has(nodeId);

      return isConnectedToSelectedPlayers || isUnconnected;
    });

    // Preserve the positions of the nodes that are staying in the view
    const updatedNodes = filteredNodes.map((node) => {
      // Find the current position of this node if it exists in the current nodes
      const existingNode = nodes.find((n) => n.id === node.id);
      if (existingNode) {
        // Preserve the position
        return {
          ...node,
          position: existingNode.position,
        };
      }
      return node;
    });

    // Update the flow with filtered elements
    setEdges(filteredEdges);
    setNodes(updatedNodes);
  }, [selectedPlayers]);

  const onConnect = useCallback(
    async (params) => {
      if (Number(params.target) === scenario.first_step.id_step) {
        alert("Nie możesz stworzyć ścieżki do pierwszego kroku!");
        return;
      }
      try {
        if (params.source !== params.target) {
          // Prevent self-connections
          // Check if an edge already exists between these nodes
          const existingEdge = edges.find(
            (edge) =>
              (edge.source === params.source &&
                edge.target === params.target) ||
              (edge.source === params.target && edge.target === params.source)
          );

          if (existingEdge) {
            var succeded = await deleteChoice(existingEdge.id, id_scen);
            if (!succeded) return;
            setEdges((eds) =>
              eds.filter((edge) => edge.id !== existingEdge.id)
            );
            setBackupEdges((eds) =>
              eds.filter((edge) => edge.id !== existingEdge.id)
            );
          } else {
            if (edges.filter((e) => e.source === params.source).length >= 4) {
              alert("Każdy krok może mieć maksymalnie cztery wybory!");
              return;
            }
            var id_players;
            if (params.source == scenario.first_step.id_step) {
              id_players = Array.from(
                { length: scenario.limit_players },
                (_, i) => i + 1
              );
            } else {
              id_players = [
                ...new Set(
                  edges
                    .filter((e) => e.target === params.source)
                    .flatMap((e) => e.id_players)
                ),
              ];
            }
            const edgeId = await addChoice(
              params.source,
              params.target,
              id_scen,
              id_players
            );
            if (!edgeId) return;
            setEdges((eds) =>
              addEdge(
                {
                  ...params,
                  id: edgeId,
                  id_players: id_players,
                  animated: false,
                  style: {
                    stroke: "#ff8c42",
                    strokeWidth: 2,
                    opacity: 0.8,
                  },
                  label: "Continue",
                  labelStyle: {
                    fill: "#ffffff",
                    fontWeight: 500,
                    fontSize: 12,
                  },
                  labelBgStyle: {
                    fill: "rgba(26, 26, 26, 0.75)",
                    rx: 4,
                    ry: 4,
                  },
                  labelShowBg: true,
                  markerEnd: {
                    type: "arrowclosed",
                    color: "#ff8c42",
                    width: 20,
                    height: 20,
                  },
                },
                eds
              )
            );
            setBackupEdges((eds) =>
              addEdge(
                {
                  ...params,
                  id: edgeId,
                  id_players: id_players,
                  animated: false,
                  style: {
                    stroke: "#ff8c42",
                    strokeWidth: 2,
                    opacity: 0.8,
                  },
                  label: "Continue",
                  labelStyle: {
                    fill: "#ffffff",
                    fontWeight: 500,
                    fontSize: 12,
                  },
                  labelBgStyle: {
                    fill: "rgba(26, 26, 26, 0.75)",
                    rx: 4,
                    ry: 4,
                  },
                  labelShowBg: true,
                  markerEnd: {
                    type: "arrowclosed",
                    color: "#ff8c42",
                    width: 20,
                    height: 20,
                  },
                },
                eds
              )
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [edges, setEdges, setBackupEdges]
  );

  // Function to update node data after editing
  const updateNodeData = useCallback(
    async (id, data) => {
      try {
        // Call editStep with the full data object including photo
        const photoUrl = await editStep(id, data, id_scen);
        if (!photoUrl) return;
        // Update nodes state
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: data.label,
                  text: data.text,
                  longitude: data.longitude,
                  latitude: data.latitude,
                  // Include photoUrl if present
                  photo_url: photoUrl,
                },
              };
            }
            return node;
          })
        );
        setBackupNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: data.label,
                  text: data.text,
                  longitude: data.longitude,
                  latitude: data.latitude,
                  // Include photoUrl if present
                  photo_url: photoUrl,
                },
              };
            }
            return node;
          })
        );
      } catch (error) {
        console.error("Failed to update node:", error);
        // Optionally add error handling (e.g., show error toast)
      }
    },
    [setNodes, id_scen, setBackupNodes]
  );

  // Function to handle node click - open edit popup instead of alert
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const updateEdgeData = useCallback(
    async (edgeId, data) => {
      // First, make sure we have the most current edges array
      const currentEdge = edges.find((e) => e.id === edgeId);

      if (!currentEdge) {
        console.error(`Edge with ID ${edgeId} not found in the edges array`);
        return;
      }

      // Determine which players were removed
      const originalPlayers = currentEdge.id_players || [];
      const newPlayers = data.id_players || [];
      const removedPlayers = originalPlayers.filter(
        (player) => !newPlayers.includes(player)
      );

      // Helper function to find all descendant edges and remove specified players
      const propagatePlayerRemoval = (
        startNodeId,
        playersToRemove,
        visitedEdges = new Set()
      ) => {
        const edgesToUpdate = [];

        // Find all edges that start from the current node
        const childEdges = edges.filter(
          (edge) => edge.source === startNodeId && !visitedEdges.has(edge.id)
        );

        for (const childEdge of childEdges) {
          // Mark this edge as visited to prevent cycles
          visitedEdges.add(childEdge.id);

          // Check if this edge has any of the players to remove
          const currentPlayers = childEdge.id_players || [];
          const updatedPlayers = currentPlayers.filter(
            (player) => !playersToRemove.includes(player)
          );

          // Only update if there's actually a change
          if (currentPlayers.length !== updatedPlayers.length) {
            edgesToUpdate.push({
              ...childEdge,
              id_players: updatedPlayers,
            });
          }

          // Recursively process descendants
          const descendantUpdates = propagatePlayerRemoval(
            childEdge.target,
            playersToRemove,
            visitedEdges
          );
          edgesToUpdate.push(...descendantUpdates);
        }

        return edgesToUpdate;
      };

      try {
        // Update the current edge via API
        var succed = await editChoice(
          edgeId,
          currentEdge.source,
          currentEdge.target,
          data.label,
          id_scen,
          data.id_players
        );
        if (!succed) return;
        // Get all edges that need to be updated (descendants with removed players)
        const edgesToUpdate =
          removedPlayers.length > 0
            ? propagatePlayerRemoval(currentEdge.target, removedPlayers)
            : [];

        // Update the current edge and all affected descendant edges
        setEdges((eds) =>
          eds.map((edge) => {
            // Update the current edge
            if (edge.id === edgeId) {
              return {
                ...edge,
                label: data.label,
                id_players: data.id_players,
                animated: data.animated,
                style: {
                  ...edge.style,
                  stroke: data.style.stroke,
                },
              };
            }

            // Update descendant edges that had players removed
            const updatedEdge = edgesToUpdate.find((e) => e.id === edge.id);
            if (updatedEdge) {
              return {
                ...edge,
                id_players: updatedEdge.id_players,
              };
            }

            return edge;
          })
        );

        setBackupEdges((eds) =>
          eds.map((edge) => {
            // Update the current edge
            if (edge.id === edgeId) {
              return {
                ...edge,
                label: data.label,
                id_players: data.id_players,
                animated: data.animated,
                style: {
                  ...edge.style,
                  stroke: data.style.stroke,
                },
              };
            }

            // Update descendant edges that had players removed
            const updatedEdge = edgesToUpdate.find((e) => e.id === edge.id);
            if (updatedEdge) {
              return {
                ...edge,
                id_players: updatedEdge.id_players,
              };
            }

            return edge;
          })
        );

        // Optional: Log the propagation for debugging
      } catch (error) {
        console.error("Failed to update edge:", error);
        // Handle error appropriately - maybe revert changes or show user notification
      }
    },
    [edges, setEdges, setBackupEdges, id_scen]
  );

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);

  // Close the popup
  const closePopup = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [scenario]);

  // Function to add a new node
  const addNode = useCallback(async () => {
    const newNodeId = await addStep(id_scen);
    if (!newNodeId) return;
    const { x, y, zoom } = reactFlowInstance.current.getViewport();

    // Calculate the center of the visible area
    const centerX = (window.innerWidth / 2 - x) / zoom;
    const centerY = (window.innerHeight / 2 - y) / zoom;
    const newNode = {
      id: newNodeId,
      data: {
        label: "Nowy krok",
        text: "To jest nowy krok do twojego scenariusza...",
        choices: [],
        longitude: 18.594415,
        latitude: 53.010001,
      },
      position: { x: centerX, y: centerY },
      style: {
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        border: "2px solid #ff8c42",
        borderRadius: "8px",
        padding: "10px 8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        fontWeight: 500,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setBackupNodes((nds) => [...nds, newNode]);
    // Immediately open the node editor for the new node
    setSelectedNode(newNode);
  }, [setNodes, id_scen, setBackupNodes]);

  // Function to check if a node can be deleted (no connected edges)
  const canDeleteNode = useCallback(
    (nodeId) => {
      // Check if node is the first step of the scenario
      if (scenario.first_step.id_step === Number(nodeId)) {
        return false;
      }

      // Check if node has any connected edges (either as source or target)
      return !edges.some(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );
    },
    [edges, scenario?.id_first_step]
  );

  // Function to delete a node
  const deleteNode = useCallback(
    async (nodeId) => {
      // Only delete if the node has no connected edges
      if (canDeleteNode(nodeId)) {
        var succed = await deleteStep(nodeId, id_scen);
        if (!succed) return;
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setBackupNodes((nds) => nds.filter((node) => node.id !== nodeId));
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
    setBackupNodes([...layoutedNodes]);
    setBackupEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);
  const onNodeDragStop = useCallback(
    (event, node) => {
      // Update the backup nodes with the new position
      setBackupNodes((prevBackupNodes) =>
        prevBackupNodes.map((backupNode) => {
          if (backupNode.id === node.id) {
            return {
              ...backupNode,
              position: { ...node.position },
            };
          }
          return backupNode;
        })
      );
    },
    [setBackupNodes]
  );
  return (
    <div
      style={
        isOpen
          ? {
              position: "fixed",
              left: "8vw",
              width: "92vw",
              height: "100vh",
              backgroundColor: "#121212", // Dark background
            }
          : {
              position: "fixed",

              width: "100vw",
              height: "100vh",
              backgroundColor: "#121212", // Dark background
            }
      }
    >
      {initialLoading ? (
        <div className="flow-loading-container">
          <LoadingAnimation visible={initialLoading} />
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
            nodesDraggable={true}
            onNodeDragStop={onNodeDragStop}
          >
            <Background color="#ff8c42" gap={20} size={1} />
            {scenario.limit_players > 1 && (
              <div className="player-checkbox-container">
                {Array.from(
                  { length: scenario.limit_players },
                  (_, i) => i + 1
                ).map((playerId) => (
                  <div
                    key={playerId}
                    className={`player-checkbox ${
                      selectedPlayers.includes(playerId) ? "selected" : ""
                    }`}
                    onClick={() => {
                      // This is just for view demonstration
                      // In a real implementation, you would connect this to your state management
                      setSelectedPlayers((prev) =>
                        prev.includes(playerId)
                          ? prev.filter((id) => id !== playerId)
                          : [...prev, playerId]
                      );
                    }}
                  >
                    <div className="checkbox-inner">
                      {selectedPlayers.includes(playerId) && (
                        <svg viewBox="0 0 24 24" className="checkbox-icon">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </div>
                    <span className="player-label">Gracz {playerId}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Add Node button at the bottom-right */}
            <Panel position="bottom-right">
              <button onClick={layoutDiagram} className="layout-button">
                Auto Układ
              </button>
              <button onClick={addNode} className="add-node-button">
                Dodaj Krok
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
              scenarioId={id_scen}
            />
          )}
          {selectedEdge && (
            <EdgeEditor
              edge={selectedEdge}
              onSave={updateEdgeData}
              onClose={closePopup}
              limitPlayers={scenario.limit_players}
              edges={edges}
              scenario={scenario}
            />
          )}
        </>
      )}
    </div>
  );
}
