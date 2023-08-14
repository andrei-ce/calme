import { Button, Heading, MultiStep, Text, TextInput } from '@celoco-ui/react'
import { Container, Header, Form, FormError } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: '⚠️ Username is too short' })
      .regex(/^([a-z\\-]+)$/i, {
        message: '⚠️ No numbers or special chars allowed',
      })
      .transform((username) => username.toLowerCase()),

    name: z
      .string()
      .min(5, { message: '⚠️ Full name is too short' })
      .regex(/^\s*\S+(\s+\S+)+\s*$/, {
        message: '⚠️ Please enter at least one last name',
      }),
  })
  .strict()

type RegisterFormDataType = z.infer<typeof registerFormSchema>

// COMPONENT //
export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormDataType>({
    resolver: zodResolver(registerFormSchema),
    // defaultValues: {
    //   username: banana // (I could set a default value here too, but now using setValue)
    // }
  })

  const router = useRouter()
  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username)) // query param keys are not unique
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormDataType) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message)
        return
      }
      console.error(error)
    }
  }

  return (
    <>
      <NextSeo
        title="Create an account | Calme"
        description="Use google to create an account and connect to your google calendar."
      />
      <Container>
        <Header>
          <Heading as="strong">Welcome to cal.me</Heading>
          <Text>
            We need a few deets to create your profile! But no rush, you can
            fill out these later.
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
            <TextInput placeholder="Johnson McJohnson" {...register('name')} />
            {errors.name ? (
              <FormError size="sm">{errors.name.message}</FormError>
            ) : null}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Next step
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
