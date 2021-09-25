import React from 'react'
import styled from 'styled-components'
import { Flex } from '@glide-finance/uikit'
// import Footer from 'components/Menu/Footer'
import SubNav from 'components/Menu/SubNav'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  min-height: 100vh;
  background: radial-gradient(40% 55% at 45% 57.5%, #f2ad6c 0%, rgba(242, 173, 108, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%),
    radial-gradient(40% 45% at 55% 47.5%, #48b9ff 0%, rgba(72, 185, 255, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  background-position-y: -13vh;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 12vh;
    min-height: 100vh;
  }
`

const GradientPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <StyledPage {...props}>
      <SubNav />
      {children}
      <Flex flexGrow={1} />
      {/* <Footer /> */}
    </StyledPage>
  )
}

export default GradientPage
