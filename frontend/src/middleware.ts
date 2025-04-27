import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "./lib/auth-utils"

// Add paths that should be accessible without authentication
const publicPaths = ["/signIn", "/signUp", "/api/auth/signIn", "/api/auth/SignUp"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    // Redirect to login if no token is found
    const url = new URL("/signIn", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  try {
    // Verify the token
    // verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    // Redirect to login if token is invalid
    const url = new URL("/signIn", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }
}

export const config = {
  // Specify which paths should be protected
  matcher: [
    // Protected routes
    // "/dashboard/:path*",
    // "/profile/:path*",
    // "/api/:path*",

    // Exclude public routes
    "/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth/login|api/auth/signup).*)",
  ],
}
