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
            (edge.source === params.source && edge.target === params.target) ||
            (edge.source === params.target && edge.target === params.source)
        );

        if (existingEdge) {
          deleteChoice(existingEdge.id);
          setEdges((eds) => eds.filter((edge) => edge.id !== existingEdge.id));
        } else {
          const edgeId = await addChoice(params.source, params.target);
          setEdges((eds) =>
            addEdge(
              {
                ...params,
                id: edgeId,
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
    async (id, data) => {
      await editStep(id, data);
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

      editChoice(edgeId, currentEdge.source, currentEdge.target, data.label);
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
    const newNodeId = await addStep(id);
    const centerX = window.innerWidth / 2 - nodeHeight; // half node width
    const centerY = window.innerHeight / 2 - nodeWidth; // half node height

    const newNode = {
      id: newNodeId,
      data: {
        label: "Nowy krok",
        text: "To jest nowy krok do twojego scenariusza...",
        choices: [],
        longitude: 0,
        latitude: 0,
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
        deleteStep(nodeId);
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
