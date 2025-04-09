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
import "@xyflow/react/dist/style.css";
import "./styleModules/flowComponentModule.css";
import NodeEditor from "./nodeEditor";
import EdgeEditor from "./edgeEditor";
import getLayoutedElements from "./functionalComponents/dagreComponent";
import FillNode from "./functionalComponents/fillNode";
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

// Function to create a proper tree layout

export default function FlowComponent({
  loading,
  setLoading,
  scenario,
  id_scen,
}) {
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
            (edge.source === params.source && edge.target === params.target) ||
            (edge.source === params.target && edge.target === params.source)
        );

        if (existingEdge) {
          deleteChoice(existingEdge.id, id_scen);
          setEdges((eds) => eds.filter((edge) => edge.id !== existingEdge.id));
        } else {
          const edgeId = await addChoice(params.source, params.target, id_scen);
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                id: edgeId,
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
    },
    [edges, setEdges]
  );

  // Function to update node data after editing
  const updateNodeData = useCallback(
    async (id, data) => {
      try {
        // Call editStep with the full data object including photo
        const photoUrl = await editStep(id, data, id_scen);
        console.log("UPDATED");
        console.log(photoUrl);
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
      } catch (error) {
        console.error("Failed to update node:", error);
        // Optionally add error handling (e.g., show error toast)
      }
    },
    [setNodes, id_scen]
  );

  // Function to handle node click - open edit popup instead of alert
  const onNodeClick = useCallback((event, node) => {
    console.log(node);
    setSelectedNode(node);
  }, []);

  const updateEdgeData = useCallback(
    async (edgeId, data) => {
      //   // First, make sure we have the most current edges array
      const currentEdge = edges.find((e) => e.id === edgeId);

      if (!currentEdge) {
        console.error(`Edge with ID ${edgeId} not found in the edges array`);
        return;
      }

      editChoice(
        edgeId,
        currentEdge.source,
        currentEdge.target,
        data.label,
        id_scen
      );
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
    },
    [edges, setEdges]
  );

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);

  // Close the popup
  const closePopup = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Function to add a new node
  const addNode = useCallback(async () => {
    const newNodeId = await addStep(id_scen);
    const centerX = window.innerWidth / 2 - nodeHeight; // half node width
    const centerY = window.innerHeight / 2 - nodeWidth; // half node height
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

    // Immediately open the node editor for the new node
    setSelectedNode(newNode);
  }, [setNodes, id_scen]);

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
        deleteStep(nodeId, id_scen);
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
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
        border: "1px solid #ff8c42", // Updated border color
        backgroundColor: "#25211e", // Dark background
      }}
    >
      {loading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#f5f5f5", // Light text color
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
            nodesDraggable={true}
          >
            <Background color="#ff8c42" gap={20} size={1} />

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
              scenarioId={id_scen}
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
