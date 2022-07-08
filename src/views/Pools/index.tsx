import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, GradientHeading, Flex, Text, Button } from '@glide-finance/uikit'
// import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import {
  useFetchPublicPoolsData,
  usePools,
  useFetchCakeVault,
  useFetchDividendPool,
  useFetchMaterialPool,
  useFetchPhantzPool,
  useFetchPhantzV2Pool,
  useCakeVault,
  useDividendPool,
  useMaterialPool,
} from 'state/pools/hooks'
import { useGetCollectibles } from 'state/collectibles/hooks'
// import tokens from 'config/constants/tokens'
import { usePollFarmsData } from 'state/farms/hooks'
// import { latinise } from 'utils/latinise'
import { setupNetwork } from 'utils/wallet'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
// import SearchInput from 'components/SearchInput'
// import { OptionProps } from 'components/Select/Select'
// import { Pool } from 'state/types'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import DividendPoolCard from './components/DividendPoolCard'
import MaterialPoolCard from './components/MaterialPoolCard'
import PhantzPoolCard from './components/PhantzPoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
// import HelpButton from './components/HelpButton'
// import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
// import { getAprData, getCakeVaultEarnings } from './helpers'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

// const FilterContainer = styled.div`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   padding: 8px 0px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     width: auto;
//     padding: 0;
//   }
// `

// const LabelWrapper = styled.div`
//   > ${Text} {
//     font-size: 12px;
//   }
// `

// const ControlStretch = styled(Flex)`
//   > div {
//     flex: 1;
//   }
// `

const ConnectContainer = styled(Flex)`
  margin-bottom: 15px;
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account, chainId, library } = useWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'glide_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'glide_pool_view' })
  // const [searchQuery, setSearchQuery] = useState('')
  // const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const {
    userData: { userShares },
  } = useCakeVault()
  const {
    userData: { stakedBalance },
  } = useDividendPool()
  const {
    userData: { materialStakedBalance },
  } = useMaterialPool()

  const accountHasVaultShares = userShares && userShares.gt(0)
  const accountHasDividendPoolStake = stakedBalance && stakedBalance.gt(0)
  const accountHasMaterialPoolStake = materialStakedBalance && materialStakedBalance.gt(0)
  const accountHasPhantzPoolStake = false // account status handled down stream by component
  const accountHasPhantzV2PoolStake = true
  // const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    const dividendPool = poolsWithoutAutoVault.find((pool) => pool.sousId === 1)
    const materialPool = poolsWithoutAutoVault.find((pool) => pool.sousId === 2)
    const phantzPool = poolsWithoutAutoVault.find((pool) => pool.sousId === 3)
    const phantzV2Pool = poolsWithoutAutoVault.find((pool) => pool.sousId === 4)
    const cakeAutoVault = { ...cakePool, isAutoVault: true }
    const cakeDividendPool = { ...dividendPool, isDividendPool: true }
    const materialStakingPool = { ...materialPool, isMaterialPool: true }
    const stakePhantzPool = { ...phantzPool, isPhantzPool: true }
    const stakePhantzV2Pool = { ...phantzV2Pool, isPhantzV2Pool: true }
    return [
      cakeDividendPool,
      cakeAutoVault,
      ...poolsWithoutAutoVault.filter(
        (pool) => pool.sousId !== 1 && pool.sousId !== 2 && pool.sousId !== 3 && pool.sousId !== 4,
      ),
      materialStakingPool,
      stakePhantzPool,
      stakePhantzV2Pool,
    ]
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        if (pool.isDividendPool) {
          return accountHasDividendPoolStake
        }
        if (pool.isMaterialPool) {
          return accountHasMaterialPoolStake
        }
        if (pool.isPhantzPool) {
          return accountHasPhantzPoolStake
        }
        if (pool.isPhantzV2Pool) {
          return accountHasPhantzV2PoolStake
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [
      finishedPools,
      accountHasVaultShares,
      accountHasDividendPoolStake,
      accountHasPhantzPoolStake,
      accountHasPhantzV2PoolStake,
      accountHasMaterialPoolStake,
    ],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        if (pool.isDividendPool) {
          return accountHasDividendPoolStake
        }
        if (pool.isMaterialPool) {
          return accountHasMaterialPoolStake
        }
        if (pool.isPhantzPool) {
          return accountHasPhantzPoolStake
        }
        if (pool.isPhantzV2Pool) {
          return accountHasPhantzV2PoolStake
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [
      openPools,
      accountHasVaultShares,
      accountHasDividendPoolStake,
      accountHasPhantzPoolStake,
      accountHasPhantzV2PoolStake,
      accountHasMaterialPoolStake,
    ],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchDividendPool()
  useFetchMaterialPool()
  useFetchPhantzPool()
  useFetchPhantzV2Pool()
  useFetchCakeVault()
  useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
          }
          return poolsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  // const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value)
  // }

  // const handleSortOptionChange = (option: OptionProps): void => {
  //   setSortOption(option.value)
  // }

  // const sortPools = (poolsToSort: Pool[]) => {
  //   switch (sortOption) {
  //     case 'apr':
  //       // Ternary is needed to prevent pools without APR (like MIX) getting top spot
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
  //         'desc',
  //       )
  //     case 'earned':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => {
  //           if (!pool.userData || !pool.earningTokenPrice) {
  //             return 0
  //           }
  //           return pool.isAutoVault
  //             ? getCakeVaultEarnings(
  //                 account,
  //                 glideAtLastUserAction,
  //                 userShares,
  //                 pricePerFullShare,
  //                 pool.earningTokenPrice,
  //               ).autoUsdToDisplay
  //             : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
  //         },
  //         'desc',
  //       )
  //     case 'totalStaked':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
  //         'desc',
  //       )
  //     default:
  //       return poolsToSort
  //   }
  // }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  // if (searchQuery) {
  //   const lowercaseQuery = latinise(searchQuery.toLowerCase())
  //   chosenPools = chosenPools.filter((pool) =>
  //     latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
  //   )
  // }

  // chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPools = chosenPools.slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    <CardLayout>
      {chosenPools.map((pool) =>
        pool.isDividendPool ? (
          <DividendPoolCard key="dividend-pool" pool={pool} showStakedOnly={stakedOnly} />
        ) : pool.isAutoVault ? (
          <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
        ) : pool.isMaterialPool ? (
          <MaterialPoolCard key="material-pool" pool={pool} showStakedOnly={stakedOnly} />
        ) : pool.isPhantzPool ? (
          <PhantzPoolCard key="phantz-pool" pool={pool} showStakedOnly={stakedOnly} version="V1" />
        ) : pool.isPhantzV2Pool ? (
          <PhantzPoolCard key="phantzV2-pool" pool={pool} showStakedOnly={stakedOnly} version="V2" />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  // const tableLayout = <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <Page>
        <PageHeader>
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <GradientHeading as="h1" scale="xxl" color="glide" mb="24px">
                {t('Sugar Pools')}
              </GradientHeading>
              <Heading scale="lg" color="text">
                {t('Stake tokens to earn')}
              </Heading>
              {/* <Heading scale="md" color="text">
                {t('High APR, low risk.')}
              </Heading> */}
            </Flex>
            <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
              {/* <HelpButton /> */}
              <BountyCard />
            </Flex>
          </Flex>
        </PageHeader>
        <PoolControls>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          {/* <FilterContainer>
            <LabelWrapper>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
            </LabelWrapper>
          </FilterContainer> */}
        </PoolControls>
        {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px" ml="12px">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {chainId !== 20 && (
          <ConnectContainer justifyContent="center">
            <Button
              onClick={() => {
                setupNetwork(20, library)
              }}
            >
              {t('Connect to the Elastos network to begin')}
            </Button>
          </ConnectContainer>
        )}
        {/* {viewMode === ViewMode.CARD ? cardLayout : tableLayout} */}
        {cardLayout}
        <div ref={loadMoreRef} />
        {/* <Image
          mx="auto"
          mt="12px"
          src="/images/decorations/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        /> */}
      </Page>
    </>
  )
}

export default Pools
