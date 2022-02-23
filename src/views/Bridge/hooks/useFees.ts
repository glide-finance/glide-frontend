/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BRIDGE_FAUCET_API } from 'config/constants/endpoints'

export const useCheckFees = (currency, bridgeParams, reverseBridgeParams) => {
  const [minTx, setMinTx] = useState(0)
  const { account, library } = useWeb3React()
  // const { lastUpdated } = useLastUpdated()

  // useEffect(() => {
  //   const isToken = currency instanceof Token
  //   if (!isToken) {
  //     setNeedsApproval(false)
  //     return
  //   }
  //   if (request === undefined) {
  //     setNeedsApproval(false)
  //     return
  //   }
  //   const tokenContract = getBep20Contract(currency.address, library.getSigner(account))
  //   const mediator = foreignOrigin(currency.address, currency.chainId)
  //     ? reverseBridgeParams.contract
  //     : bridgeParams.contract

  //   const checkApprovalStatus = async () => {
  //     try {
  //       const response = await tokenContract.allowance(account, mediator)
  //       const currentAllowance = new BigNumber(response.toString())
  //       const value = new BigNumber(parseValue(amount, currency.decimals).toString())
  //       setNeedsApproval(!currentAllowance.gt(value))
  //     } catch (error) {
  //       setNeedsApproval(false)
  //     }
  //   }

  //   checkApprovalStatus()
  // }, [currency, bridgeParams, library, account, lastUpdated, reverseBridgeParams])

  return minTx
}
