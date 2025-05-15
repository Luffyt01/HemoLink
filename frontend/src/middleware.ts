import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  "/",
  "/signin",
  "/signup",
  "/api/auth/",
  "/_next/",
  "/favicon.ico",
  "/error"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Processing: ${pathname}`);

  // Skip middleware for public paths and static files
  // if (publicPaths.some(path => pathname.startsWith(path))) {
  //   console.log(`[Middleware] Allowing public path: ${pathname}`);
  //   return NextResponse.next();
  // }

  try {
    console.log("[Middleware] Attempting to get token...");
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });

    console.log(`[Middleware] Token status: ${token ? "Exists" : "Missing"}`);

    // Handle unauthenticated users trying to access protected routes
    if (!token && (pathname.startsWith('/donor') || pathname.startsWith('/hospital'))) {
      console.log(`[Middleware] Unauthenticated access to protected path: ${pathname}`);
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If no token but not accessing protected route, allow
    if (!token) {
      console.log(`[Middleware] Allowing non-protected path without auth: ${pathname}`);
      return NextResponse.next();
    }

    const role = token.role || 'DONOR';
    console.log(`[Middleware] User role: ${role}`);

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
      console.log(`[Middleware] Authenticated user accessing auth page, redirecting to dashboard`);
      const dashboardUrl = role === 'HOSPITAL' ? '/hospital/dashboard' : '/donor/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Role-based route protection
    if (role === 'DONOR' && pathname.startsWith('/hospital')) {
      console.log(`[Middleware] Donor trying to access hospital route, redirecting`);
      return NextResponse.redirect(new URL('/donor/dashboard', request.url));
    }

    if (role === 'HOSPITAL' && pathname.startsWith('/donor')) {
      console.log(`[Middleware] Hospital trying to access donor route, redirecting`);
      return NextResponse.redirect(new URL('/hospital/dashboard', request.url));
    }

    console.log(`[Middleware] Access granted to ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Authentication error:', error);
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('error', 'authentication_failed');
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: [
    "/donor/:path*",
    "/hospital/:path*",
    "/signin",
    "/signup"
  ]
};  