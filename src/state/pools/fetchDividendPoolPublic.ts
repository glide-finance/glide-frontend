import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import dividendPoolAbi from 'config/abi/dividendPool.json'
import { getDividendPoolAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
// import { BIG_ZERO } from 'utils/bigNumber'
import { getPoolApr } from 'utils/apr'
import { getDividendPoolContract } from 'utils/contractHelpers'

const dividendPoolContract = getDividendPoolContract()

// Hardcoded for stake GLIDE, earn ELA (PID 1)
export const fetchDividendPoolData = async (farms) => {
  try {
  const calls = [
      'remainingRewards',
      'rewardsPerBlock',
      'startBlock'
    ].map((method) => ({
      address: getDividendPoolAddress(),
      name: method,
  }))
  const [[remainingReward], [rewardsPerBlock], [startBlock]] = await multicallv2(dividendPoolAbi, calls)
  const totalStaked = (await dividendPoolContract.poolInfo(0)).currentDepositAmount
  const priceFarm = farms.find((f) => f.pid === 1)
  const { decimals } = priceFarm.quoteToken
  const earningTokenPrice = priceFarm.quoteToken.usdcPrice
  const stakingTokenPrice = priceFarm.token.usdcPrice
  const apr = getPoolApr(stakingTokenPrice, earningTokenPrice, getBalanceNumber(new BigNumber(totalStaked.toString()), 
  decimals), rewardsPerBlock.toString()/(10**decimals))

  return {
    totalStaked: totalStaked.toString(),
    startBlock: startBlock.toString(),
    apr,
    stakingTokenPrice,
    earningTokenPrice,
    remainingReward: remainingReward.toString()
  }
  } catch (error) {
    return {
      totalStaked: null,
      startBlock: null,
      apr: null,
      stakingTokenPrice: null,
      earningTokenPrice: null,
      remainingReward: null
    }
  }
}

export default fetchDividendPoolData
