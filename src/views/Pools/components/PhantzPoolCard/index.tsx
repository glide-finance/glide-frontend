// @ts-nocheck
import React from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
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
  LinkExternal,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import tokens from 'config/constants/tokens'
import { usePhantzPool, useCakeVault, usePools } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { useAppDispatch } from 'state'
// import { fetchWalletNfts } from 'state/collectibles'
import { useGetCollectibles } from 'state/collectibles/hooks'
// import AprRow from '../PoolCard/AprRow'
import { StyledCard } from '../PoolCard/StyledCard'
// import CardFooter from '../PoolCard/CardFooter'
// import StyledCardHeader from '../PoolCard/StyledCardHeader'
import PhantzCardActions from './PhantzCardActions'
import { convertSharesToCake } from '../../helpers'

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

interface PhantzPoolProps {
  pool: Pool
  showStakedOnly: boolean
  version: string
}

const BOOSTS = {
  0: 0,
  1: 0.07,
  2: 0.14,
  3: 0.2822,
}

const PhantzPoolCard: React.FC<PhantzPoolProps> = ({ pool, showStakedOnly, version }) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { tokenIds, isLoading: isNftLoading } = useGetCollectibles()
  const { pools, userDataLoaded } = usePools(account)
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useCakeVault()
  const { cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)
  const isFinished = false
  const background = 'bubblegum'

  let ownsPhantz = isNftLoading ? 0 : tokenIds.phantzV1.length > 0
  let phantzToShow = ownsPhantz ? (tokenIds.phantzV1.length >= 3 ? 3 : tokenIds.phantzV1.length) : 0
  if (version === 'V2') {
    ownsPhantz = isNftLoading ? 0 : tokenIds.phantzV2.length > 0
    phantzToShow = ownsPhantz ? (tokenIds.phantzV2.length >= 3 ? 3 : tokenIds.phantzV2.length) : 0
  }

  const boost = BOOSTS[phantzToShow]

  const manual = pools.find((stakingPool) => stakingPool.sousId === 0)
  const manualStakedBalance = manual?.userData
    ? new BigNumber(manual.userData.stakedBalance).dividedBy(BIG_TEN.pow(18)).toString()
    : 0
  const bonusAPR = (parseFloat(manual?.apr) * boost).toFixed(2)
  const totalStaked = (parseFloat(cakeAsNumberBalance) + parseFloat(manualStakedBalance)).toFixed(0)

  const {
    userData: { isLoading, allowance, stakingTokenBalance, phantzStakedBalance, pendingReward },
  } = usePhantzPool(version === 'V2' ? 'phantzV2Pool' : 'phantzPool')

  // const {
  //   userData: { isLoading, allowance, stakingTokenBalance, phantzStakedBalance, pendingReward },
  // } = usePhantzV2Pool()

  const tooltipContent1 = t(
    `Holding Phantz in your wallet can boost your staking rewards. 1 Phantz = 7%, 2 Phantz = 14%, 3+ Phantz = 28.22%`,
  )
  const tooltipContent2 = t(
    'Total GLIDE staked. Boost only applies to GLIDE staked in Manual GLIDE and Auto GLIDE pools',
  )
  const tooltipContent3 = t('Your GLIDE staking APR boost for holding Phantz')

  const {
    targetRef: targetRef1,
    tooltip: tooltip1,
    tooltipVisible: visible1,
  } = useTooltip(tooltipContent1, { placement: 'bottom-start' })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: visible2,
  } = useTooltip(tooltipContent2, { placement: 'bottom-start' })
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: visible3,
  } = useTooltip(tooltipContent3, { placement: 'bottom-start' })

  const phantzPool = {
    ...pool,
    userData: { allowance, stakingTokenBalance, phantzStakedBalance, pendingReward },
  }

  const accountHasSharesStaked = ownsPhantz && totalStaked > 0
  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  // const handleRefresh = () => {
  //   dispatch(fetchWalletNfts(account))
  // }

  return (
    <StyledCard isActive>
      <Wrapper isFinished={isFinished} background={background}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
              Hold Phantz Club NFTs
            </Heading>
            <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>Boost your staking rewards!</Text>
          </Flex>
        </Flex>
      </Wrapper>
      {isNftLoading ? (
        <LoadingContainer>
          <Flex alignItems="center" justifyContent="center" mb="8px">
            <Text fontSize="16px" mr="12px">
              {version === 'V2' ? 'Checking for Phantz V1' : 'Checking for Phantz V2'}
            </Text>
            <AutoRenewIcon spin color="currentColor" />
          </Flex>
          <Skeleton height="75px" />
        </LoadingContainer>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="center">
            <Text fontSize="18px" mt="8px">
              {version === 'V2'
                ? `My Phantz (${phantzToShow} of ${tokenIds.phantzV2.length}) - ela.city`
                : `My Phantz (${phantzToShow} of ${tokenIds.phantzV1.length}) - Feeds`}
              {version === 'V1' && phantzToShow > 0 && (
                <Flex alignItems="center" justifyContent="center">
                  <LinkExternal fontSize="14px" ml="6px" mr="6px" href="https://master.d3o588u45vsdnd.amplifyapp.com/">
                    Swap to V2 here!
                  </LinkExternal>
                </Flex>
              )}
            </Text>
          </Flex>
          <PhantzContainer alignItems="center" justifyContent="center">
            {version === 'V2' ? (
              ownsPhantz ? (
                tokenIds.phantzV2.slice(0, phantzToShow).map((token) => {
                  return (
                    <Flex key={token.name} flexDirection="column" alignItems="center" justifyContent="center">
                      <PhantzCutout src={token.imageURL} alt="" />
                      <Text>{token.name}</Text>
                    </Flex>
                  )
                })
              ) : (
                <Flex flexDirection="row" alignItems="center" justifyContent="space-around">
                  <PhantzCutout
                    src="https://ipfs.ela.city/ipfs/QmeLbZoZpJ1ErerfHNZT8vNtQbwqy8VrEQPpPBBx6VrUQP/Ph-0029.jpg"
                    alt=""
                    width="20%"
                  />
                  <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
                    <Text fontSize="14px" ml="6px" mr="6px">
                      No Phantz?
                    </Text>
                    <LinkExternal
                      fontSize="14px"
                      ml="6px"
                      mr="6px"
                      href="https://ela.city/marketplace/collections/0xfdde60866508263e30c769e8592bb0f8c3274ba7"
                    >
                      ela.city Marketplace
                    </LinkExternal>
                    <LinkExternal fontSize="14px" ml="6px" mr="6px" href="https://phantzclub.com/">
                      phantzclub.com
                    </LinkExternal>
                  </Flex>
                  <PhantzCutout
                    src="https://ipfs.ela.city/ipfs/QmeLbZoZpJ1ErerfHNZT8vNtQbwqy8VrEQPpPBBx6VrUQP/Ph-0202.jpg"
                    alt=""
                    width="20%"
                  />
                </Flex>
              )
            ) : ownsPhantz ? (
              tokenIds.phantzV1.slice(0, phantzToShow).map((token) => {
                return (
                  <Flex key={token.name} flexDirection="column" alignItems="center" justifyContent="center">
                    <PhantzCutout
                      src={
                        token.version !== '1'
                          ? `https://ipfs0.trinity-feeds.app/ipfs/${token.data.image.split(':')[2]}`
                          : `https://ipfs0.trinity-feeds.app/ipfs/${token.asset.split(':')[2]}`
                      }
                      alt=""
                    />
                    <Text>{token.name}</Text>
                  </Flex>
                )
              })
            ) : (
              <Flex flexDirection="row" alignItems="center" justifyContent="space-around">
                <PhantzCutout
                  src="https://ipfs0.trinity-feeds.app/ipfs/QmR7RxxTjETkD7QhfJpt1XMukR7uaRLV49PppwSEGqrJmr"
                  alt=""
                  width="20%"
                />
                <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
                  <Text fontSize="14px" ml="6px" mr="6px">
                    No Phantz?
                  </Text>
                  <LinkExternal fontSize="14px" ml="6px" mr="6px" href="https://trinity-feeds.app/">
                    Feeds Marketplace
                  </LinkExternal>
                  <LinkExternal fontSize="14px" ml="6px" mr="6px" href="https://phantzclub.com/">
                    phantzclub.com
                  </LinkExternal>
                </Flex>
                <PhantzCutout
                  src="https://ipfs0.trinity-feeds.app/ipfs/QmfPCmSDpDSJWdtNdfWyWgvX9H6ggFeDPjyvqtCSCJndK2"
                  alt=""
                  width="20%"
                />
              </Flex>
            )}
          </PhantzContainer>
        </>
      )}

      <StyledCardBody isLoading={isLoading}>
        <Flex alignItems="center" justifyContent="space-between">
          {visible1 && tooltip1}
          <TooltipText ref={targetRef1}>{t('My Boost Level')}</TooltipText>
          {isFinished ? (
            <Skeleton width="82px" height="32px" />
          ) : (
            <Flex alignItems="center">
              <Text>{`${phantzToShow} (${(boost * 100).toFixed(2)}%)`}</Text>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          {visible2 && tooltip2}
          <TooltipText ref={targetRef2}>{t('My Total Stake')}</TooltipText>
          {isFinished ? (
            <Skeleton width="82px" height="32px" />
          ) : (
            <Flex alignItems="center">
              <Text>{`${totalStaked} GLIDE`}</Text>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          {visible3 && tooltip3}
          <TooltipText ref={targetRef3}>{t('My Bonus APR')}</TooltipText>
          {isFinished ? (
            <Skeleton width="82px" height="32px" />
          ) : (
            <Flex alignItems="center">
              <Text>{`${bonusAPR}%`}</Text>
            </Flex>
          )}
        </Flex>
        {/* <AprRow pool={phantzPool} /> */}
        <Flex mt="24px" flexDirection="column">
          {account && <PhantzCardActions pool={phantzPool} stakedBalance={phantzStakedBalance} />}
        </Flex>
      </StyledCardBody>
    </StyledCard>
  )
}

export default PhantzPoolCard
