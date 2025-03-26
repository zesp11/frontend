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
    const form = new FormData();
    form.append("title", "Nowy krok");
    form.append("text", "To jest nowy krok do twojego scenariusza...");
    form.append("longitude", 18.594415);
    form.append("latitude", 53.010001);
    form.append("choices", JSON.stringify([])); // Convert array to string

    // If photo is null, don't append it
    const response = await fetch(`${url}/steps?id_scen=${id_scen}`, {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${token}`,
        // Remove "Content-Type" header when using FormData
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create node");
    }

    const r = await response.json();
    return String(r.id_step);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw to allow caller to handle the error
  }
}

export async function editStep(id, data, id_scen) {
  try {
    const token = getToken();
    const form = new FormData();
    form.append("title", data.label);
    form.append("text", data.text);
    form.append("longitude", data.longitude);
    form.append("latitude", data.latitude);

    // Only append photo if it exists
    if (data.photo) {
      form.append("photo", data.photo);
    }

    const response = await fetch(`${url}/steps/${id}?id_scen=${id_scen}`, {
      method: "PUT",
      body: form,
      headers: {
        Authorization: `Bearer ${token}`,
        // Remove "Content-Type" header when using FormData
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to edit node: ${errorBody}`);
    }
  } catch (error) {
    console.error(error);
    throw error; // Re-throw to allow caller to handle the error
  }
}
export async function deleteStep(id, id_scen) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/steps/${id}?id_scen=${id_scen}`, {
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
export async function addChoice(source, target, id_scen) {
  try {
    const token = getToken();
    const responseChoice = await fetch(`${url}/choices?id_scen=${id_scen}`, {
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
export async function editChoice(edgeId, source, target, label, id_scen) {
  try {
    const token = getToken();
    // First, make sure we have the most current edges array
    console.log(
      JSON.stringify({
        id_scen: id_scen,
        text: label,
        id_next_step: Number(target),
      })
    );
    const response = await fetch(`${url}/choices/${edgeId}`, {
      method: "PUT",
      body: JSON.stringify({
        id_scen: Number(id_scen),
        text: label,
        id_next_step: Number(target),
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
export async function deleteChoice(id, id_scen) {
  try {
    const token = getToken();
    const response = await fetch(`${url}/choices/${id}?id_scen=${id_scen}`, {
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
