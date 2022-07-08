import React from 'react'
import styled from 'styled-components'
import { Flex, GradientHeading } from '@glide-finance/uikit'
// import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import { getSrcSet } from '../CompositeImage'

const HomeFlex = styled(Flex)`
  padding: 0;
`
const Wrapper = styled.div`
  width: 90%;
`

const imagePath = '/images/home/partners/'
const PartnersSection = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <GradientHeading textAlign="center" scale="xl" color="glide">
        {t('Our Partners')}
      </GradientHeading>
      <HomeFlex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex flex={[null, null, null, '1']} mb={['0', null, null, '0']} position="relative" justifyContent="center">
          <Wrapper>
            <img src={`${imagePath}partners.png`} srcSet={getSrcSet(imagePath, 'partners')} alt={t('Partners')} />
          </Wrapper>
        </Flex>
      </HomeFlex>
    </Flex>
  )
}

export default PartnersSection
