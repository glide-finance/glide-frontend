import React from 'react'
import styled from 'styled-components'
import { Card } from '@glide-finance/uikit'

export const BodyWrapper = styled(Card)`
  margin: 0 auto;
  max-width: 478px;
  width: 100%;
  z-index: 1;
  background: none;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function Body({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
