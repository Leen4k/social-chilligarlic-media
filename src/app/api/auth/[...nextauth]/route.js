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
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        const id = session.user.id
        const user = await prisma.user.findUnique({where:{
          id: id
        }})
        session.user.cover = user.cover
        session.user.name = user.name
        session.user.email = user.email
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
}
// export default NextAuth(authOptions)
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};