import { Button, Heading, MultiStep, Text, TextInput } from '@celoco-ui/react'
import { Container, Header, Form, FormError } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: '⚠️ Username is too short' })
      .regex(/^([a-z\\-]+)$/i, {
        message: '⚠️ No numbers or special chars allowed',
      })
      .transform((username) => username.toLowerCase()),

    fullName: z
      .string()
      .min(5, { message: '⚠️ Full name is too short' })
      .regex(/^\s*\S+(\s+\S+)+\s*$/, {
        message: '⚠️ Please enter at least one last name',
      }),
  })
  .strict()

type RegisterFormDataType = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormDataType>({
    resolver: zodResolver(registerFormSchema),
  })

  async function handleRegister(data: RegisterFormDataType) {
    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Welcome to cal.me</Heading>
        <Text>
          We need a few deets to create your profile! But no rush, you can fill
          out these later.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Username</Text>
          <TextInput
            prefix="calme.com/"
            placeholder="your-username"
            {...register('username')}
          />
          {errors.username ? (
            <FormError size="sm">{errors.username.message}</FormError>
          ) : null}
        </label>
        <label>
          <Text size="sm">Full name</Text>
          <TextInput
            placeholder="Johnson McJohnson"
            {...register('fullName')}
          />
          {errors.fullName ? (
            <FormError size="sm">{errors.fullName.message}</FormError>
          ) : null}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
