import React from 'react'
import styled from 'styled-components'
import { Flex } from '@glide-finance/uikit'
// import Footer from 'components/Menu/Footer'
import SubNav from 'components/Menu/SubNav'
// import { useTranslation } from 'contexts/Localization'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  min-height: 100vh;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 10vh;
    min-height: 100vh;
    background: radial-gradient(40% 55% at 45% 57.5%, #f2ad6c 0%, rgba(242, 173, 108, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%),
      radial-gradient(40% 45% at 55% 47.5%, #48b9ff 0%, rgba(72, 185, 255, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%);
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    background-position-y: -8vh;
  }
`
// const LaunchWarning = styled(Flex)`
//   border: 1px solid ${({ theme }) => theme.colors.primary};
//   border-radius: 16px;
//   margin-bottom: 20px;
//   padding: 16px;
//   max-width: 436px;
//   width: 100%;
// `

const GradientPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  // const { t } = useTranslation()

  return (
    <StyledPage {...props}>
      {/* <LaunchWarning>
        <Text bold color="primary">
          {t(
            'The GLIDE supply is limited due to fair launch! Volatility will be high for a few days. Play safe!',
          )}
        </Text>
      </LaunchWarning> */}
      <SubNav />
      {children}
      <Flex flexGrow={1} />
      {/* <Footer /> */}
    </StyledPage>
  )
}

export default GradientPage
