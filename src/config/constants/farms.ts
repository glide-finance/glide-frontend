import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'GLIDE',
    lpAddresses: {
      20: '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27',
    },
    token: tokens.sugar,
    quoteToken: tokens.wela,
  },
  {
    pid: 1,
    lpSymbol: 'GLIDE-ELA LP',
    lpAddresses: {
      20: '0xbeeAAb15628329C2C89Bc9F403d34b31fbCb3085',
    },
    token: tokens.glide,
    quoteToken: tokens.wela,
  },
  {
    pid: 7,
    lpSymbol: 'GLIDE-USDC LP',
    lpAddresses: {
      20: '0x26aCE9c9da938fb2Db91B0d0E7703861c249bf08',
    },
    token: tokens.glide,
    quoteToken: tokens.usdc,
  },
  {
    pid: 13,
    lpSymbol: 'stELA-ELA LP',
    lpAddresses: {
      20: '0xE1349b31D91C1E00175343df9E60a1981086787A',
    },
    token: tokens.stela,
    quoteToken: tokens.wela,
  },
  {
    pid: 2,
    lpSymbol: 'USDC-ELA LP',
    lpAddresses: {
      20: '0x6077b7990d3d0dfB5A50f1D207f67ac5955B999d',
    },
    token: tokens.usdc,
    quoteToken: tokens.wela,
  },
  {
    pid: 3,
    lpSymbol: 'ETH-ELA LP',
    lpAddresses: {
      20: '0xa86883c2405f4557D2242Df47b220C54d0D611e4',
    },
    token: tokens.eth,
    quoteToken: tokens.wela,
  },
  {
    pid: 4,
    lpSymbol: 'HUSD-USDC LP',
    lpAddresses: {
      20: '0xB0917F2595A2c4C56498f6da2C52690a3EF558D2',
    },
    token: tokens.husd,
    quoteToken: tokens.usdc,
  },
  {
    pid: 5,
    lpSymbol: 'HT-ELA LP',
    lpAddresses: {
      20: '0xC6734784EE598855200dABC8D8B1fA1F11f14C90',
    },
    token: tokens.ht,
    quoteToken: tokens.wela,
  },
  {
    pid: 6,
    lpSymbol: 'htFILDA-ELA LP',
    lpAddresses: {
      20: '0x5B0Cf7D3b2D6885e1173674f4649B914e7A66B96',
    },
    token: tokens.htfilda,
    quoteToken: tokens.wela,
  },
  {
    pid: 8,
    lpSymbol: 'MTRL-ELA LP',
    lpAddresses: {
      20: '0x825872e7AB3EE8ABf1f1239711375e4F2b587220',
    },
    token: tokens.mtrl,
    quoteToken: tokens.wela,
  },
  {
    pid: 9,
    lpSymbol: 'oELK-GLIDE LP',
    lpAddresses: {
      20: '0x707A778354639EaAE03E739d2D5E8Db96CA30bF7',
    },
    token: tokens.oelk,
    quoteToken: tokens.glide,
  },
  {
    pid: 10,
    lpSymbol: 'BUSD-USDC LP',
    lpAddresses: {
      20: '0x9ad2439CaE9440427f3dFF53A11A57A5a7211152',
    },
    token: tokens.busd,
    quoteToken: tokens.usdc,
  },
  {
    pid: 11,
    lpSymbol: 'BNB-ELA LP',
    lpAddresses: {
      20: '0x421C1960169a50a963Cd8317d10b96298CaD0dc6',
    },
    token: tokens.bnb,
    quoteToken: tokens.wela,
  },
  {
    pid: 12,
    lpSymbol: 'ELK-GLIDE LP',
    lpAddresses: {
      20: '0x59aDb497691A71831cDC07258ccCAa5294E68996',
    },
    token: tokens.elk,
    quoteToken: tokens.glide,
  }
]

export default farms
