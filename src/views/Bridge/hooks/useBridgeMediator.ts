/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { useCallback, useState } from 'react'
import { Token } from '@glide-finance/sdk'
import { useWeb3React } from '@web3-react/core'
import { ethers} from 'ethers'
import { getTokenSourceMediator, getNativeSourceMediator, getErc677Contract } from 'utils/contractHelpers'
import { useTranslation } from 'contexts/Localization'
import  networksUrl from 'config/constants/networks'
import useToast from 'hooks/useToast'
import { VALIDATOR_TIMEOUT } from 'config/constants'
import { callBridgeFaucet } from "./useFaucet";
import { parseValue, fetchGasPrice } from "../utils/txUtils";


const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export const useBridgeMediator = (currency, amount, bridgeType,
    bridgeParams, bridgeParamsOtherSide, 
    reverseBridgeParams, reverseBridgeParamsOtherSide,
    sourceNetwork, destNetwork) => {
  const [requestedBridgeTransfer, setRequestedBridgeTransfer] = useState(false);
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const { account, library } = useWeb3React();

  const handleBridgeTransfer = useCallback(async () => {
    setRequestedBridgeTransfer(true);
    const isToken = currency instanceof Token;

    // do coin transfer
    try {
        await coinTransfer(currency, bridgeParams, amount, bridgeType,
            reverseBridgeParams, reverseBridgeParamsOtherSide, account, library, isToken, sourceNetwork, 
            destNetwork, bridgeParamsOtherSide, 
            toastSuccess, toastError, t);
        setRequestedBridgeTransfer(false);
    } catch (e) {
        setRequestedBridgeTransfer(false)
        console.error(e)
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }

  }, [currency, amount, bridgeType, bridgeParams, bridgeParamsOtherSide, reverseBridgeParams, reverseBridgeParamsOtherSide,  
    account,  library, sourceNetwork, destNetwork, t, toastError, toastSuccess])

  return { handleBridgeTransfer, requestedBridgeTransfer }
}

export const coinTransfer = async function(currency: any, request: any, amount: any, bridgeType: string,
    destinationParams: any, reverseBridgeParamsOtherSide: any,
    account: any, library: any, isToken: boolean, 
    sourceNetwork: number, destNetwork: number, destinationParamsOtherSide: any,
    toastSuccess: any, toastError: any, t: any) {

    const from = account;
    const recipient = account;
    const value = ethers.BigNumber.from(String(parseValue(amount, currency.decimals))).toString();

    console.log(currency)
    
    // if token, then call erc677Contract, otherwise nativeSourceMediator
    if (bridgeType === "token" && isToken) {
        console.log('is token')
        const tokenSourceMediator = getNativeSourceMediator(request.contract, library.getSigner(account) );
        const gasPrice = await fetchGasPrice(library.getSigner(account));

        const receiptToken = await tokenSourceMediator["relayTokens(address,address,uint256)"](currency.address, recipient, value, {
            from: from,
            gasPrice: gasPrice,
        });

        await receiptToken.wait(2);
        if (destNetwork === 20) {
            callBridgeFaucet(receiptToken.hash, isToken, sourceNetwork, recipient, toastSuccess, toastError, t);
        }
        toastSuccess(t('Bridging in process. Awaiting relay from mediator.'));

        await detectExchangeFinished(account, bridgeType, sourceNetwork, destNetwork, destinationParamsOtherSide.contract, destinationParamsOtherSide,
            receiptToken.hash, isToken,
            toastSuccess, toastError, t);

    } else if (bridgeType === "native" && isToken) {
        console.log('is native token')
        const tokenSourceMediator = getErc677Contract(currency.address, library.getSigner(account), );
        const gasPrice = await fetchGasPrice(library.getSigner(account));

        const receiptErc677 = await tokenSourceMediator["transferAndCall(address,uint256,bytes)"](destinationParams.contract, value, from, {
            from: from,
            gasPrice: gasPrice.toString()
        });
        receiptErc677.wait(2);
        if (destNetwork === 20) {
            callBridgeFaucet(receiptErc677.hash, isToken, sourceNetwork, recipient, toastSuccess, toastError, t);
        }
        toastSuccess(t('Bridging in process. Awaiting relay from mediator.'));

        await detectExchangeFinished(account, bridgeType, sourceNetwork, destNetwork, reverseBridgeParamsOtherSide.contract, destinationParamsOtherSide,
            receiptErc677.hash, isToken,
            toastSuccess, toastError, t);
    } else {
        console.log('native')
        const nativeSourceMediator = getNativeSourceMediator(request.contract, library.getSigner(account));
        
        const receiptNative = await nativeSourceMediator["relayTokens(address)"](recipient, {
            from: from,
            value: value
        });
        await receiptNative.wait(2);
        if (destNetwork === 20) {
            callBridgeFaucet(receiptNative.hash, isToken, sourceNetwork, recipient, toastSuccess, toastError, t);
        }
        toastSuccess(t('Bridging in process. Awaiting relay from mediator.'));

        await detectExchangeFinished(account, bridgeType, sourceNetwork, destNetwork, destinationParamsOtherSide.contract, destinationParamsOtherSide,
            receiptNative.hash, isToken,
            toastSuccess, toastError, t);
    }
};

// detect is destination exchange finished transfer
export const detectExchangeFinished = async function(recipient: any, bridgeType: string,
    sourceNetwork: number, destNetwork: number,
    sourceMediatorContract: string,
    destinationParamsOtherSide: any, 
    txID: string, isToken: boolean,
    toastSuccess: any, toastError: any, t: any) {
    
    const destProvider = new ethers.providers.JsonRpcProvider(networksUrl[destNetwork]);
    
    let sourceMediator;
    let tokensBridgedEvent;

    if (bridgeType === "token" && isToken) {
        sourceMediator = getNativeSourceMediator(sourceMediatorContract, destProvider, );
        tokensBridgedEvent = ethers.utils.id("TokensBridged(address,uint256,bytes32)");
    } else if (bridgeType === "native" && isToken) {
        sourceMediator = getNativeSourceMediator(sourceMediatorContract, destProvider, );
        tokensBridgedEvent = ethers.utils.id("TokensBridged(address,uint256,bytes32)");
    } else {
        sourceMediator = getTokenSourceMediator(sourceMediatorContract, destProvider, );
        tokensBridgedEvent = ethers.utils.id("TokensBridged(address,address,uint256,bytes32)");
    }

    // get when transfer is finished 
    const fromBlock = await destProvider.getBlockNumber();
    const stopTime = Date.now() + VALIDATOR_TIMEOUT
    while (Date.now() <= stopTime) {
        const currentBlock = await destProvider.getBlockNumber();

        const logsNew = await sourceMediator.queryFilter({address: destinationParamsOtherSide.contract,
            topics: [tokensBridgedEvent]} , fromBlock , currentBlock);

        const confirmationEvent = logsNew.filter(event => event.args[0] === recipient);

        if (confirmationEvent.length > 0) {
            // if (destNetwork === 20) {
            //     await callBridgeFaucet(txID, isToken, sourceNetwork, recipient,
            //         toastSuccess, toastError, t);
            // }
            toastSuccess(t('Transfer complete! You can now use your assets on the destination network.'));
            return;
        }
        
        await wait(6000);
    }

    if (Date.now() > stopTime) {
        toastError("Bridge completion event not received within 5 minutes.");
    }
}