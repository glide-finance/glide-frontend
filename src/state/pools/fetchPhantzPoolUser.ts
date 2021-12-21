// import BigNumber from 'bignumber.js'
// import { getCakeVaultContract } from 'utils/contractHelpers'
import { getDividendPoolContract, getCakeContract } from 'utils/contractHelpers'

// const cakeVaultContract = getCakeVaultContract()
const dividendPoolContract = getDividendPoolContract()
const glideContract = getCakeContract()

const fetchPhantzPoolUser = async (account: string) => {
  try {
    const glideAllowance = (await glideContract.allowance(account, dividendPoolContract.address)).toString()
    const glideBalance = (await glideContract.balanceOf(account)).toString()
    const glideStaked = (await dividendPoolContract.userInfo(account))[0].toString()
    const glidePending = (await dividendPoolContract.pendingRewards(account)).toString()

    return {
      isLoading: false,
      allowance: glideAllowance,
      stakingTokenBalance: glideBalance,
      phantzStakedBalance: glideStaked,
      pendingReward: glidePending,
    }
  } catch (error) {
    return {
      isLoading: true,
      allowance: null,
      stakingTokenBalance: null,
      phantzStakedBalance: null,
      pendingReward: null,
    }
  }
}

export default fetchPhantzPoolUser
