import { styled, Box, Text } from '@celoco-ui/react'

export const TimeSlotBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
})

export const TimeSlotsContainer = styled('div', {
  border: '1px solid $gray600',
  borderRadius: '$md',
  marginBottom: '$4',
})

export const SlotItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$3 $4',

  // this applies only to SlotItems that have SlotItems before them
  '& + &': {
    borderTop: '1px solid $gray600',
  },
})

export const DayItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const TimeIntervalInputs = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  'input::-webkit-calendar-picker-indicator': {
    filter: 'invert(100%) brightness(50%)',
  },
})

export const FormError = styled(Text, {
  color: '$red300',
  marginBottom: '$4',
})
