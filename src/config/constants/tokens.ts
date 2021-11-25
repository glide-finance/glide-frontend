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
  finu: {
    symbol: 'FINU',
    address: {
      20: '0x18521074aBA94FA730d06aAe000778Dcc8C6059d'
    },
    decimals: 9,
    projectLink: '',
  },
  finuLP: {
    symbol: 'FINU-ELA LP',
    address: {
      20: '0xe8134F4e731Bb9a70Ddc0013755994B4906d480f'
    },
    decimals: 18,
    projectLink: '',
  },
  beer: {
    symbol: 'BEER',
    address: {
      20: '0x44F57DF34e7873191f5aF7065B8348dD581c34DC'
    },
    decimals: 18,
    projectLink: '',
  },
  beerLP: {
    symbol: 'BEER-ELA LP',
    address: {
      20: '0xbcA320f6b57b422a7Bf98A5bFaf8635923998d41'
    },
    decimals: 18,
    projectLink: '',
  },
  sloth: {
    symbol: 'SLOTH',
    address: {
      20: '0xA70Efd687EADFb738389e0739a26fb9036D99A1E'
    },
    decimals: 18,
    projectLink: 'https://www.slothtoken.club/',
  },
  slothLP: {
    symbol: 'SLOTH-ELA LP',
    address: {
      20: '0x3DCe3e9C2DBe687ab1794E89e48ad0947c4ae48F'
    },
    decimals: 18,
    projectLink: 'https://www.slothtoken.club/',
  },
}

export default tokens
