import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Join the path array with '/' to handle both list and single item routes
  const p = await params;
  const path = p.path.join("/");

  const url = new URL(request.url);
  const queryString = url.search;
  const token = request.headers.get("Authorization");

  try {
    const response = await fetch(
      `https://squid-app-p63zw.ondigitalocean.app/api/${path}${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}), // Forward the token if present
        },
      }
    );

    if (!response.ok) {
      // Handle non-200 responses
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const path = params.path.join("/");

  const body = await request.json();
  const token = request.headers.get("Authorization");

  try {
    const response = await fetch(
      `https://squid-app-p63zw.ondigitalocean.app/api/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}), // Forward the token if present
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      // Handle non-200 responses
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
