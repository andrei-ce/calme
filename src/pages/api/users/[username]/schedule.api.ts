import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
// import { google } from 'googleapis'
// import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createMeetingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    notes: z.string(),
    date: z.string().datetime(),
  })
  console.log(req.body)
  const { name, email, notes, date } = createMeetingBody.parse(req.body.params)

  const meetingDate = dayjs(date).startOf('hour')

  if (meetingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'You cannot travel back in time.',
    })
  }

  const conflictingMeeting = await prisma.meeting.findFirst({
    where: {
      user_id: user.id,
      date: meetingDate.toDate(),
    },
  })

  if (conflictingMeeting) {
    return res.status(400).json({
      message: 'There is another meeting at at the same time.',
    })
  }

  const meeting = await prisma.meeting.create({
    data: {
      name,
      email,
      notes,
      date: meetingDate.toDate(), // prisma accepts JS dates
      user_id: user.id,
    },
  })

  return res.status(201).end()
}
