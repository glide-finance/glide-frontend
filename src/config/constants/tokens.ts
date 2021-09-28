import { ChainId, Token } from '@glide-finance/sdk'

export const GLIDE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x9c425FA88d84D40eE7Ec48391d1d00B07D53636B',
    18,
    'GLIDE',
    'Glide Token',
  )
}

export const USDC: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xA06be0F5950781cE28D965E5EFc6996e88a8C141',
    6,
    'USDC',
    'USD Coin',
  )
}

export const WELA = new Token(ChainId.MAINNET, '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4', 18, 'WELA', 'Wrapped ELA')

const tokens = {
  glide: {
    symbol: 'GLIDE',
    address: {
      56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
      20: '0x9c425FA88d84D40eE7Ec48391d1d00B07D53636B'
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  wela: {
    symbol: 'wELA',
    address: {
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4'
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  ela: {
    symbol: 'ELA',
    address: {
      1: '0xe6fd75ff38Adca4B97FBCD938c86b98772431867',
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4',
      128: '0xa1ecFc2beC06E4b43dDd423b94Fef84d0dBc8F5c'
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  ht: {
    symbol: 'HT',
    address: {
      56: '',
      97: '',
      20: '0xeceefC50f9aAcF0795586Ed90a8b9E24f55Ce3F3',
      128: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F'
    },
    decimals: 18,
    projectLink: 'https://www.huobi.com/',
  },
  sugar: {
    symbol: 'SUGAR',
    address: {
      56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
      97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
      20: '0x3793F5e5B952b751097E1C833E647a77Ae6E51D3'
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  husd: {
    symbol: 'HUSD',
    address: {
      56: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      97: '',
      20: '0xF9Ca2eA3b1024c0DB31adB224B407441bECC18BB'
    },
    decimals: 8,
    projectLink: 'https://www.hecochain.com/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '',
      97: '',
      20: '0xA06be0F5950781cE28D965E5EFc6996e88a8C141'
    },
    decimals: 6,
    projectLink: 'https://www.circle.com/en/usdc',
  }
}

export default tokens
