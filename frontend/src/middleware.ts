import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  "/signIn",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/api/auth/",
  "/_next/",
  "/favicon.ico",
  "/error"
];

const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => 
    pathname.startsWith(path) || 
    // pathname === '/' || 
    pathname.includes('.') // exclude files with extensions
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths and static files
  
  // return NextResponse.next();
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });
    if (!token && isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // Handle unauthenticated users trying to access protected routes
    if (!token && (pathname.startsWith('/donor') || pathname.startsWith('/hospital') || pathname.startsWith('/'))) {
      const loginUrl = new URL('/signIn', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If no token but not accessing protected route, allow
    if (!token) {
      return NextResponse.next();
    }

    const role = token.role || 'DONOR';

    // Redirect authenticated users away from auth pages
    if (pathname === '/signIn' || pathname === '/signup' || pathname === '/' || pathname === '/forgot-password' || pathname === '/reset-password') {
      const dashboardUrl = role === 'HOSPITAL' ? '/hospital/dashboard' : '/donor/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Role-based route protection
    if (role === 'DONOR' && pathname.startsWith('/hospital')) {
      return NextResponse.redirect(new URL('/donor/dashboard', request.url)); 
    }

    if (role === 'HOSPITAL' && pathname.startsWith('/donor')) {
      return NextResponse.redirect(new URL('/hospital/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('error', 'authentication_failed');
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/donor/:path*",
    "/hospital/:path*",
    "/signIn",
    "/signup",
    "/forgot-password",
    "/reset-password"
  ]
};