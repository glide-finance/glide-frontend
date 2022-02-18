import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { signingMethods } from '@walletconnect/utils'
// import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@glide-finance/uikit'
import { ethers } from 'ethers'
// import getNodeUrl from './getRpcUrl'

signingMethods.push('wallet_addEthereumChain', 'wallet_watchAsset', 'wallet_switchEthereumChain')

// const POLLING_INTERVAL = 8000
// const rpcUrl = getNodeUrl()
// const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

const injected = new InjectedConnector({ supportedChainIds: [1, 20, 56, 128] })

const walletconnect = new WalletConnectConnector({
  // rpc: { [chainId]: rpcUrl },
  rpc: {
    1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    20: 'https://api.elastos.io/eth',
    56: 'https://bsc-dataseed1.defibit.io/',
    128: 'https://http-mainnet.hecochain.com',
  },
  bridge: 'https://walletconnect.elastos.net/v2',
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  // library.pollingInterval = POLLING_INTERVAL
  return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (provider: any, account: string, message: string): Promise<string> => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
