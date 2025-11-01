import { useCallback, useState } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useLiquidStaking } from 'hooks/useContract'

export const liquidWithdraw = async (liquidStakingContract, amount) => {
  const tx = await liquidStakingContract.withdraw(amount, { gasLimit: DEFAULT_GAS_LIMIT })
  return tx
}

const useLiquidWithdraw = () => {
  // const dispatch = useAppDispatch()
  // const { account } = useWeb3React()
  const [userApproved, setUserApproved] = useState(false)
  const [userDenied, setUserDenied] = useState(false)
  const [complete, setComplete] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const liquidStakingContract = useLiquidStaking()

  const handleWithdraw = useCallback(
    async (amount: string, decimals: number) => {
      try {
        setPendingTx(true)
        const tx = await liquidWithdraw(liquidStakingContract, amount)
        setUserApproved(true)
        const receipt = await tx.wait()
        setPendingTx(false)
        setComplete(true)
      } catch (error: any) {
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

  return { userApproved, userDenied, complete, pendingTx, onWithdraw: handleWithdraw }
}

export default useLiquidWithdraw
