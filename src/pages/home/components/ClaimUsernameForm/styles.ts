import { Box, Text, styled } from '@celoco-ui/react'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',
  marginTop: '$8',

  // '@media(max-width: 600px)': {
  //   gridTemplateColumns: '1fr',
  // },
})

export const FormAnnotation = styled('div', {
  marginTop: '$2',

  [`> ${Text}`]: {
    color: '$gray400',
  },
})
