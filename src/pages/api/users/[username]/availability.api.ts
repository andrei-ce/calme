/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validations ##########################################
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const username = String(req.query.username)
  const { date } = req.query

  if (!date || !dayjs(String(date)).isValid()) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date)) // date could be an array of dates
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({
      possibleTimes: [],
      availableTimes: [],
    })
  }

  // Check user availability  #############################
  const userAvailability = await prisma.userTimeSlot.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_min, time_end_in_min } = userAvailability

  // TO-DO: allow 30 min intervals instead of full hours only
  const startHour = time_start_in_min / 60
  const endHour = time_end_in_min / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  // Check if user has meetings on provided date ############
  const blockedTimes = await prisma.meeting.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  console.log(blockedTimes)

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({
    possibleTimes,
    availableTimes,
  })
}
