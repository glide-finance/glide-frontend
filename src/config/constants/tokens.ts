import { ChainId, Token } from '@glide-finance/sdk'

export const GLIDE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27',
    18,
    'GLIDE',
    'Glide',
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
      20: '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27'
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  sugar: {
    symbol: 'SUGAR',
    address: {
      20: '0xa09Fd898D9c14CE6503dDb7A6861Dd08642BF60e'
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  wela: {
    symbol: 'wELA',
    address: {
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4'
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  ela: {
    symbol: 'ELA',
    address: {
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4'
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      20: '0x802c3e839E4fDb10aF583E3E759239ec7703501e'
    },
    decimals: 18,
    projectLink: 'https://ethereum.org',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      20: '0xA06be0F5950781cE28D965E5EFc6996e88a8C141'
    },
    decimals: 6,
    projectLink: 'https://www.circle.com/en/usdc',
  },
  ht: {
    symbol: 'HT',
    address: {
      20: '0xeceefC50f9aAcF0795586Ed90a8b9E24f55Ce3F3'
    },
    decimals: 18,
    projectLink: 'https://www.huobi.com/',
  },
  husd: {
    symbol: 'HUSD',
    address: {
      20: '0xF9Ca2eA3b1024c0DB31adB224B407441bECC18BB'
    },
    decimals: 8,
    projectLink: 'https://www.hecochain.com/',
  },
  filda: {
    symbol: 'FILDA',
    address: {
      20: '0xB9Ae03e3320235D3a8AE537f87FF8529b445B590'
    },
    decimals: 18,
    projectLink: 'https://filda.io/',
  },
  // Meme zone
  fildaLP: {
    symbol: 'FILDA-ELA LP',
    address: {
      20: '0x5B0Cf7D3b2D6885e1173674f4649B914e7A66B96'
    },
    decimals: 18,
    projectLink: 'https://filda.io/',
  },
  rinu: {
    symbol: 'RINU',
    address: {
      20: '0x0b0148b82631A1ce18c83048471716d591726977'
    },
    decimals: 9,
    projectLink: '',
  },
  rinuLP: {
    symbol: 'RINU-ELA LP',
    address: {
      20: '0x411DA456D450111648310c5Ec3D188755727b92c'
    },
    decimals: 18,
    projectLink: '',
  },
}

export default tokens
