import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import materialPoolAbi from 'config/abi/materialPool.json'
import { getMaterialPoolAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
// import { BIG_ZERO } from 'utils/bigNumber'
import { getPoolApr } from 'utils/apr'
import { getMaterialPoolContract } from 'utils/contractHelpers'

const materialPoolContract = getMaterialPoolContract()

// Hardcoded for stake MTRL, earn MTRL (PID 8)
export const fetchMaterialPoolData = async (farms) => {
  try {
    const calls = ['remainingRewards', 'rewardsPerBlock', 'startBlock'].map((method) => ({
      address: getMaterialPoolAddress(),
      name: method,
    }))
    const [[remainingReward], [rewardsPerBlock], [startBlock]] = await multicallv2(materialPoolAbi, calls)
    const totalStaked = (await materialPoolContract.poolInfo(0)).currentDepositAmount
    const priceFarm = farms.find((f) => f.pid === 8)
    const { decimals } = priceFarm.quoteToken
    const earningTokenPrice = priceFarm.token.usdcPrice
    const stakingTokenPrice = priceFarm.token.usdcPrice
    const apr = getPoolApr(
      stakingTokenPrice,
      earningTokenPrice,
      getBalanceNumber(new BigNumber(totalStaked.toString()), decimals),
      rewardsPerBlock.toString() / 10 ** decimals,
    )

    return {
      totalStaked: totalStaked.toString(),
      startBlock: startBlock.toString(),
      apr,
      stakingTokenPrice,
      earningTokenPrice,
      remainingReward: remainingReward.toString(),
    }
  } catch (error) {
    return {
      totalStaked: null,
      startBlock: null,
      apr: null,
      stakingTokenPrice: null,
      earningTokenPrice: null,
      remainingReward: null,
    }
  }
}

export default fetchMaterialPoolData
