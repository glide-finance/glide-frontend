import { ChainId, Token } from '@glide-finance/sdk'

export const GLIDE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27', 18, 'GLIDE', 'Glide'),
}

export const USDC: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xA06be0F5950781cE28D965E5EFc6996e88a8C141', 6, 'USDC', 'USD Coin'),
}

export const WELA = new Token(ChainId.MAINNET, '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4', 18, 'WELA', 'Wrapped ELA')

export const LOCK_TOKENS = ["0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d"]

const tokens = {
  glide: {
    symbol: 'GLIDE',
    address: {
      20: '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27',
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  sugar: {
    symbol: 'SUGAR',
    address: {
      20: '0xa09Fd898D9c14CE6503dDb7A6861Dd08642BF60e',
    },
    decimals: 18,
    projectLink: 'https://glidefinance.io/',
  },
  wela: {
    symbol: 'wELA',
    address: {
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4',
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  ela: {
    symbol: 'ELA',
    address: {
      20: '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4',
    },
    decimals: 18,
    projectLink: 'https://elastos.org/',
  },
  // ethereum
  eth: {
    symbol: 'ETH',
    address: {
      20: '0x802c3e839E4fDb10aF583E3E759239ec7703501e',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      20: '0xA06be0F5950781cE28D965E5EFc6996e88a8C141',
    },
    decimals: 6,
    projectLink: 'https://www.circle.com/en/usdc',
  },
  mtrl: {
    symbol: 'MTRL',
    address: {
      20: '0xe2390b8B08a9Ab68e6f1aaA150B2ddD03900CE25',
    },
    decimals: 18,
    projectLink: 'https://material.network',
  },
  // binance
  bnb: {
    symbol: 'BNB',
    address: {
      20: '0x51B85F3889c7EA8f6d5EdEBFBadaDA0fDcE236c9',
    },
    decimals: 18,
    projectLink: 'https://www.binance.org/en/smartChain',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      20: '0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57',
    },
    decimals: 18,
    projectLink: 'https://paxos.com/busd/',
  },
  // heco
  ht: {
    symbol: 'HT',
    address: {
      20: '0xeceefC50f9aAcF0795586Ed90a8b9E24f55Ce3F3',
    },
    decimals: 18,
    projectLink: 'https://www.huobi.com/',
  },
  husd: {
    symbol: 'HUSD',
    address: {
      20: '0xF9Ca2eA3b1024c0DB31adB224B407441bECC18BB',
    },
    decimals: 8,
    projectLink: 'https://www.hecochain.com/',
  },
  htfilda: {
    symbol: 'htFILDA',
    address: {
      20: '0xB9Ae03e3320235D3a8AE537f87FF8529b445B590',
    },
    decimals: 18,
    projectLink: 'https://filda.io/',
  },
  // multi
  oelk: {
    symbol: 'ELK',
    address: {
      20: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
    },
    decimals: 18,
    projectLink: 'https://elk.finance/',
  },
  elk: {
    symbol: 'ELK',
    address: {
      20: '0xeEeEEb57642040bE42185f49C52F7E9B38f8eeeE',
    },
    decimals: 18,
    projectLink: 'https://elk.finance/',
  },
  creda: {
    symbol: 'CREDA',
    address: {
      20: '0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d',
    },
    decimals: 18,
    projectLink: 'https://creda.app/',
  },
  // Meme zone
  rinu: {
    symbol: 'RINU',
    address: {
      20: '0x0b0148b82631A1ce18c83048471716d591726977',
    },
    decimals: 9,
    projectLink: '',
  },
  rinuLP: {
    symbol: 'RINU-ELA LP',
    address: {
      20: '0x411DA456D450111648310c5Ec3D188755727b92c',
    },
    decimals: 18,
    projectLink: '',
  },
  finu: {
    symbol: 'FINU',
    address: {
      20: '0x18521074aBA94FA730d06aAe000778Dcc8C6059d',
    },
    decimals: 9,
    projectLink: '',
  },
  finuLP: {
    symbol: 'FINU-ELA LP',
    address: {
      20: '0xe8134F4e731Bb9a70Ddc0013755994B4906d480f',
    },
    decimals: 18,
    projectLink: '',
  },
  beer: {
    symbol: 'BEER',
    address: {
      20: '0x44F57DF34e7873191f5aF7065B8348dD581c34DC',
    },
    decimals: 18,
    projectLink: '',
  },
  beerLP: {
    symbol: 'BEER-ELA LP',
    address: {
      20: '0xbcA320f6b57b422a7Bf98A5bFaf8635923998d41',
    },
    decimals: 18,
    projectLink: '',
  },
  sloth: {
    symbol: 'SLOTH',
    address: {
      20: '0xA70Efd687EADFb738389e0739a26fb9036D99A1E',
    },
    decimals: 18,
    projectLink: 'https://www.slothtoken.club/',
  },
  slothLP: {
    symbol: 'SLOTH-ELA LP',
    address: {
      20: '0x3DCe3e9C2DBe687ab1794E89e48ad0947c4ae48F',
    },
    decimals: 18,
    projectLink: 'https://www.slothtoken.club/',
  },
  bun: {
    symbol: 'BUN',
    address: {
      20: '0x63B2dcd421d2E9168EC79e880fB0D2D45d539A66',
    },
    decimals: 18,
    projectLink: 'https://www.bunnypunk.online/',
  },
  bunLP: {
    symbol: 'BUN-ELA LP',
    address: {
      20: '0xb454FC9F6681dCa0D7C3b7a170A89B8bD7bdA71A',
    },
    decimals: 18,
    projectLink: 'https://www.bunnypunk.online/',
  },
}

export default tokens
