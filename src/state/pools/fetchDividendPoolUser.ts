// import BigNumber from 'bignumber.js'
// import { getCakeVaultContract } from 'utils/contractHelpers'
import { getDividendPoolContract, getCakeContract } from 'utils/contractHelpers'

// const cakeVaultContract = getCakeVaultContract()
const dividendPoolContract = getDividendPoolContract()
const glideContract = getCakeContract()

const fetchDividendPoolUser = async (account: string) => {
  try {
    const glideAllowance = (await glideContract.allowance(account, dividendPoolContract.address)).toString()
    const glideBalance = (await glideContract.balanceOf(account)).toString()
    const glideStaked = (await dividendPoolContract.userInfo(account))[0].toString()
    const glidePending = (await dividendPoolContract.pendingRewards(account)).toString()

    return {
      isLoading: false,
      allowance: glideAllowance,
      stakingTokenBalance: glideBalance,
      stakedBalance: glideStaked,
      pendingReward: glidePending,
    }
  } catch (error) {
    return {
      isLoading: true,
      allowance: null,
      stakingTokenBalance: null,
      stakedBalance: null,
      pendingReward: null,
    }
  }
  //   return {
  //     isLoading: false,
  //     userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
  //     lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
  //     lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
  //     glideAtLastUserAction: new BigNumber(userContractResponse.glideAtLastUserAction.toString()).toJSON(),
  //   }
  // } catch (error) {
  //   return {
  //     isLoading: true,
  //     userShares: null,
  //     lastDepositedTime: null,
  //     lastUserActionTime: null,
  //     glideAtLastUserAction: null,
  //   }
  // }
}

export default fetchDividendPoolUser
