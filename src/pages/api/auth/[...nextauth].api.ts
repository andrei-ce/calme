import PrismaAdapter from '@/lib/next-auth/prisma-adapter'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

// [...nextauth] is a route. For example, when accessing localhost/api/auth/param1/param2/etc, param1, param1 and etc will be passed as params to next-auth
export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },
        profile(profile: GoogleProfile) {
          // this function allows us to map field names that are returned by Google
          // Ctrl+click on GoogleProfile to see more fields
          // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/google.ts
          return {
            id: profile.sub,
            name: profile.name,
            username: '', // this is returned by our application, but required by TS
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          // handle if the user doesnt give us access to the calendar
          return '/register/connect-calendar/?error=permissions'
        }
        return true // user has scope, all good
      },

      async session({ session, user }) {
        // this function will pass values to const session = useSession() on the FE
        return {
          ...session,
          user, // rewriting user data (by default it only brings name and email)
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}