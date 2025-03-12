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
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import "./styleModules/flowComponentModule.css";
import { initialEdges, initialNodes } from "./initialData";
import NodeEditor from "./nodeEditor";
import EdgeEditor from "./edgeEditor";
// Define node dimensions for layout calculations
const nodeWidth = 180;
const nodeHeight = 80;

// Function to create a proper tree layout
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph direction and node spacing
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
  });

  // Add nodes to the dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate the layout
  dagre.layout(dagreGraph);

  // Apply the calculated layout to the nodes
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function FlowComponent({ loading, setLoading, scenario }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  // Function to change layout
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        if (scenario.first_step) {
          // Create a queue of steps to process
          const stepQueue = [scenario.first_step];
          const processedSteps = new Set();
          const pendingNodes = [];
          const pendingEdges = [];
          const processedEdges = new Set(); // Track processed edges to prevent duplicates

          // Process the queue
          while (stepQueue.length > 0) {
            const currentStep = stepQueue.shift();
            const stepId = currentStep.id_step;

            // Skip if already processed
            if (processedSteps.has(stepId)) {
              continue;
            }

            // Mark as processed
            processedSteps.add(stepId);

            // Create node
            pendingNodes.push({
              id: stepId.toString(),
              data: {
                label: currentStep.title || `Step ${stepId}`,
                text: currentStep.text || "No description",
              },
              position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
              style: {
                background: "#f0f0f0",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 5,
                width: nodeWidth,
              },
            });

            // Process choices if any
            if (currentStep.choices && currentStep.choices.length > 0) {
              for (const choice of currentStep.choices) {
                const nextStepId = choice.id_next_step;

                // Skip self-connections
                if (stepId === nextStepId) {
                  console.warn(`Skipping self-connection for step ${stepId}`);
                  continue;
                }

                // Create unique edge ID and check if we've already processed this edge
                const edgeId = `e${stepId}-${nextStepId}`;
                if (processedEdges.has(edgeId)) {
                  continue;
                }
                processedEdges.add(edgeId);

                // Create edge
                pendingEdges.push({
                  id: edgeId,
                  source: stepId.toString(),
                  target: nextStepId.toString(),
                  label: choice.text || "Continue",
                  style: { stroke: "#333" },
                  animated: false,
                  markerEnd: {
                    type: "arrowclosed",
                  },
                });

                // Fetch next step if not processed yet
                if (!processedSteps.has(nextStepId)) {
                  try {
                    const nextStepRes = await fetch(
                      `/api/proxy/steps/${nextStepId}`,
                      {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (nextStepRes.ok) {
                      const nextStepData = await nextStepRes.json();
                      stepQueue.push(nextStepData);
                    } else {
                      console.error(
                        `Step ${nextStepId} not found or error: ${nextStepRes.status}`
                      );
                    }
                  } catch (error) {
                    console.error(`Error fetching step ${nextStepId}:`, error);
                  }
                }
              }
            }
          }

          // Apply layout algorithm to position nodes
          const layoutedElements = getLayoutedElements(
            pendingNodes,
            pendingEdges,
            "TB"
          );

          // Update the graph with all nodes and edges at once
          setNodes(layoutedElements.nodes);
          setEdges(layoutedElements.edges);
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
    (params) => {
      // Prevent self-connections
      if (params.source !== params.target) {
        // Check if an edge already exists between these nodes
        const existingEdge = edges.find(
          (edge) =>
            edge.source === params.source && edge.target === params.target
        );

        if (existingEdge) {
          // If edge exists, remove it
          setEdges((eds) => eds.filter((edge) => edge.id !== existingEdge.id));
        } else {
          // If no edge exists, add a new one
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                id: `e${params.source}-${params.target}`,
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
        }
      }
    },
    [edges, setEdges]
  );

  // Function to update node data after editing
  const updateNodeData = useCallback(
    (id, data) => {
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
    },
    [setNodes]
  );
  // Function to handle node click - open edit popup instead of alert
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  const updateEdgeData = useCallback(
    (id, data) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
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
    [setEdges]
  );
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);
  // Close the popup
  const closePopup = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

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
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
          </ReactFlow>
          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onSave={updateNodeData}
              onClose={closePopup}
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
