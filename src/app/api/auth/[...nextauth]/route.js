import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import { prisma } from "../../../../../prisma/client"

// const prisma = new PrismaClient();
const adapter = PrismaAdapter(prisma)
  
export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  adapter: adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID, 
      clientSecret: process.env.CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
}
// export default NextAuth(authOptions)
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};