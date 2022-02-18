import { ChainId } from '@glide-finance/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  [ChainId.MAINNET]: 'https://escrpc.elaphant.app', // https://api.elastos.io/eth
  [ChainId.TESTNET]: 'https://api-testnet.elastos.io/eth',
  [ChainId.BINANCE]: 'https://bsc-dataseed1.ninicoin.io/',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
}

export const BRIDGE_NETWORKS = {
  20: {
    chainId: `0x14`,
    chainName: 'Elastos Smart Contract Chain',
    nativeCurrency: {
      name: 'ELA',
      symbol: 'ela',
      decimals: 18,
    },
    rpcUrls: ['https://escrpc.elaphant.app', 'https://api.elastos.io/eth', 'https://api.trinity-tech.cn/eth'],
    blockExplorerUrls: ['https://esc.elastios.io'],
  },
  1: {
    chainId: `0x1`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'eth',
      decimals: 18,
    },
    rpcUrls: [`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  128: {
    chainId: `0x80`,
    chainName: 'Huobi ECO Chain',
    nativeCurrency: {
      name: 'HT',
      symbol: 'ht',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com', 'https://http-mainnet-node.huobichain.com'],
    blockExplorerUrls: ['https://hecoinfo.com'],
  },
  56: {
    chainId: `0x38`,
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'bnb',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io/', 'https://bsc-dataseed1.defibit.io/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
}

export default NETWORK_URLS
