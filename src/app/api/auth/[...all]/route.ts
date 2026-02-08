import { NextRequest, NextResponse } from "next/server";

/**
 * Better Auth API Route Handler
 * This proxies all authentication requests to the backend API
 */
export async function GET(request: NextRequest) {
  return handleAuthRequest(request);
}

export async function POST(request: NextRequest) {
  return handleAuthRequest(request);
}

async function handleAuthRequest(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/api/auth/verify-email")) {
    const acceptHeader = request.headers.get("accept") || "";
    const fetchDest = request.headers.get("sec-fetch-dest") || "";
    const isDocumentRequest =
      acceptHeader.includes("text/html") || fetchDest === "document";
    if (isDocumentRequest) {
      const token = url.searchParams.get("token");
      if (token) {
        const redirectUrl = new URL("/verify-email", url.origin);
        redirectUrl.searchParams.set("token", token);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }
  const pathname = url.pathname.replace("/api/auth", "");
  const searchParams = url.searchParams.toString();

  // Get the backend auth URL
  const backendAuthUrl =
    process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";
  const backendUrl = `${backendAuthUrl}${pathname}${searchParams ? `?${searchParams}` : ""}`;

  try {
    // Forward the request to the backend
    const headers: HeadersInit = {};

    // Copy relevant headers
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
        headers[key] = value;
      }
    });

    const options: RequestInit = {
      method: request.method,
      headers,
    };

    // Include body for POST requests
    if (request.method === "POST") {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(backendUrl, options);

    // Handle redirect responses (like after email verification)
    if (response.redirected) {
      return NextResponse.redirect(response.url);
    }

    // Get response body
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const responseBody = isJson ? await response.json() : await response.text();

    // Create response with same status
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

    // Copy cookies from backend response
    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process authentication request" },
      { status: 500 },
    );
  }
}
