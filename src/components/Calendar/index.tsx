import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarContainer,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarBody,
  CalendarDay,
} from './styles'
import { getWeekDays } from '@/utils/get-week-days'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

type CalendarWeek = Array<{
  date: dayjs.Dayjs
  disabled: boolean
}>

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDatesInMonth: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs().set('date', 1))

  const shortWeekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const router = useRouter()
  const username = String(router.query.username)

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }
  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')], // to cache per year per month
    async () => {
      const res = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: String(currentDate.get('month') + 1).padStart(2, '0'),
        },
      })
      return res.data
    },
  )

  // To-do: extract this function into a custom hook that takes a date and returns an array of weeks including the prev and next month's "rest of the week"
  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    // Current month logic ######################
    const daysInCurrentMonth = currentDate.daysInMonth()
    const daysInCurrentMonthArray = Array.from({
      length: daysInCurrentMonth,
    }).map((_, i) => {
      const date = currentDate.set('date', i + 1)
      return {
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDatesInMonth.includes(date.get('date')),
      }
    })

    // Prev month logic #########################
    const firstWeekDay = currentDate.get('day')
    const prevMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return { date: currentDate.subtract(i + 1, 'day'), disabled: true }
      })
      .reverse()

    // Next month logic #########################
    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')
    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return { date: lastDayInCurrentMonth.add(i + 1, 'day'), disabled: true }
    })

    const calendarDays = [
      ...prevMonthFillArray,
      ...daysInCurrentMonthArray,
      ...nextMonthFillArray,
    ]

    // Split in weeks ###################################
    const calendarWeeks: CalendarWeeks = []
    let currentWeek = []

    for (let i = 1; i <= calendarDays.length; i++) {
      currentWeek.push(calendarDays[i - 1])
      const isNewWeek = i % 7 === 0
      if (isNewWeek) {
        calendarWeeks.push(currentWeek)
        currentWeek = []
      }
    }

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button title="Previous month" onClick={handlePreviousMonth}>
            <CaretLeft />
          </button>
          <button title="Next month" onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week, i) => {
            return (
              <tr key={i}>
                {week.map(({ date, disabled }, j) => {
                  return (
                    <td key={j}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
