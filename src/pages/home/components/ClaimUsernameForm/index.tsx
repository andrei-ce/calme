import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormAnnotation } from './styles'
import { TextInput, Button, Text } from '@celoco-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import router from 'next/router'

const claimUsernameFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: '⚠️ Username is too short' })
      .regex(/^([a-z\\-]+)$/i, {
        message: '⚠️ No numbers or special chars allowed',
      })
      .transform((username) => username.toLowerCase()),
  })
  .strict()

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export default function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const isUsernameEmpty = !!watch('username', '').length

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data
    await router.push('/register')
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="calme.com/"
          placeholder="your-username"
          {...register('username')}
        />

        <Button size="sm" type="submit">
          {isUsernameEmpty ? 'Call dibs' : 'Pick a username'}
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : null}
        </Text>
      </FormAnnotation>
    </>
  )
}
