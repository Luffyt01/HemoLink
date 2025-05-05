/** @format */
import NextAuth, { type NextAuthOptions, type User, type Account } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Enhanced type definitions
interface CustomUser extends User {
  id: string;
  token?: string;
  phone?: string | null;
  email: string;
  role?: string;
  provider?: string;
  googleId?: string | null;
  profileComplete?: boolean;
}

export interface CustomSession extends Session {
  token?: string;
  user: CustomUser;
}

interface CustomJWT extends JWT {
  accessToken?: string;
  user?: Omit<CustomUser, "token">;
}

// Environment variable validation
const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

// API configuration
const API_BASE_URL = getRequiredEnvVar("BACKEND_APP_URL");
const AUTH_TIMEOUT = 60000; // 30 seconds

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getRequiredEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnvVar("GOOGLE_CLIENT_SECRET"),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      allowDangerousEmailAccountLinking: true,
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
            throw new Error("Email and password are required");
          }

          const response = await axios.post(
            `${process.env.BACKEND_APP_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
              timeout: AUTH_TIMEOUT,
            }
          );

          if (response.status !== 200) {
            throw new Error("Authentication failed");
          }

          const data = response.data;
          return {
            id: data.id,
            email: data.email,
            token: data.accessToken,
            role: data.role,
            phone: data.phoneNo,
            profileComplete: data.profileComplete,
          } as CustomUser;
        } catch (error) {
          // console.error("Credentials auth error:", error.response.data);
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data?.message)
            throw new Error(
              error.response?.data?.error.split(':')[0] || "Authentication failed"
            );
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: User | AdapterUser; account: Account | null }) {
      if (user && account) {
        const customUser = user as CustomUser;
        return {
          ...token,
          accessToken: customUser.token,
          user: {
            id: user.id,
            email: user.email || "",
            role: customUser.role,
            phone: customUser.phone,
            image: user.image,
            provider: account.provider,
            googleId: customUser.googleId,
            profileComplete: customUser.profileComplete,
          },
        };
      }
      return token;
    },

    async session({ session, token }: { session: Session & { user: { email?: string } }; token: JWT }) {
      const customSession = session as CustomSession;
      customSession.token = (token as CustomJWT).accessToken;
      customSession.user = {
        ...session.user,
        ...(token as CustomJWT).user,
        id: (token as CustomJWT).user?.id || "",
        email: session.user?.email || (token as CustomJWT).user?.email || "",
        role: (token as CustomJWT).user?.role || "",
        phone: (token as CustomJWT).user?.phone || "",
        profileComplete: (token as CustomJWT).user?.profileComplete || false,
      };
      return customSession;
    },

    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!profile?.email) {
            throw new Error("No email found in Google profile");
          }

          // Mock response for demonstration - replace with actual API call
          const mockResponse = {
            data: {
              success: true,
              message: "Google authentication successful",
              data: {
                user: {
                  id: "12345",
                  phone: null,
                  email: profile.email,
                  role: "DONOR",
                  profileComplete: false,
                },
                token: "mocked_token",
              },
            },
          };

          const data = mockResponse.data;

          if (!data.success) {
            throw new Error(data.message || "Google authentication failed");
          }

          // Update user object with data from API
          Object.assign(user, {
            id: data.data.user.id,
            role: data.data.user.role,
            token: data.data.token,
            googleId: profile.sub,
            provider: "google",
            profileComplete: data.data.user.profileComplete,
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        let errorMessage = "Authentication failed";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        }

        return `/login?error=${encodeURIComponent(errorMessage)}`;
      }
    },
  },

  pages: {
    signIn: "/signIn",
    error: "/signIn",
    newUser: "/signup",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    secret: getRequiredEnvVar("NEXTAUTH_SECRET"),
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: getRequiredEnvVar("NEXTAUTH_SECRET"),
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);