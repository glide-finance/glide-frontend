// import BigNumber from 'bignumber.js'
import { getPhantzPoolContract, getPhantzV2PoolContract } from 'utils/contractHelpers'

const phantzPoolContract = getPhantzPoolContract()
const phantzV2PoolContract = getPhantzV2PoolContract()

export const fetchPhantzPoolUser = async (account: string) => {
  try {
    const glidePending = (await phantzPoolContract.glideRewards(account)).toString()

    return {
      isLoading: false,
      pendingReward: glidePending,
    }
  } catch (error) {
    return {
      isLoading: true,
      pendingReward: null,
    }
  }
}

export const fetchPhantzV2PoolUser = async (account: string) => {
  try {
    const glidePending = (await phantzV2PoolContract.glideRewards(account)).toString()

    return {
      isLoading: false,
      pendingReward: glidePending,
    }
  } catch (error) {
    return {
      isLoading: true,
      pendingReward: null,
    }
  }
}
