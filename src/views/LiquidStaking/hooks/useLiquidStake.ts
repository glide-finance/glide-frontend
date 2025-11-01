import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useLiquidStaking } from 'hooks/useContract'

export const liquidStake = async (liquidStakingContract, amount, decimals = 18) => {
  const payloadFee = (await liquidStakingContract.receivePayloadFee()).toString()
  // payloadFee added on top of user input. Revisit after exchangeRate update
  const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).plus(new BigNumber(payloadFee)).toString()
  const tx = await liquidStakingContract.deposit({ gasLimit: DEFAULT_GAS_LIMIT, value })
  return tx
}

const useLiquidStake = () => {
  // const dispatch = useAppDispatch()
  // const { account } = useWeb3React()
  const [userApproved, setUserApproved] = useState(false)
  const [userDenied, setUserDenied] = useState(false)
  const [complete, setComplete] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const liquidStakingContract = useLiquidStaking()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      try {
        setPendingTx(true)
        const tx = await liquidStake(liquidStakingContract, amount, 18)
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

  return { userApproved, userDenied, complete, pendingTx, onStake: handleStake }
}

export default useLiquidStake
