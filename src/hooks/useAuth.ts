import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@glide-finance/uikit'
import { WalletConnectV2Connector } from 'utils/WalletConnectV2Connector'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { profileClear } from 'state/profile'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { activate, deactivate, library } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork(20)
            if (hasSetup) {
              activate(connector)
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              toastError(t('Provider Error'), t('No provider was found'))
            } else if (error instanceof UserRejectedRequestErrorInjected) {
              toastError(t('Authorization Error'), t('Please authorize to access your account'))
            } else if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
              toastError(t('Authorization Error'), t('Please authorize to access your account'))
            } else {
              toastError(t('Network Error'), t('Please switch your network to ESC before connecting your wallet'))
              setupNetwork(20, library)
            }
          }
        })
      } else {
        toastError(t('Unable to find connector'), t('The connector config is wrong'))
      }
    },
    [t, activate, toastError, library],
  )

  const logout = useCallback(() => {
    dispatch(profileClear())
    deactivate()

    const wcConnector = connectorsByName.walletconnect
    if (wcConnector instanceof WalletConnectV2Connector) {
      wcConnector.close()
    }

    window.localStorage.removeItem('walletconnect')
    window.localStorage.removeItem('wc@2:ethereum_provider:session')
    window.localStorage.removeItem('wc@2:client:0.3//session')
  }, [deactivate, dispatch])

  return { login, logout }
}

export default useAuth
