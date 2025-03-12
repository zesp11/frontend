import getLayoutedElements from "./dagreComponent";
export default async function FillNode(
  scenario,
  setNodes,
  setEdges,
  nodeWidth,
  nodeHeight
) {
  // Create a queue of steps to process
  const stepQueue = [scenario.first_step];
  const processedSteps = new Set();
  const pendingNodes = [];
  const pendingEdges = [];
  const processedEdges = new Set(); // Track processed edges to prevent duplicates
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No token found in localStorage");
    setLoading(false);
    return;
  }
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
            const nextStepRes = await fetch(`/api/proxy/steps/${nextStepId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

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
    "TB",
    nodeWidth,
    nodeHeight
  );

  // Update the graph with all nodes and edges at once
  setNodes(layoutedElements.nodes);
  setEdges(layoutedElements.edges);
}
