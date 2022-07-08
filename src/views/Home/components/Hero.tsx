import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, GradientHeading, Heading, Link, Button } from '@glide-finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'

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

const HomeFlex = styled(Flex)`
  padding: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 24px;
  }
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

// const imagePath = '/images/home/rocket/'
const imagePath = '/images/home/glider/'
const imageSrc = 'glider1'

const butterflyImage: CompositeImageProps = {
  path: '/images/home/glider/',
  attributes: [{ src: 'butterfly', alt: 'Butterfly' }],
}

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <HomeFlex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex flex="1" flexDirection="column" justifyContent="flex-start">
          <GradientHeading scale="xl" mb="24px" color="glide">
            {t('Glide into a new kind of finance')}
          </GradientHeading>
          <Heading scale="md" mb="24px">
            {t('The first native farm and exchange on Elastos')}
          </Heading>
          <Flex>
            {!account && <ConnectWalletButton mr="8px" />}
            <Link mr="16px" href="/swap">
              <Button variant={!account ? 'secondary' : 'primary'}>{t('Trade Now')}</Button>
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
            <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Glider')} />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...butterflyImage} />
          </StarsWrapper>
        </Flex>
      </HomeFlex>
    </>
  )
}

export default Hero
