import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Extract the path from params
  const path = params.path.join("/");

  // Get query parameters
  const url = new URL(request.url);
  const queryString = url.search;

  // Forward the request to your API
  const response = await fetch(
    `https://squid-app-p63zw.ondigitalocean.app/api/${path}${queryString}`,
    {
      headers: {
        "Content-Type": "application/json",
        // Forward any other needed headers here
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
