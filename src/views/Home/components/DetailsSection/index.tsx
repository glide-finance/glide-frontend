import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, GradientHeading, Heading, Link, Button } from '@glide-finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from '../CompositeImage'

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

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`

const HomeFlex = styled(Flex)`
  padding: 0;
  margin-bottom: 15vh;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 24px;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 90%;
  animation: ${flyingAnim} 4s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${flyingAnim} 2s ease-in-out infinite;
`

const imagePath = '/images/home/details/'
const imageSrc = 'stamp'

const butterflyImage: CompositeImageProps = {
  path: '/images/home/glider/',
  attributes: [{ src: 'butterfly', alt: 'Butterfly' }],
}

const DetailsSection = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <GradientHeading textAlign="center" scale="xl" color="glide" mb="32px">
          {t('Why Glide?')}
        </GradientHeading>
        <HomeFlex
          position="relative"
          flexDirection={['column-reverse', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
        >
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="primary">
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
            {/* <StarsWrapper>
            <CompositeImage {...butterflyImage} />
          </StarsWrapper> */}
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
            {/* <StarsWrapper>
            <CompositeImage {...butterflyImage} />
          </StarsWrapper> */}
          </Flex>
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="primary">
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
            <Heading scale="xl" mb="24px" color="primary">
              {t('Audited by Paladin')}
            </Heading>
            <Heading scale="md" mb="24px" color="text">
              {t(
                `We take your asset safety seriously, so we had our contracts reviewed by one of the leading security organizations`,
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
            {/* <StarsWrapper>
            <CompositeImage {...butterflyImage} />
          </StarsWrapper> */}
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
            {/* <StarsWrapper>
            <CompositeImage {...butterflyImage} />
          </StarsWrapper> */}
          </Flex>
          <Flex flex="1" flexDirection="column" justifyContent="flex-start">
            <Heading scale="xl" mb="24px" color="primary">
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
