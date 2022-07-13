/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { useCallback, useState } from 'react'
import { Token } from '@glide-finance/sdk'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { getTokenSourceMediator, getNativeSourceMediator, getErc677Contract } from 'utils/contractHelpers'
import { useTranslation } from 'contexts/Localization'
import networksUrl from 'config/constants/networks'
import useToast from 'hooks/useToast'
import { VALIDATOR_TIMEOUT } from 'config/constants'
import { getDecimalAmount } from 'utils/formatBalance'
import { callBridgeFaucet } from './useFaucet'
import { fetchGasPrice } from '../utils/txUtils'
import BRIDGE_TOKEN_LIST from '../../../config/constants/tokenLists/glide-bridge.tokenlist.json'

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export const useBridgeMediator = (
  currency,
  amount,
  bridgeType,
  bridgeParams,
  bridgeParamsOtherSide,
  reverseBridgeParams,
  reverseBridgeParamsOtherSide,
  sourceNetwork,
  destNetwork,
) => {
  const [requestedBridgeTransfer, setRequestedBridgeTransfer] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const { account, library } = useWeb3React()

  const handleBridgeTransfer = useCallback(async () => {
    setRequestedBridgeTransfer(true)
    const isToken = currency instanceof Token

    // do coin transfer
    try {
      await coinTransfer(
        currency,
        bridgeParams,
        amount,
        bridgeType,
        reverseBridgeParams,
        reverseBridgeParamsOtherSide,
        account,
        library,
        isToken,
        sourceNetwork,
        destNetwork,
        bridgeParamsOtherSide,
        toastSuccess,
        toastError,
        t,
      )
      setRequestedBridgeTransfer(false)
    } catch (e) {
      setRequestedBridgeTransfer(false)
      console.error(e)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }, [
    currency,
    amount,
    bridgeType,
    bridgeParams,
    bridgeParamsOtherSide,
    reverseBridgeParams,
    reverseBridgeParamsOtherSide,
    account,
    library,
    sourceNetwork,
    destNetwork,
    t,
    toastError,
    toastSuccess,
  ])

  return { handleBridgeTransfer, requestedBridgeTransfer }
}

export const coinTransfer = async function (
  currency: any,
  request: any,
  amount: any,
  bridgeType: string,
  destinationParams: any,
  reverseBridgeParamsOtherSide: any,
  account: any,
  library: any,
  isToken: boolean,
  sourceNetwork: number,
  destNetwork: number,
  destinationParamsOtherSide: any,
  toastSuccess: any,
  toastError: any,
  t: any,
) {
  const destProvider = new ethers.providers.JsonRpcProvider(networksUrl[destNetwork])
  const fromDestBlock = await destProvider.getBlockNumber()
  const from = account
  const recipient = account
  const value = getDecimalAmount(amount, currency.decimals).toString()

  // if token, then call erc677Contract, otherwise nativeSourceMediator
  if (bridgeType === 'token' && isToken) {
    const type = 'relayTokens'

    const mediator = foreignOrigin(currency.address, currency.chainId) ? destinationParams.contract : request.contract
    const tokenDestinationMediator = foreignOrigin(currency.address, currency.chainId)
      ? reverseBridgeParamsOtherSide.contract
      : destinationParamsOtherSide.contract

    const tokenSourceMediator = getNativeSourceMediator(mediator, library.getSigner(account))
    // const minTx = (await tokenSourceMediator.minPerTx()).toString()
    // console.log(minTx)

    const gasPrice = await fetchGasPrice(library.getSigner(account))

    const receiptToken = await tokenSourceMediator['relayTokens(address,address,uint256)'](
      currency.address,
      recipient,
      value,
      {
        from: from,
        gasPrice: gasPrice,
      },
    )

    await receiptToken.wait(1)
    toastSuccess(t('Bridging in process. Awaiting relay from mediator.'))
    if (destNetwork === 20) {
      callBridgeFaucet(receiptToken.hash, type, sourceNetwork, recipient, toastSuccess, toastError, t)
    }

    await detectExchangeFinished(
      account,
      bridgeType,
      sourceNetwork,
      destNetwork,
      tokenDestinationMediator,
      destinationParamsOtherSide,
      receiptToken.hash,
      isToken,
      toastSuccess,
      toastError,
      t,
      fromDestBlock,
    )
  } else if (bridgeType === 'native' && isToken) {
    const type = 'transferAndCall'
    const tokenSourceMediator = getErc677Contract(currency.address, library.getSigner(account))
    const gasPrice = await fetchGasPrice(library.getSigner(account))

    // const mediator = foreignOrigin(currency.address, currency.chainId) ? destinationParams.contract : request.contract
    // const relayer = getNativeSourceMediator(mediator, library.getSigner(account))
    // const minTx = (await relayer.minPerTx()).toString()
    // console.log(minTx)

    const receiptErc677 = await tokenSourceMediator['transferAndCall(address,uint256,bytes)'](
      destinationParams.contract,
      value,
      from,
      {
        from: from,
        gasPrice: gasPrice.toString(),
      },
    )
    await receiptErc677.wait(1)
    toastSuccess(t('Bridging in process. Awaiting relay from mediator.'))
    if (destNetwork === 20) {
      callBridgeFaucet(receiptErc677.hash, type, sourceNetwork, recipient, toastSuccess, toastError, t)
    }

    await detectExchangeFinished(
      account,
      bridgeType,
      sourceNetwork,
      destNetwork,
      reverseBridgeParamsOtherSide.contract,
      destinationParamsOtherSide,
      receiptErc677.hash,
      isToken,
      toastSuccess,
      toastError,
      t,
      fromDestBlock,
    )
  } else {
    const type = 'relayTokens'
    const nativeSourceMediator = getNativeSourceMediator(request.contract, library.getSigner(account))
    // const minTx = (await nativeSourceMediator.minPerTx()).toString()
    // console.log(minTx)

    const receiptNative = await nativeSourceMediator['relayTokens(address)'](recipient, {
      from: from,
      value: value,
    })
    await receiptNative.wait(1)
    toastSuccess(t('Bridging in process. Awaiting relay from mediator.'))
    if (destNetwork === 20) {
      callBridgeFaucet(receiptNative.hash, type, sourceNetwork, recipient, toastSuccess, toastError, t)
    }

    await detectExchangeFinished(
      account,
      bridgeType,
      sourceNetwork,
      destNetwork,
      destinationParamsOtherSide.contract,
      destinationParamsOtherSide,
      receiptNative.hash,
      isToken,
      toastSuccess,
      toastError,
      t,
      fromDestBlock,
    )
  }
}

// detect is destination exchange finished transfer
export const detectExchangeFinished = async function (
  recipient: any,
  bridgeType: string,
  sourceNetwork: number,
  destNetwork: number,
  sourceMediatorContract: string,
  destinationParamsOtherSide: any,
  txID: string,
  isToken: boolean,
  toastSuccess: any,
  toastError: any,
  t: any,
  fromBlock: number,
) {
  const destProvider = new ethers.providers.JsonRpcProvider(networksUrl[destNetwork])
  let sourceMediator
  let tokensBridgedEvent
  let eventAddressArgument

  if (bridgeType === 'native') {
    sourceMediator = getNativeSourceMediator(sourceMediatorContract, destProvider)
    tokensBridgedEvent = ethers.utils.id('TokensBridged(address,uint256,bytes32)')
    eventAddressArgument = 0
  } else {
    sourceMediator = getTokenSourceMediator(sourceMediatorContract, destProvider)
    tokensBridgedEvent = ethers.utils.id('TokensBridged(address,address,uint256,bytes32)')
    eventAddressArgument = 1
  }

  // get when transfer is finished
  const stopTime = Date.now() + VALIDATOR_TIMEOUT
  while (Date.now() <= stopTime) {
    const currentBlock = await destProvider.getBlockNumber()

    const logsNew = await sourceMediator.queryFilter(
      { address: destinationParamsOtherSide.contract, topics: [tokensBridgedEvent] },
      fromBlock,
      currentBlock,
    )

    const confirmationEvent = logsNew.filter((event) => event.args[eventAddressArgument] === recipient)

    if (confirmationEvent.length > 0) {
      toastSuccess(t('Transfer complete! You can now use your assets on the destination network.'))
      return
    }

    if (Date.now() + 177000 < stopTime && Date.now() + 183000 > stopTime) {
      // 2 minutes elapsed, 3 minutes to go
      toastSuccess('Spinning, spinning, spinning...')
    }

    if (Date.now() + 117000 < stopTime && Date.now() + 123000 > stopTime) {
      // 3 minutes elapsed, 2 minutes to go
      toastSuccess('Ugh how long does this take?')
    }

    if (Date.now() + 57000 < stopTime && Date.now() + 63000 > stopTime) {
      // 4 minutes elapsed, 1 minute to go
      toastSuccess("We'll give it one more minute")
    }

    await wait(5000)
  }

  if (Date.now() > stopTime) {
    toastError('Bridge completion event not detected within 5 minutes. Please monitor block explorer for receipt.')
  }
}

export const foreignOrigin = function (address: string, chainId: number) {
  const tokenInfo = BRIDGE_TOKEN_LIST.tokens.filter((token) => token.address === address)[0]
  const { origin } = tokenInfo
  if (origin !== chainId) return true
  return false
}
