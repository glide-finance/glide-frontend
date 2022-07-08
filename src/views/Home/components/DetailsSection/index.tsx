import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, GradientHeading, Heading, Link, Button } from '@glide-finance/uikit'
// import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import { getSrcSet } from '../CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-7px, -7px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const flyingAnim2 = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(100px, 16px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const HomeFlex = styled(Flex)`
  padding: 0;
  margin-bottom: 15vh;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 24px;
  }
`
// const GliderFlex = styled(Flex)`
//   width: 164px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     width: 324px;
//   }
// `

const Glider = styled.img`
  width: 164px;
  margin-right: 50%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 324px;
  }
`

const GliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
  
  }

  animation: ${flyingAnim2} 4s ease-in-out infinite;
`

const BunnyWrapper = styled.div`
  width: 90%;
  animation: ${flyingAnim} 4s ease-in-out infinite;
`

const imagePath = '/images/home/details/'
const DetailsSection = () => {
  const { t } = useTranslation()
  // const { account } = useWeb3React()
  // const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <GliderWrapper>
         <Glider src={`${imagePath}glider2.png`} srcSet={getSrcSet(imagePath, 'glider2')} alt={t('Glider')} />
      </GliderWrapper>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <GradientHeading textAlign="center" scale="xl" color="glide" mb="48px">
          {t('Why Glide?')}
        </GradientHeading>
        <HomeFlex
          position="relative"
          flexDirection={['column-reverse', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
        >
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="secondary">
              {t('Elastos Smart Chain')}
            </Heading>
            <Heading scale="md" mb="24px" color="text">
              {t(
                'ESC is a sidechain to the Elastos mainchain that supports Solidity smart contracts. Consensus runs on DPoS to deliver a high-performance, scalable smart contract execution solution for the Elastos ecosystem.',
              )}
            </Heading>
            <Flex>
              <Link external mr="16px" href="https://www.elastos.org/esc/">
                <Button variant="secondary">{t('Learn More')}</Button>
              </Link>
            </Flex>
          </Flex>
          <Flex
            // height={['164px', null, null, '100%']}
            // width={['164px', null, null, '100%']}
            flex={[null, null, null, '1']}
            mb={['24px', null, null, '0']}
            position="relative"
          >
            <BunnyWrapper>
              <img src={`${imagePath}shield.png`} srcSet={getSrcSet(imagePath, 'shield')} alt={t('Shield')} />
            </BunnyWrapper>
          </Flex>
        </HomeFlex>
        <HomeFlex
          position="relative"
          flexDirection={['column', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
        >
          <Flex
            // height={['164px', null, null, '100%']}
            // width={['164px', null, null, '100%']}
            flex={[null, null, null, '1']}
            mb={['24px', null, null, '0']}
            position="relative"
          >
            <BunnyWrapper>
              <img src={`${imagePath}coins.png`} srcSet={getSrcSet(imagePath, 'coins')} alt={t('Coins')} />
            </BunnyWrapper>
          </Flex>
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="secondary">
              {t('Fully Supports $ELA')}
            </Heading>
            <Heading scale="md" mb="24px" color="text">
              {t(
                'Glide was built for Elastos exclusively. 80% of all swap fees on the platform are converted to $ELA and shared with platform users.',
              )}
            </Heading>
            <Flex>
              <Link external mr="16px" href="https://www.elastos.org/">
                <Button variant="secondary">{t('Explore Elastos')}</Button>
              </Link>
            </Flex>
          </Flex>
        </HomeFlex>

        <HomeFlex
          position="relative"
          flexDirection={['column-reverse', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
        >
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="secondary">
              {t('Audited by Paladin')}
            </Heading>
            <Heading scale="md" mb="24px" color="text">
              {t(
                'We take your asset safety seriously, so we had our contracts reviewed by one of the leading security organizations.',
              )}
            </Heading>
            <Flex>
              <Link
                external
                mr="16px"
                href="https://github.com/glide-finance/audits/blob/master/Paladin_Glide_Finance_Final_Report.pdf"
              >
                <Button variant="secondary">{t('Read Now')}</Button>
              </Link>
            </Flex>
          </Flex>
          <Flex
            // height={['164px', null, null, '100%']}
            // width={['164px', null, null, '100%']}
            flex={[null, null, null, '1']}
            mb={['24px', null, null, '0']}
            position="relative"
          >
            <BunnyWrapper>
              <img src={`${imagePath}stamp.png`} srcSet={getSrcSet(imagePath, 'stamp')} alt={t('Audit')} />
            </BunnyWrapper>
          </Flex>
        </HomeFlex>
        <HomeFlex
          position="relative"
          flexDirection={['column', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
        >
          <Flex
            // height={['164px', null, null, '100%']}
            // width={['164px', null, null, '100%']}
            flex={[null, null, null, '1']}
            mb={['24px', null, null, '0']}
            position="relative"
          >
            <BunnyWrapper>
              <img src={`${imagePath}thumb.png`} srcSet={getSrcSet(imagePath, 'thumb')} alt={t('Thumbs up')} />
            </BunnyWrapper>
          </Flex>
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="secondary">
              {t('Fair Launch')}
            </Heading>
            <Heading scale="md" mb="24px" color="text">
              {t('No pre-sale or pre-mine. Equal opportunity for all.')}
            </Heading>
            <Flex>
              <Link external mr="16px" href="https://docs.glidefinance.io/">
                <Button variant="secondary">{t('Tokenomics')}</Button>
              </Link>
            </Flex>
          </Flex>
        </HomeFlex>
      </Flex>
    </>
  )
}

export default DetailsSection
