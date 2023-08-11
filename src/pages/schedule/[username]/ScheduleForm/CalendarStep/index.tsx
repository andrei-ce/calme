// import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { useQuery } from '@tanstack/react-query'
import { Text } from '@celoco-ui/react'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const monthAndDay = selectedDate
    ? dayjs(selectedDate).format('MMMM DD')
    : null

  const selectedDateWithoutTime = dayjs(selectedDate).format('YYYY-MM-DD')
  const { data: availability, isLoading } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const res = await api.get(`/users/${username}/availability/`, {
        params: { date: selectedDateWithoutTime },
      })
      return res.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay}, <span>{monthAndDay}</span>
          </TimePickerHeader>

          <TimePickerList>
            {isLoading ? (
              <Text size="sm">Loading...</Text>
            ) : (
              availability?.possibleTimes.map((hour, i) => {
                return (
                  <TimePickerItem
                    key={i}
                    onClick={() => console.log(hour)}
                    disabled={!availability.availableTimes.includes(hour)}
                  >
                    {String(hour).padStart(2, '0')}:00h
                  </TimePickerItem>
                )
              })
            )}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
