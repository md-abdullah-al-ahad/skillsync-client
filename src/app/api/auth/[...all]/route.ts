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

  // Handle verify-email page navigation (browser document requests)
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
  const backendAuthUrl = (
    process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth"
  ).trim();
  const backendUrl = `${backendAuthUrl}${pathname}${searchParams ? `?${searchParams}` : ""}`;

  try {
    // Forward the request headers to the backend
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "host" && lower !== "connection") {
        headers[key] = value;
      }
    });

    const options: RequestInit = {
      method: request.method,
      headers,
      // CRITICAL: Don't follow redirects — we need to capture the
      // backend's redirect response (with Set-Cookie headers) and
      // forward it to the browser ourselves.
      redirect: "manual",
    };

    // Include body for POST requests
    if (request.method === "POST") {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(backendUrl, options);

    // Handle redirect responses (3xx) — forward them to the browser
    // with all cookies intact (session cookies, OAuth state, etc.)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        // Rewrite backend-pointing redirects to our client origin
        let redirectUrl = location;
        if (redirectUrl.startsWith(backendAuthUrl)) {
          redirectUrl = redirectUrl.replace(
            backendAuthUrl,
            `${url.origin}/api/auth`,
          );
        }

        const redirectResponse = NextResponse.redirect(
          redirectUrl,
          response.status,
        );

        // Forward all cookies from the backend (session, CSRF, etc.)
        const setCookieHeaders = response.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
          setCookieHeaders.forEach((cookie) => {
            redirectResponse.headers.append("Set-Cookie", cookie);
          });
        }

        return redirectResponse;
      }
    }

    // Handle non-redirect responses (JSON, text, etc.)
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
