import React from 'react'
import styled from 'styled-components'
import { Card } from '@glide-finance/uikit'

export const GradientWrapper = styled(Card)`
  background: linear-gradient(180deg, rgb(17, 28, 59) 0%, rgb(9, 13, 30) 100%);
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
`

export default function GradientBody({ children }: { children: React.ReactNode }) {
  return <GradientWrapper>{children}</GradientWrapper>
}
