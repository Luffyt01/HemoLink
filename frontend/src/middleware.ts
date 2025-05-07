
// import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "./lib/auth-utils"
// import {getToken} from "next-auth/jwt"
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.next()
// }



// export const config = {
//   // Specify which paths should be protected
//   matcher: [
//     "/signIn",
//     "/signup",
   
//     "/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth/login|api/auth/signup).*)",
//   ],
// }

// import { getServerSession } from "next-auth";
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { authOptions } from "./app/api/auth/[...nextauth]/options";


// const publicPaths = [
//   "/",
//   "/signIn",
//   "/signup", 
//   "/api/auth/signIn", 
//   "/api/auth/signup",
//   "/api/auth/callback"
// ]

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Check if the path is public
//   if (publicPaths.some(path => pathname.startsWith(path))) {
//     return NextResponse.next()
//   }

//   // Get the session
//   const session = await getServerSession(authOptions)

//   // Handle unauthenticated users
//   if (!session) {
//     const loginUrl = new URL("/signIn", request.url)
//     loginUrl.searchParams.set("callbackUrl", encodeURI(request.url))
//     return NextResponse.redirect(loginUrl)
//   }

//   // Prevent authenticated users from accessing auth pages
//   if (session && (pathname.startsWith("/signIn") || pathname.startsWith("/signup"))) {
//     // Redirect based on user role
//     return NextResponse.redirect(
//       new URL(session.user.role === 'HOSPITAL' ? "/hospital/dashboard" : "/donor/dashboard", request.url)
//     )
//   }

//   // Role-based route protection
//   if (session.user.role === 'DONOR' && pathname.startsWith("/hospital")) {
//     return NextResponse.redirect(new URL("/donor/dashboard", request.url))
//   }

//   if (session.user.role === 'HOSPITAL' && pathname.startsWith("/donor")) {
//     return NextResponse.redirect(new URL("/hospital/dashboard", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     "/signIn",
//     "/signup",
//     "/donor/:path*",
//     "/hospital/:path*",
//     "/((?!api|_next/static|_next/image|favicon.ico).*)"
//   ]
// }













import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  "/",
  "/signin",  // Using consistent lowercase
  "/signup", 
  "/api/auth/signin", 
  "/api/auth/signup",
  "/api/auth/callback"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Using getToken instead of getServerSession for better edge compatibility
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production"
    });

    // Handle unauthenticated users
    if (!token) {
      const loginUrl = new URL("/signin", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(loginUrl);
    }

    // Get role from token (ensure your JWT callback adds this)
    const role = token.role || ''; // Default to DONOR if role not specified
    
    // Prevent authenticated users from accessing auth pages
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(
        new URL(role === 'HOSPITAL' ? "/hospital/dashboard" : "/donor/dashboard", request.url)
      );
    }

    // Role-based route protection
    if (role === 'DONOR' && pathname.startsWith("/hospital")) {
      return NextResponse.redirect(new URL("/donor/dashboard", request.url));
    }

    if (role === 'HOSPITAL' && pathname.startsWith("/donor")) {
      return NextResponse.redirect(new URL("/hospital/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    // Fallback redirect if there's any error in authentication
    const loginUrl = new URL("/signin", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/donor/:path*",
    "/hospital/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};