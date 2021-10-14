import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex } from '@glide-finance/uikit'
// import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
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

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 65%;
    margin: 0 auto;
  }
`

// const BgWrapper = styled.div`
//   z-index: -1;
//   overflow: hidden;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   bottom: 0px;
//   left: 0px;
// `

// const InnerWrapper = styled.div`
//   position: absolute;
//   width: 100%;
//   bottom: -3px;
// `

const BunnyWrapper = styled.div`
  width: 90%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 4s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const imagePath = '/images/home/rocket/'
const imageSrc = 'rocket1'

const starsImage: CompositeImageProps = {
  path: '/images/home/rocket/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
    { src: 'star-bottom-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  // const { account } = useWeb3React()
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
        <Flex flex={[null, null, null, '1']} mb={['24px']} mt={['10vh']} position="relative">
          <BunnyWrapper>
            <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Glide rocket')} />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </Flex>
      </HomeFlex>
    </>
  )
}

export default Hero
