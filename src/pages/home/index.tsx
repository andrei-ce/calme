import { Heading, Text } from '@celoco-ui/react'
import { Container, Hero, Preview } from './styles'
import Image from 'next/image'

import previewImg from '../../assets/calme_home.jpg'
import ClaimUsernameForm from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Untangle your calendar | Calme"
        description="Connect your calendar and let people book slots in your available
        time."
      />

      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Easy scheduling
          </Heading>
          <Text size="xl">
            Connect your calendar and let people book slots in your available
            slots.
          </Text>
          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImg}
            height={400}
            quality={100} // by default images are rendered at 80% quality
            priority // by default images are rendered last
            alt="Monthly calendar showcasing application running"
          ></Image>
        </Preview>
      </Container>
    </>
  )
}
