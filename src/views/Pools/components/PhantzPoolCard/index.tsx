// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import {
  CardBody,
  CardHeader,
  Flex,
  Text,
  Heading,
  TooltipText,
  useTooltip,
  Skeleton,
  AutoRenewIcon,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import tokens from 'config/constants/tokens'
import { useDividendPool } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { useAppDispatch } from 'state'
import { fetchWalletNfts } from 'state/collectibles'
import { useGetCollectibles } from 'state/collectibles/hooks'
import AprRow from '../PoolCard/AprRow'
import { StyledCard } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
// import VaultCardActions from './VaultCardActions'
import DividendCardActions from './DividendCardActions'
// import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
// import RecentCakeProfitRow from './RecentCakeProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>``

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  height: 112px;
`
const LoadingContainer = styled.div`
  padding: 16px;
`

const PhantzContainer = styled(Flex)`
  border-radius: 10px;
  padding: 10px;
`

const PhantzCutout = styled.img`
  border-radius: 10px;
  padding-left: 4px;
  padding-right: 4px;
`

interface DividendPoolProps {
  pool: Pool
  showStakedOnly: boolean
}

const PhantzPoolCard: React.FC<DividendPoolProps> = ({ pool, showStakedOnly }) => {
  const { tokenIds, isLoading: isNftLoading } = useGetCollectibles()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const isFinished = false
  const background = 'bubblegum'
  const ownsPhantz = tokenIds.length > 0
  const phantzToShow = tokenIds.length >= 3 ? 3 : tokenIds.length

  const {
    userData: { isLoading, allowance, stakingTokenBalance, stakedBalance, pendingReward },
    apr,
  } = useDividendPool()

  const tooltipContent = t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const dividendPool = {
    ...pool,
    userData: { allowance, stakingTokenBalance, stakedBalance, pendingReward },
    apr,
  }

  const accountHasSharesStaked = stakedBalance && stakedBalance.gt(0)
  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  const handleRefresh = () => {
    dispatch(fetchWalletNfts(account))
  }

  return (
    <StyledCard isActive>
      <Wrapper isFinished={isFinished} background={background}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
              Hold Phantz NFTs
            </Heading>
            <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>Boost your staking rewards!</Text>
          </Flex>
        </Flex>
      </Wrapper>
      {isNftLoading ? (
        <LoadingContainer>
          <Flex alignItems="center" justifyContent="center" mb="8px">
            <Text fontSize="18px" mr="12px">
              Checking for Phantz
            </Text>
            <AutoRenewIcon spin color="currentColor" />
          </Flex>
          <Skeleton height="75px" />
        </LoadingContainer>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="center">
            <Text fontSize="18px" mt="8px">
              {`My Phantz (${phantzToShow} of ${tokenIds.length})`}
            </Text>
          </Flex>
          <PhantzContainer alignItems="center" justifyContent="center">
            {ownsPhantz ? (
              tokenIds.slice(0, phantzToShow).map((token) => {
                return (
                  <Flex key={token.name} flexDirection="column" alignItems="center" justifyContent="center">
                    <PhantzCutout src={`https://ipfs0.trinity-feeds.app/ipfs/${token.asset.split(':')[2]}`} alt="" />
                    <Text>{token.name}</Text>
                  </Flex>
                )
              })
            ) : (
              <Text>No Phantz Found. Pick one up on Feeds!</Text>
            )}
          </PhantzContainer>
        </>
      )}

      <StyledCardBody isLoading={isLoading}>
        <Flex alignItems="center" justifyContent="space-between">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef}>{t('My Boost Level')}</TooltipText>
          {isFinished || !apr ? (
            <Skeleton width="82px" height="32px" />
          ) : (
            <Flex alignItems="center">
              <Text>3 (28.22%)</Text>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef}>{t('My Bonus APR')}</TooltipText>
          {isFinished || !apr ? (
            <Skeleton width="82px" height="32px" />
          ) : (
            <Flex alignItems="center">
              <Text>99%</Text>
            </Flex>
          )}
        </Flex>
        {/* <AprRow pool={dividendPool} /> */}
        <Flex mt="24px" flexDirection="column">
          {account && <DividendCardActions pool={dividendPool} stakedBalance={stakedBalance} />}
        </Flex>
      </StyledCardBody>
      {/* <CardFooter pool={dividendPool} account={account} /> */}
    </StyledCard>
  )
}

export default PhantzPoolCard
