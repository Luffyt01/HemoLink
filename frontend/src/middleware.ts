
// import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "./lib/auth-utils"
import {getToken} from "next-auth/jwt"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Add paths that should be accessible without authentication
// const publicPaths = ["/signIn", "/signUp", "/api/auth/signIn", "/api/auth/SignUp"]

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Check if the path is public
//   if (publicPaths.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next()
//   }

//   // Check for auth token
//   const token =await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
//   // const token = request.cookies.get("token")?.value || null
// const url = request.nextUrl;



//   if (!token) {
//     // Redirect to login if no token is found
//     const url = new URL("/signIn", request.url)
//     url.searchParams.set("callbackUrl", encodeURI(request.url))
//     return NextResponse.redirect(url)
//   }

//   try {
//     if(token && url.pathname.startsWith("/signIn") || url.pathname.startsWith("/signUp")){
//       // Redirect to home if token is found and trying to access signIn or signUp
//       const redirectUrl = new URL("/donor", request.url)
//       return NextResponse.redirect(redirectUrl)
//     }
    
//     return NextResponse.next()
//   } catch (error) {
//     // Redirect to login if token is invalid
//     const url = new URL("/signIn", request.url)
//     url.searchParams.set("callbackUrl", encodeURI(request.url))
//     return NextResponse.redirect(url)
//   }
// }

export const config = {
  // Specify which paths should be protected
  matcher: [
    // "/signIn",
    // "/signUp",
   
    "/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth/login|api/auth/signup).*)",
  ],
}
