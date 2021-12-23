import BigNumber from 'bignumber.js'
import { getPhantzPoolContract, getCakeContract } from 'utils/contractHelpers'

const phantzPoolContract = getPhantzPoolContract()
const glideContract = getCakeContract()

const fetchPhantzPoolUser = async (account: string) => {
  try {
    // const glideAllowance = (await glideContract.allowance(account, phantzPoolContract.address)).toString()
    // const glideBalance = (await glideContract.balanceOf(account)).toString()
    // const glideStaked = (await glideContract.balanceOf(account)).toString()
    // const glideAllowance = '0'
    // const glideBalance = '0'
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

export default fetchPhantzPoolUser
