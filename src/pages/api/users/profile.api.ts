import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handleUpdateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' })
    return
  }

  const { bio } = updateProfileBodySchema.parse(req.body)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bio,
    },
  })

  return res.status(204).end()
}
