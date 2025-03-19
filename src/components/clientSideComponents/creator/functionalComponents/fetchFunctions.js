const url = "https://squid-app-p63zw.ondigitalocean.app/api";
function getToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }
  return token;
}
export async function addStep(id_scen) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/steps?id_scen=${id_scen}`, {
      method: "POST",
      body: JSON.stringify({
        title: "Nowy krok",
        text: "To jest nowy krok do twojego scenariusza...",
        longitude: -0.15,
        latitude: 51.48,
        choices: [],
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create node");
    }

    const r = await response.json();
    return String(r.id_step);
  } catch (error) {
    console.log(error);
  }
}
export async function editStep(id, data) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/steps/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: data.label,
        text: data.text,
        longitude: data.longitude,
        latitude: data.latitude,
        choices: [],
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to create node");
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteStep(id) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/steps/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to create node");
    }
  } catch (error) {
    console.log(error);
  }
}
export async function addChoice(source, target) {
  try {
    const token = getToken();
    const responseChoice = await fetch(`${url}/choices`, {
      method: "POST",
      body: JSON.stringify({
        text: "Continue",
        id_next_step: Number(target),
        id_step: Number(source),
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(responseChoice);
    if (!responseChoice.ok) {
      throw new Error("Cannot connect");
    }

    const res = await responseChoice.json();
    return res.id_choice;
  } catch (error) {
    console.log(error);
  }
}
export async function editChoice(edgeId, source, target, label) {
  try {
    const token = getToken();
    // First, make sure we have the most current edges array

    const response = await fetch(`${url}/choices/${edgeId}`, {
      method: "PUT",
      body: JSON.stringify({
        text: label,
        id_next_step: Number(target),
        id_step: Number(source),
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteChoice(id) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/choices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
