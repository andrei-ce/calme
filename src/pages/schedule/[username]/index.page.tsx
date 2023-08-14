import { Avatar, Heading, Text } from '@celoco-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Schedule ${user.name} | Calme`} />

      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // req and res are not available here, so we use params
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      // this returns a 404 error (customizable by adding a pages/404.page.tsx file)
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 24h to recache this page
  }
}

// this is needed because we have a dynamic path. It defines to which [username] values we want to build static pages. At build time Next doesn't know what the [username] values are
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // this tells to not pre-generate stactic pages for any users
    fallback: 'blocking', // it will generate static pages as they are hit,
    // fallback "false" throws a 404 for any paths not in paths above

    // fallback "true" is the same as 'blocking' but it will show a loading state where
    // router.isFallback will be true
  }
}
