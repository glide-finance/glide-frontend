import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { useStela, useLiquidStaking } from 'hooks/useContract'
import useToast from 'hooks/useToast'

// Approve stELA for liquid staking contract
export const useLiquidStakingApprove = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [approvalComplete, setApprovalComplete] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const liquidStakingContract = useLiquidStaking()
  const stelaContract = useStela()

  const handleApprove = async () => {
    const tx = await stelaContract.approve(liquidStakingContract.address, ethers.constants.MaxUint256)
    setRequestedApproval(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Contract Enabled'), t('You can now return %symbol% to the liquid staking contract.', { symbol: 'stELA' }))
      setRequestedApproval(false)
      setApprovalComplete(true)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setRequestedApproval(false)
    }
  }

  return { handleApprove, requestedApproval, approvalComplete }
}

export const useCheckApprovalStatus = (unstakeAmount: string) => {
  const [isLiquidStakingApproved, setIsLiquidStakingApproved] = useState(false)
  const { account } = useWeb3React()
  const stelaContract = useStela()
  const liquidStakingContract = useLiquidStaking()
  // const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await stelaContract.allowance(account, liquidStakingContract.address)
        const currentAllowance = new BigNumber(response.toString())
        const requiredAllowance = new BigNumber(unstakeAmount.toString()).times(BIG_TEN.pow(18))
        setIsLiquidStakingApproved(currentAllowance.gte(requiredAllowance))
      } catch (error) {
        setIsLiquidStakingApproved(false)
      }
    }

    checkApprovalStatus()
  }, [account, unstakeAmount, stelaContract, liquidStakingContract])

  return { isLiquidStakingApproved }
}

// export const useStelaSupply = () => {
//   const [stelaSupply, setStelaSupply] = useState('0')
//   const stelaContract = useStela()
//   const liquidStakingContract = useLiquidStaking()

//   useEffect(() => {
//     const checkApprovalStatus = async () => {
//       try {
//         const response = await stelaContract.totalSupply()
//         setStelaSupply(response.toString())
//       } catch (error) {
//         setStelaSupply('0')
//       }
//     }

//     checkApprovalStatus()
//   }, [stelaContract])

//   return { stelaSupply }
// }