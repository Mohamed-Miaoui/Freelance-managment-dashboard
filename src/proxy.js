import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long"
);

//in nextjs 16, we use proxy instead of middleware
export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Define paths that are public
  const isPublicPath = path === "/login";

  // Define paths that are protected (all pages inside (pages) are protected by default because they are under the root, 
  // but we specifically want to protect the dashboard routes)
  // Actually, we can just check if the user has the cookie.

  const token = request.cookies.get("admin_session")?.value;

  // Verify the token
  let verifiedToken = null;
  try {
    if (token) {
      const { payload } = await jwtVerify(token, secret);
      verifiedToken = payload;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  // Redirect logic
  if (!isPublicPath && !verifiedToken) {
    // If trying to access a protected page without a token, redirect to login
    // We want to protect everything except public assets and api routes that are not auth related (though we might want to protect APIs too)
    // For now, let's protect everything that is not a static file or api/auth

    // Exclude static files, images, etc.
    if (
      !path.startsWith("/_next") &&
      !path.startsWith("/api/auth") &&
      !path.startsWith("/static") &&
      !path.includes(".") // Exclude files with extensions (images, etc)
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isPublicPath && verifiedToken) {
    // If trying to access login page with a valid token, redirect to dashboard (e.g. /projects or /)
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
