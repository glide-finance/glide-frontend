import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'
import { getGlidesPerYear } from 'utils/calls'
/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param glidePriceUsd Glide price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  glidePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  currentBlock: number,
): { glideRewardsApr: number; lpRewardsApr: number } => {
  if (currentBlock > 0) {
    const glidesPerYear = getGlidesPerYear(new BigNumber(currentBlock)).times(65).div(100)
    const yearlyGlideRewardAllocation = glidesPerYear.times(poolWeight)
    const glideRewardsApr = yearlyGlideRewardAllocation.times(glidePriceUsd).div(poolLiquidityUsd).times(100)
    let glideRewardsAprAsNumber = null
    if (!glideRewardsApr.isNaN() && glideRewardsApr.isFinite()) {
      glideRewardsAprAsNumber = glideRewardsApr.toNumber()
    }
    const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
    return { glideRewardsApr: glideRewardsAprAsNumber, lpRewardsApr }
  }
  return { glideRewardsApr: 0, lpRewardsApr: 0 }
}

export default null
