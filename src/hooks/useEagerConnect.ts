import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@glide-finance/uikit'
import useAuth from 'hooks/useAuth'

// const _binanceChainListener = async () =>
//   new Promise<void>((resolve) =>
//     Object.defineProperty(window, 'BinanceChain', {
//       get() {
//         return this.bsc
//       },
//       set(bsc) {
//         this.bsc = bsc

//         resolve()
//       },
//     }),
//   )

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (connectorId) {
      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
