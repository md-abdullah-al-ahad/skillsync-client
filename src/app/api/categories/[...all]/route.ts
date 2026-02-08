import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleCategoriesRequest(request);
}

export async function POST(request: NextRequest) {
  return handleCategoriesRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleCategoriesRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleCategoriesRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleCategoriesRequest(request);
}

async function handleCategoriesRequest(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace("/api/categories", "");
  const searchParams = url.searchParams.toString();

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api";
  const backendUrl = `${backendBaseUrl}/categories${pathname}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
        headers[key] = value;
      }
    });

    const options: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(backendUrl, options);

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

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Categories proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process categories request" },
      { status: 500 },
    );
  }
}
