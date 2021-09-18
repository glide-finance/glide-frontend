import { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, Token } from '@glide-finance/sdk'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'
import BigNumber from 'bignumber.js'
import { getBep20Contract } from 'utils/contractHelpers'
import { ethersToBigNumber } from 'utils/bigNumber'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useLastUpdated from 'hooks/useLastUpdated'
import { parseValue, fetchGasPrice } from "../utils/txUtils";

export const useCheckMediatorApprovalStatus = (currency, request, amount) => {
  const [isMediatorApproved, setIsMediatorApproved] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(false)
  const { account, library } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const isToken = currency instanceof Token
    if (!isToken) { setNeedsApproval(false); return }
    if (request === undefined) { setNeedsApproval(false); return }
    const tokenContract = getBep20Contract(currency.address, library.getSigner(account))
    const value = ethers.BigNumber.from(String(parseValue(amount, currency.decimals))).toString();

    const checkApprovalStatus = async () => {
      try {
        const response = await tokenContract.allowance(account, request.contract)
        const currentAllowance = new BigNumber(response.toString())
        // console.log(currentAllowance.toString())
        // console.log(value)
        setNeedsApproval(!currentAllowance.gt(value))
      } catch (error) {
        setNeedsApproval(false)
      }
    }

    checkApprovalStatus()
  }, [currency, request, library, account, lastUpdated, amount])

  // return { isVaultApproved, setLastUpdated }
  return needsApproval
}

export const useApproveMediator = (currency, request, amount) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [approvalComplete, setApprovalComplete] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  // const dispatch = useAppDispatch()
  const { account, library } = useWeb3React()

  const handleApprove = useCallback(async () => {
    const isToken = currency instanceof Token
    if (!isToken) { setRequestedApproval(false); return }
    if (request === undefined) { setRequestedApproval(false); return }
    const tokenContract = getBep20Contract(currency.address, library.getSigner(account))
    const response = (await tokenContract.allowance(account, request.contract))
    const allowance = ethersToBigNumber(response)
    try {
      // if (!allowance.gt(0)) {
        setRequestedApproval(true)
        // const tx = await tokenContract.approve(request.contract, 0)
        const tx = await tokenContract.approve(request.contract, ethers.constants.MaxUint256)
        const receipt = await tx.wait()
        // dispatch(updateUserAllowance(sousId, account))
        if (receipt.status) {
          toastSuccess(
            t('Contract Enabled'),
            t('You can now bridge your %symbol%!', { symbol: currency.symbol }),
          )
          setRequestedApproval(false)
          setApprovalComplete(true)
        } else {
          // user rejected tx or didn't go thru
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          setRequestedApproval(false)
        }
      // } else {
        // setRequestedApproval(false)
      // }
    } catch (e) {
      setRequestedApproval(false)
      console.error(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }, [currency, account, library, request, t, toastError, toastSuccess])

  return { handleApprove, requestedApproval, approvalComplete }
}