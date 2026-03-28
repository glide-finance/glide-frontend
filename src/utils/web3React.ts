import { InjectedConnector } from '@web3-react/injected-connector'
import { ConnectorNames } from '@glide-finance/uikit'
import { ethers } from 'ethers'
import { WalletConnectV2Connector } from './WalletConnectV2Connector'

const SUPPORTED_CHAIN_IDS = [1, 20, 56, 128]

const injected = new InjectedConnector({ supportedChainIds: SUPPORTED_CHAIN_IDS })

const walletconnect = new WalletConnectV2Connector({
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  chains: [20],
  optionalChains: [1, 56, 128],
  rpcMap: {
    1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
    20: 'https://api.elastos.io/eth',
    56: 'https://bsc-dataseed1.defibit.io/',
    128: 'https://http-mainnet.hecochain.com',
  },
  showQrModal: true,
  metadata: {
    name: 'Glide Finance',
    description: 'DeFi on Elastos Smart Chain',
    url: 'https://glidefinance.io',
    icons: ['https://glidefinance.io/logo.png'],
  },
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  return library
}

export const signMessage = async (provider: any, account: string, message: string): Promise<string> => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
