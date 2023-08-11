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
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  // Availability ##########################################
  const availableWeekDays = await prisma.userTimeSlot.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ day_of_the_month: number }> =
    await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM M.DATE) as day_of_the_month,
      COUNT(M.date) meetings_count,
      ((UTS.time_end_in_min - UTS.time_start_in_min) / 60) available_slots_count
    FROM 
      Meetings M
      LEFT JOIN UserTimeSlots UTS ON UTS.week_day = WEEKDAY(DATE_ADD(M.date, INTERVAL 1 DAY))
    WHERE M.user_id = ${user.id}
      AND DATE_FORMAT(M.date, "%Y-%m") = ${`${year}-${month}`}
    GROUP BY 1,3
    HAVING meetings_count >= available_slots_count
  `

  const blockedDatesInMonth = blockedDatesRaw.map(
    (item) => item.day_of_the_month,
  )

  return res.json({
    blockedWeekDays,
    blockedDatesInMonth,
  })
}
