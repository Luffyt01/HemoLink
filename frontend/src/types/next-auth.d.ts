import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    token?: string  
    user: {
      /** The user's postal address. */
        id: string
        role?: string
    }
  }
}