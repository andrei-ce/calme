// import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability>({
    possibleTimes: [],
    availableTimes: [],
  })
  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const monthAndDay = selectedDate
    ? dayjs(selectedDate).format('MMMM DD')
    : null

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    async function fetchData() {
      try {
        const res = await api.get(`/users/${username}/availability/`, {
          params: { date: dayjs(selectedDate).format('YYYY-MM-DD') },
        })
        setAvailability(res.data)
      } catch (error) {
        alert(`Could not fetch ${username}'s availability`)
      }
    }

    fetchData()
  }, [selectedDate, username])

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay}, <span>{monthAndDay}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour, i) => {
              return (
                <TimePickerItem
                  key={i}
                  onClick={() => console.log(hour)}
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
