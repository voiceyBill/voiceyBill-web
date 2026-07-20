import { next } from "@vercel/edge";

export const config = {
  matcher: "/",
};

export default function middleware(request: Request) {
  const accept = request.headers.get("accept") || "";

  if (accept.includes("text/markdown")) {
    const url = new URL("/api/markdown", request.url);
    return fetch(url.toString(), {
      headers: request.headers,
    });
  }

  return next();
}
