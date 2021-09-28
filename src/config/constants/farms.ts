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
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      20: '0x9c425FA88d84D40eE7Ec48391d1d00B07D53636B'
    },
    token: tokens.sugar,
    quoteToken: tokens.wela,
  },
  {
    pid: 1,
    lpSymbol: 'GLIDE-ELA LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      20: '0xb1C2EcCb9cA5b9a7c77dd2E71ED6f05298677fA2'
    },
    token: tokens.glide,
    quoteToken: tokens.wela,
  },
  {
    pid: 2,
    lpSymbol: 'HUSD-ELA LP',
    lpAddresses: {
      97: '0xfc9b9efebcd39e08a0618d4e05a852e4f8a854c6',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      20: '0x74f9dE892dEb1209BBb715F7bad6718cfE11F77e'
    },
    token: tokens.husd,
    quoteToken: tokens.wela,
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
]

export default farms
