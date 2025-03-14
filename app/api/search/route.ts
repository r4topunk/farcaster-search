import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the Neynar API key from environment variables
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Neynar API key not configured" },
      { status: 500 }
    );
  }

  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/cast/search?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch results" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
