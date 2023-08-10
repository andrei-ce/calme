import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const timeSlotsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number().min(0).max(6),
      startTimeInMin: z.number(),
      endTimeInMin: z.number(),
    }),
  ),
})

export default async function handleTimeIntervals(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
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

  // to-do: validate incoming data per field
  const { intervals } = timeSlotsBodySchema.parse(req.body)

  // in dev mode, we use sqlite, which doesnt support .CreateMany()
  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeSlot.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_min: interval.startTimeInMin,
          time_end_in_min: interval.endTimeInMin,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
