import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@celoco-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'

// FORM RELATED
const confirmFormSchema = z.object({
  name: z.string().min(3, { message: 'Name is too short.' }),
  email: z.string().email({ message: 'Please use a valid email.' }),
  notes: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

// COMPONENT SETUP
export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, email, notes } = data
    await api.post(`/users/${username}/schedule`, {
      params: {
        name,
        email,
        notes,
        date: schedulingDate,
      },
    })

    await router.push(`/schedule/${username}`)

    onCancelConfirmation() // this is not a cancellation, it's just to redirect again
  }

  const displayedDate = dayjs(schedulingDate).format('MMMM[ ]DD[, ]YYYY')
  const displayedTime = dayjs(schedulingDate).format('HH:mm[h]')

  // COMPONENT RENDER
  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {displayedDate}
        </Text>
        <Text>
          <Clock />
          {displayedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Full name</Text>
        <TextInput placeholder="Your name" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Email address</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Notes</Text>
        <TextArea {...register('notes')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirm
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
