// import BigNumber from 'bignumber.js'
// import { getCakeVaultContract } from 'utils/contractHelpers'
import { getMaterialPoolContract, getMaterialContract } from 'utils/contractHelpers'

// const cakeVaultContract = getCakeVaultContract()
const materialPoolContract = getMaterialPoolContract()
const glideContract = getMaterialContract()

const fetchMaterialPoolUser = async (account: string) => {
  try {
    const glideAllowance = (await glideContract.allowance(account, materialPoolContract.address)).toString()
    const glideBalance = (await glideContract.balanceOf(account)).toString()
    const glideStaked = (await materialPoolContract.userInfo(account))[0].toString()
    const glidePending = (await materialPoolContract.pendingRewards(account)).toString()

    return {
      isLoading: false,
      allowance: glideAllowance,
      stakingTokenBalance: glideBalance,
      materialStakedBalance: glideStaked,
      pendingReward: glidePending,
    }
  } catch (error) {
    return {
      isLoading: true,
      allowance: null,
      stakingTokenBalance: null,
      materialStakedBalance: null,
      pendingReward: null,
    }
  }
}

export default fetchMaterialPoolUser
