import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@glide-finance/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  earningToken: Token
  stakingToken: Token
  pairToken?: Token
  isFinished?: boolean
}> = ({ earningToken, stakingToken, pairToken, isFinished = false }) => {
  const { t } = useTranslation()
  // const background = isStaking ? 'bubblegum' : 'cardHeader'
  const background = 'bubblegum'

  const getHeadingPrefix = () => {
    // all other pools
    return t('Earn')
  }

  const getSubHeading = () => {
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earningToken.symbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
        </Flex>
        {/* <TokenImage token={earningToken} width={64} height={64} /> */}
        <TokenPairImage
          variant="inverted"
          primaryToken={earningToken}
          secondaryToken={pairToken}
          width={80}
          height={80}
        />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
