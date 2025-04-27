/** @format */
import NextAuth, { type NextAuthOptions, type User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"
// import { loginApi, loginGoogleApi } from "@/lib/EndPointApi"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

interface CustomUser extends User {
  id: string
  token?: string
  phone?: string | null
  email: string
  role?: string
  provider?: string
  googleId?: string | null
}

interface CustomSession extends Session {
  token?: string
  user: CustomUser
}

// Enhanced environment variable handling
const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

// Configured axios instance


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      // clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      // clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // scope: "openid email profile",
        },
      },
      // allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          // const response = await axios.post(
          //   loginApi,
          //   {
          //     email: credentials.email,
          //     password: credentials.password,
          //   },
          //   { timeout: 30000 }
          // )
          
          const response ={
            status: 200,
            data: {
            
                  id: "12345",
                  phone: null,
                  email: credentials.email,
                  role: "DONOR",
                  accessToken: "mocked_token",
                }
               
            
            
          }
          const data = response.data
        // console.log(data+" 11111111111111111")

          if (response.status !== 200) {
            throw new Error( "Authentication failed")
          }

          return {
            id: data.id,
            
            email: data.email,
            token: data.accessToken,
            role: data.role,  
            provider: "credentials",
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
     console.log("22222222222222222222222222222+"+token, user, account)
      if (user && account) {
        return {
          ...token,
          accessToken: (user as CustomUser).token,
          user: {
            role: (user as CustomUser).role,
            id: user.id,
            email: user.email,
            image: user.image,
            provider: (user as CustomUser).provider || account.provider,
            googleId: (user as CustomUser).googleId,
          },
        }
      }
      return token
    },

    async session({ session, token }) {
      console.log("111111111111111111111111111111111111111111111111111111111111111111111"+session, token)
      session.token = token.accessToken as string
      session.user = {
        ...session.user,
        ...(typeof token.user === "object" && token.user !== null ? token.user : {}),
        role: (token.user as CustomUser)?.role || "",
        id: (token.user as CustomUser | undefined)?.id as string,
      }
      // console.log(session)
      return session
    },
   
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!profile?.email) {
            throw new Error("No email found in Google profile")
          }
          

          // const response = await axios.post(
          //   loginGoogleApi,
          //   {
          //     email: profile.email,
          //     role: profile?.role || "DONOR",
          //     name: profile.name || user.name || profile.email.split("@")[0],
          //     image: profile.image || null,
          //     googleId: profile.sub,
          //   },
          //   { timeout: 30000 }
          // )
  const response = {
            data: {
              success: true,
              message: "Google authentication successful",
              data: {
                user: {
                  id: "12345",
                  phone: null,
                  email: profile.email,
                  role: "DONOR",
                },
                token: "mocked_token",
              },
            },
          } as any // Mocked response for demonstration

          // console.log(response.data)
          if (!response) {
            throw new Error("Google authentication failed")
  }
          const data = response.data

          if (!data.success) {
            throw new Error(data.message || "Google authentication failed")
          }

          // Update user object with data from your API
          user.id = data.data.user.id;
          user.role = data.data.user.role ||"";
          
          (user as CustomUser).token = data.data.token;
          (user as CustomUser).googleId = profile?.sub || null;
          (user as CustomUser).provider = "google";
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return `/login?error=${encodeURIComponent(
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Authentication failed"
        )}`
      }
    },   
  },

  pages: {
    signIn: "/signIn",
    error: "/signIn",
    newUser: "/signUp",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days `
  },

  jwt: {
    secret: getEnvVar("NEXTAUTH_SECRET"),
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },

  secret: getEnvVar("NEXTAUTH_SECRET"),
//   debug: process.env.NODE_ENV === "development",
}