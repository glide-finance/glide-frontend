import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Box, CardProps } from '@glide-finance/uikit'

const StyledCard = styled(Card)<{ background: string; rotation?: string }>`
  height: fit-content;
  padding: 1px 1px 4px 1px;
  box-sizing: border-box;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`
const StyledCardBody = styled(CardBody)`
  background: ${({ theme }) => theme.colors.overlay};
`

const GraphicWrapper = styled(Box)<{ rotation?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

interface GraphicCardProps extends GraphicCardData, CardProps {
  children: ReactNode
}

export interface GraphicCardData {
  icon: ReactNode
  background?: string
  borderColor?: string
  rotation?: string
}

const GraphicCard: React.FC<GraphicCardProps> = ({ icon, background, borderColor, rotation, children, ...props }) => {
  return (
    <StyledCard background={background} borderBackground={borderColor} rotation={rotation} {...props}>
      <StyledCardBody>
        <GraphicWrapper rotation={rotation}>{icon}</GraphicWrapper>
        {children}
      </StyledCardBody>
    </StyledCard>
  )
}

export default GraphicCard
