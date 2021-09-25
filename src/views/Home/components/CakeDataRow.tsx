import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { Farm, Pool } from 'state/types'
import Balance from 'components/Balance'
import {getGlideCurrentEmissions} from 'utils/calls'
import { useBlock } from 'state/block/hooks'
import BigNumber from 'bignumber.js'
import isArchivedPid from 'utils/farmHelpers'
import {
  usePoolsPublicData
} from 'state/pools/hooks'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`


const CakeDataRow = () => {

  function calculateTotalLiquidtyFarms(farms: Farm[]) {
    let totalLiquidity = new BigNumber(0);
    farms.forEach( (farm: Farm) => {
      if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
        return;
      }
      totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice).plus(totalLiquidity);
    });
    return totalLiquidity;
  }

  function calculateTotalLiquidtyPools(pools: Pool[]) {
    let totalLiquidity = new BigNumber(0);
    pools.forEach( (pool: Pool) => {
      if (!pool.stakingTokenPrice || !pool.totalStaked || !pool.stakingToken.decimals) {
        return;
      }
      const totalStaked = getBalanceNumber(pool.totalStaked, pool.stakingToken.decimals)
      totalLiquidity = new BigNumber(totalStaked).times(pool.stakingTokenPrice).plus(totalLiquidity);
    });
    return totalLiquidity;
  }
  
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const { data: farmsLP } = useFarms()
  const { pools: poolsPublicData } = usePoolsPublicData()

  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const cakePriceBusd = usePriceCakeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const emissionsPerBlock = getGlideCurrentEmissions(new BigNumber(currentBlock)).toNumber();

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const totalValueLocked = calculateTotalLiquidtyFarms(activeFarms)
    .plus(calculateTotalLiquidtyFarms(inactiveFarms))
    .plus(calculateTotalLiquidtyFarms(archivedFarms))
    .plus(calculateTotalLiquidtyPools(poolsPublicData))

  return (
    <Grid>
      <Flex flexDirection="column">
        <Text color="textSubtle">{t('Total Value Locked')}</Text>
            {totalValueLocked ? (
              <Heading scale="lg">{t('$%tvl%', { tvl: totalValueLocked.toNumber().toFixed(2) })}</Heading>
            ) : (
              <Skeleton height={24} width={126} my="4px" />
            )}
      </Flex>
      <StyledColumn>
        <Text color="textSubtle">{t('Market cap')}</Text>
          {mcap?.gt(0) && mcapString ? (
            <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Circulating GLIDE')}</Text>
        {cakeSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Emission rate')}</Text>

        <Heading scale="lg">{t('%cakeEmissions%/block', { cakeEmissions: emissionsPerBlock })}</Heading>
      </StyledColumn>
    </Grid>
  )
}

export default CakeDataRow
