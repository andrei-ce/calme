import { Button, Heading, MultiStep, Text } from '@celoco-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Link, ArrowSquareOut } from 'phosphor-react'
// import { api } from '@/lib/axios'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// COMPONENT //
export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  // async function handleRegister() {}

  async function handleConnectCalendar() {
    await signIn('google')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Connect your calendar</Heading>
        <Text>
          Don&apos;t worry, we will only use this{' '}
          <strong>when you decide to</strong> check for available slots and
          schedule new events on your calendar.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text size="md">Google Calendar</Text>
          {isSignedIn ? (
            <Button variant="primary" size="sm" disabled>
              Connected <Link />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Connect <ArrowSquareOut />
            </Button>
          )}
        </ConnectItem>

        {/* <Text>{JSON.stringify(session.data)}</Text> */}
        {hasAuthError && (
          <AuthError size="sm">
            There was an error trying to connect to Google. Please make sure you
            have enabled the Google Calendar permissions.
          </AuthError>
        )}
        <Button type="submit" disabled={!isSignedIn}>
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}