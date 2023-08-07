import NextAuth from 'next-auth'

// we have changed some fields in the Prisma tables for the PrismaAdapter,
// so we are overwriting some standard types that come in node_modules
declare module 'next-auth' {
  export interface User {
    // AdapterUser extends User
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  interface Session {
    user: User
  }
}
