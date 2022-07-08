/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
// import { useTranslation } from 'contexts/Localization'
// import useToast from 'hooks/useToast'
import { BRIDGE_FAUCET_API }  from 'config/constants/endpoints';

const wait = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export const useCheckFaucetStatus = (currency, valid, destination) => {
  const [isFaucetAvailable, setIsFaucetAvailable] = useState(false)
  const { account } = useWeb3React();

  useEffect(() => {
    const checkFaucetStatus = async () => {
    if (!valid) { setIsFaucetAvailable(false); return }
    if (destination !== 20) { setIsFaucetAvailable(false); return }
    try {
        const responseGet = await fetch(`${BRIDGE_FAUCET_API}/faucet/${account}`);
        if (responseGet.ok) {
            const dataSuccessGet = await responseGet.json();
             if (dataSuccessGet.has_use_faucet === false) {
                 setIsFaucetAvailable(true)
             } else {
                 setIsFaucetAvailable(false)
             }
        }
    } catch (error) {
      console.error(JSON.stringify(error))
    } 
    }
    checkFaucetStatus()
  }, [account, valid, destination])

  return isFaucetAvailable
}

export const callBridgeFaucet = async (txID: string, type: string, chainID: number, destAddress: string,
    toastSuccess: any, toastError: any, t: any) => {
    
    try {
        const responseGet = await fetch(`${BRIDGE_FAUCET_API}/faucet/${destAddress}`);
        // console.log('response', responseGet)

        if (responseGet.ok) {
            const dataSuccessGet = await responseGet.json();
                
            if (dataSuccessGet.has_use_faucet === false) {
                const response = await fetch(`${BRIDGE_FAUCET_API}/faucet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        txID: txID,
                        chainID: chainID,
                        address: destAddress,
                        type: type
                    }),
                });

                if (response.ok) {
                    await response.json();
                    await wait(5000);
                    toastSuccess(t('0.01 ELA received from gas faucet!')); // dataSuccess?.success?.message
                } else {
                    await response.json();
                    await wait(5000);
                    toastError(t('Error receiving faucet distribution')); // dataError?.error?.message
                }
            }
        }
    } catch (error) {
      console.error(JSON.stringify(error))
    } 
  }