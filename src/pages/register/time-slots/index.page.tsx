import {
  Heading,
  MultiStep,
  Text,
  Checkbox,
  TextInput,
  Button,
} from '@celoco-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight } from 'phosphor-react'
import {
  TimeSlotBox,
  TimeSlotsContainer,
  SlotItem,
  DayItem,
  TimeIntervalInputs,
  FormError,
} from './styles'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeToMin } from '@/utils/convert-time'
import { api } from '@/lib/axios'

// FORM RELATED //
const timeSlotsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((i) => i.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Please select at least one time slot to set your availability.',
    }) // can't use min or length after transform
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMin: convertTimeToMin(interval.startTime),
          endTimeInMin: convertTimeToMin(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) => interval.endTimeInMin - 15 >= interval.startTimeInMin,
        )
      },
      { message: 'The minimum time slot duration is 15 minutes.' },
    ),
})

// type TimeSlotsFormData = z.infer<typeof timeSlotsFormSchema>
type TimeSlotsFormDataInput = z.input<typeof timeSlotsFormSchema>
type TimeSlotsFormDataOutput = z.output<typeof timeSlotsFormSchema>

// COMPONENT SETUP //
export default function TimeSlotsPicker() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<TimeSlotsFormDataInput, any, TimeSlotsFormDataOutput>({
    resolver: zodResolver(timeSlotsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const { fields } = useFieldArray({
    control, // just to point to useForm
    name: 'intervals',
  })

  const weekDays = getWeekDays()
  const intervals = watch(`intervals`)
  const router = useRouter()

  async function handleSetTimeSlots(data: TimeSlotsFormDataOutput) {
    console.log('handleSetTimeSlots() called')
    const {intervals} = data
   
    await api.post('/users/time-intervals', {intervals})
    await router.push('/register/update-profile')
  }

  // COMPONENT RENDERED //
  return (
    <Container>
      <Header>
        <Heading as="strong">Select your availability</Heading>
        <Text>
          Don&apos;t worry, we will only use this{' '}
          <strong>when you decide to</strong> check for available slots and
          schedule new events on your calendar.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <TimeSlotBox as="form" onSubmit={handleSubmit(handleSetTimeSlots)}>
        <TimeSlotsContainer>
          {fields.map((field, idx) => {
            return (
              <SlotItem key={field.id}>
                <DayItem>
                  {/* register doesn't work on non native HTML inputs, therefore the Controller */}
                  <Controller
                    name={`intervals.${idx}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            // onChange just passes the value to the formState
                            field.onChange(checked)
                          }}
                          checked={field.value}
                        />
                      )
                    }}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </DayItem>
                <TimeIntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    disabled={!intervals[idx].enabled}
                    // step={30}
                    {...register(`intervals.${idx}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    disabled={!intervals[idx].enabled}
                    // step={30}
                    {...register(`intervals.${idx}.endTime`)}
                  />
                </TimeIntervalInputs>
              </SlotItem>
            )
          })}
        </TimeSlotsContainer>
        {errors.intervals ? (
          <FormError size="md">{errors.intervals.message}</FormError>
        ) : null}
        <Button disabled={isSubmitting}>
          Next Step <ArrowRight />
        </Button>
      </TimeSlotBox>
    </Container>
  )
}
