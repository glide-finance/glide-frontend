import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDividendPoolContract, getCakeContract } from 'utils/contractHelpers'
import { getTokenPricesFromFarm } from './helpers'

const glideContract = getCakeContract()
const dividendPoolContract = getDividendPoolContract()

  // totalStaked?: BigNumber
  // stakingLimit?: BigNumber
  // startBlock?: number
  // endBlock?: number
  // apr?: number
  // stakingTokenPrice?: number
  // earningTokenPrice?: number
  // isAutoVault?: boolean
  // isDividendPool?: boolean
  // userData?: DividendUser

export const fetchDividendPoolData = async () => {
  // const blockLimits = await fetchPoolsBlockLimits()
  const totalStaked = (await dividendPoolContract.poolInfo(0)).currentDepositAmount.toString()
  const startBlock = (await dividendPoolContract.startBlock()).toString()

  // const prices = getTokenPricesFromFarm(getState().farms.data)
  const apr = 222
  const stakingTokenPrice = 0.1
  const earningTokenPrice = 3

  // const liveData = poolsConfig.map((pool) => {
  //   const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
  //   const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
  //   const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
  //   const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

  //   const stakingTokenAddress = pool.stakingToken.address ? getAddress(pool.stakingToken.address).toLowerCase() : null
  //   const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

  //   const earningTokenAddress = pool.earningToken.address ? getAddress(pool.earningToken.address).toLowerCase() : null
  //   const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
  //   const apr = !isPoolFinished
  //     ? getPoolApr(
  //         stakingTokenPrice,
  //         earningTokenPrice,
  //         getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
  //         parseFloat(pool.tokenPerBlock),
  //       )
  //     : 0

  //   return {
  //     ...blockLimit,
  //     ...totalStaking,
  //     stakingTokenPrice,
  //     earningTokenPrice,
  //     apr,
  //     isFinished: isPoolFinished,
  //   }
  // })

  return {
    totalStaked,
    startBlock,
    apr,
    stakingTokenPrice,
    earningTokenPrice
  }
}



// export const fetchDividendPoolData = async () => {
//   try {
//     const calls = [
//       'getPricePerFullShare',
//       'totalShares',
//       'calculateHarvestGlideRewards',
//       'calculateTotalPendingGlideRewards',
//     ].map((method) => ({
//       address: getCakeVaultAddress(),
//       name: method,
//     }))

//     const [[sharePrice], [shares], [estimatedCakeBountyReward], [totalPendingCakeHarvest]] = await multicallv2(
//       cakeVaultAbi,
//       calls,
//     )

//     const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
//     const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
//     const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
//     return {
//       totalShares: totalSharesAsBigNumber.toJSON(),
//       pricePerFullShare: sharePriceAsBigNumber.toJSON(),
//       totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber.toJSON(),
//       estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward.toString()).toJSON(),
//       totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest.toString()).toJSON(),
//     }
//   } catch (error) {
//     return {
//       totalShares: null,
//       pricePerFullShare: null,
//       totalCakeInVault: null,
//       estimatedCakeBountyReward: null,
//       totalPendingCakeHarvest: null,
//     }
//   }
// }

export default fetchDividendPoolData
