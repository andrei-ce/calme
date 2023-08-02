import { styled, Heading, Text } from '@celoco-ui/react'

export const Container = styled('div', {
  marginLeft: 'auto',
  maxWidth: 'calc(100vw - (100vw - 1160px)/2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  gap: '$20',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'block',
    marginTop: '$20',
  },
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`> ${Heading}`]: {
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    // maskType: '$2',
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    height: '85%',
    width: '85%',
    margin: '40px auto',
  },
})
