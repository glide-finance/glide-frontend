import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useLiquidStaking } from 'hooks/useContract'

export const liquidUnstake = async (liquidStakingContract, amount, decimals = 18) => {
  const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()
  const tx = await liquidStakingContract.requestWithdraw(value, { gasLimit: DEFAULT_GAS_LIMIT })
  return tx
}

const useLiquidUnstake = () => {
  const [userApproved, setUserApproved] = useState(false)
  const [userDenied, setUserDenied] = useState(false)
  const [complete, setComplete] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const liquidStakingContract = useLiquidStaking()

  const handleUnstake = useCallback(    
    async (amount: string, decimals: number) => {
      try {
      setPendingTx(true)
      const tx = await liquidUnstake(liquidStakingContract, amount, 18)
      setUserApproved(true)
      const receipt = await tx.wait()
      setPendingTx(false)
      setComplete(true)
      } catch(error: any) {
        if (error?.code === 4001) {
          setUserDenied(true)
          setUserDenied(false)
        }
      }
      // dispatch(updateUserStakedBalance(sousId, account))
      // dispatch(updateUserBalance(sousId, account))
    },
    [liquidStakingContract],
    // [account, dispatch, liquidStakingContract],
  )

  return { userApproved, userDenied, complete, pendingTx, onUnstake: handleUnstake }
}

export default useLiquidUnstake
