import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance, useDevBalance, useTreasuryBalance } from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePriceCakeUsdc } from 'state/farms/hooks'
import { Flex, Text, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import { getGlideCurrentEmissions } from 'utils/calls'
import { useBlock } from 'state/block/hooks'
import BigNumber from 'bignumber.js'
// import isArchivedPid from 'utils/farmHelpers'
import { usePoolsPublicData } from 'state/pools/hooks'
import { useProtocolData } from 'state/info/hooks'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
`
//  ${({ noMobileBorder, theme }) =>
//     noMobileBorder
//       ? `${theme.mediaQueries.md} {
//            padding: 0 16px;
//          }
//        `
//       : ` padding: 0 8px;
//          ${theme.mediaQueries.sm} {
//            padding: 0 16px;
//          }
//        `}

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  grid-template-columns: repeat(1, auto);
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
    padding: 0 16px;
    justify-content: space-between;
  }
`
// ${({ theme }) => theme.mediaQueries.sm} {
//   grid-gap: 16px;
// }

const CakeDataRow = () => {
  // function calculateTotalLiquidtyFarms(farms: Farm[]) {
  //   let totalLiquidity = new BigNumber(0)
  //   farms.forEach((farm: Farm) => {
  //     if (!farm.lpTotalInQuoteToken || !farm.quoteToken.usdcPrice) {
  //       return
  //     }
  //     totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.usdcPrice).plus(totalLiquidity)
  //   })
  //   return totalLiquidity
  // }

  function calculateTotalLiquidtyPools(pools: Pool[]) {
    let totalLiquidity = new BigNumber(0)
    pools.forEach((pool: Pool) => {
      if (!pool.stakingTokenPrice || !pool.totalStaked || !pool.stakingToken.decimals) {
        return
      }
      const totalStaked = getBalanceNumber(pool.totalStaked, pool.stakingToken.decimals)
      totalLiquidity = new BigNumber(totalStaked).times(pool.stakingTokenPrice).plus(totalLiquidity)
    })
    return totalLiquidity
  }

  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  // const { data: farmsLP } = useFarms()
  const { pools: poolsPublicData } = usePoolsPublicData()
  const [protocolData] = useProtocolData()

  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const devBalance = getBalanceNumber(useDevBalance(getCakeAddress()))
  const treasuryBalance = getBalanceNumber(useTreasuryBalance(getCakeAddress()))

  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance - devBalance - treasuryBalance : 0
  const cakePriceUsdc = usePriceCakeUsdc()
  const mcap = cakePriceUsdc.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const emissionsPerBlock = getGlideCurrentEmissions(new BigNumber(currentBlock)).toNumber()

  // const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  // const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  // const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  // const totalValueLocked = calculateTotalLiquidtyFarms(activeFarms)
  //   .plus(calculateTotalLiquidtyFarms(inactiveFarms))
  //   .plus(calculateTotalLiquidtyFarms(archivedFarms))
  //   .plus(calculateTotalLiquidtyPools(poolsPublicData))

  const liquidityValue = protocolData ? Math.ceil(protocolData.liquidityUSD) : undefined
  const stakingValue = Math.ceil(calculateTotalLiquidtyPools(poolsPublicData).toNumber())
  const totalValueLocked = liquidityValue + stakingValue

  return (
    <Grid>
      <Flex flexDirection="column">
        {totalValueLocked ? (
          <Balance decimals={2} prefix="$" fontSize="32px" bold value={totalValueLocked} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text fontSize="20px" color="textSubtle">
          {t('Total value locked')}
        </Text>
      </Flex>
      <StyledColumn>
        {cakeSupply ? (
          <Balance decimals={0} fontSize="32px" bold value={cakeSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text fontSize="20px" color="textSubtle">
          {t('Circulating GLIDE')}
        </Text>
      </StyledColumn>
      <StyledColumn>
        {mcap?.gt(0) && mcapString ? (
          <Text fontSize="32px">{t('$%marketCap%', { marketCap: mcapString })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text fontSize="20px" color="textSubtle">
          {t('Market cap')}
        </Text>
      </StyledColumn>
      <StyledColumn>
        <Text fontSize="32px">{t('%cakeEmissions%/block', { cakeEmissions: emissionsPerBlock })}</Text>
        <Text fontSize="20px" color="textSubtle">
          {t('Emission rate')}
        </Text>
      </StyledColumn>
    </Grid>
  )
}

export default CakeDataRow
