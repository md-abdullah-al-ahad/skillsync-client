import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleTutorsRequest(request);
}

async function handleTutorsRequest(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api";
  const backendUrl = `${backendBaseUrl}/tutors${searchParams ? `?${searchParams}` : ""}`;

  try {
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
        headers[key] = value;
      }
    });

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const responseBody = isJson ? await response.json() : await response.text();

    const nextResponse = isJson
      ? NextResponse.json(responseBody, {
          status: response.status,
          statusText: response.statusText,
        })
      : new NextResponse(responseBody, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            "Content-Type": contentType || "text/plain; charset=utf-8",
          },
        });

    return nextResponse;
  } catch (error) {
    console.error("Tutors proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process tutors request" },
      { status: 500 },
    );
  }
}
