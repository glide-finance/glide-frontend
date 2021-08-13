import { ChainId, Token } from '@glide-finance/sdk'

export const CAKE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x74734ad255A131803fA6dfB3bAEC7D31Eaf5AAC0',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
}
export const BUSD: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xf9ca2ea3b1024c0db31adb224b407441becc18bb',
    18,
    'BUSD',
    'Binance USD',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
  ),
}

export const WBNB = new Token(ChainId.MAINNET, '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4', 18, 'WBNB', 'Wrapped BNB')
export const DAI = new Token(ChainId.MAINNET, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')
export const BTCB = new Token(ChainId.MAINNET, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC')
export const UST = new Token(
  ChainId.MAINNET,
  '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  18,
  'UST',
  'Wrapped UST Token',
)
export const ETH = new Token(
  ChainId.MAINNET,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'ETH',
  'Binance-Peg Ethereum Token',
)
export const USDC = new Token(
  ChainId.MAINNET,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
)

const tokens = {
  bnb: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
      20: '0x74734ad255A131803fA6dfB3bAEC7D31Eaf5AAC0'
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4'
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  syrup: {
    symbol: 'SYRUP',
    address: {
      56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
      97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
      20: '0xda3b783f5d53178367208ae78e328233187ed891'
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      97: '',
      20: '0xF9Ca2eA3b1024c0DB31adB224B407441bECC18BB'
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  }
}

export default tokens
