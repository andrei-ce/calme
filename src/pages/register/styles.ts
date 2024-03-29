import { Box, styled, Text, Heading } from '@celoco-ui/react'

export const Container = styled('main', {
  maxWidth: 572,
  margin: '$10 auto $4',
  padding: '0 $4',
})

export const Header = styled('div', {
  padding: '0 $6',

  [`> ${Heading}`]: {
    lineHeight: '$base',
  },

  [`> ${Text}`]: {
    color: '$gray200',
    marginBottom: '$6',

    ul: {
      padding: '$2 0 $2 $10',
    },
  },
})

export const Form = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  },
})

export const FormError = styled(Text, {
  color: '$red300',
})
