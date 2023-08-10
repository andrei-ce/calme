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
import { lte } from 'semver'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs().set('date', 1))

  const shortWeekDays = getWeekDays({ short: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }
  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const calendarWeeks = useMemo(() => {
    // Current month logic ######################
    const daysInCurrentMonth = currentDate.daysInMonth()
    const daysInCurrentMonthArray = Array.from({
      length: daysInCurrentMonth,
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    // Prev month logic #########################
    const firstWeekDay = currentDate.get('day')
    const prevMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
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
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...prevMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInCurrentMonthArray.map((date) => {
        return {
          date,
          disabled: date.endOf('day').isBefore(new Date()),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    // Split in weeks ###################################
    console.log('calendarDays', calendarDays)
    console.log(daysInCurrentMonth)
    const calendarWeeks = []
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
  }, [currentDate])

  console.log(calendarWeeks)

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
                {week.map(({ date, disabled }, i) => {
                  return (
                    <td key={i}>
                      <CalendarDay
                        onClick={() => console.log(date)}
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
