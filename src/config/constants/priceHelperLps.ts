import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  // {
  //   pid: null,
  //   lpSymbol: 'USDC-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: tokens.usdc,
  //   quoteToken: tokens.wbnb,
  // },
  {
    pid: null,
    lpSymbol: 'RINU-ELA LP',
    lpAddresses: {
      20: '0x411DA456D450111648310c5Ec3D188755727b92c'
    },
    token: tokens.rinu,
    quoteToken: tokens.wela,
  },
  {
    pid: null,
    lpSymbol: 'FINU-ELA LP',
    lpAddresses: {
      20: '0xe8134F4e731Bb9a70Ddc0013755994B4906d480f'
    },
    token: tokens.finu,
    quoteToken: tokens.wela,
  },
  {
    pid: null,
    lpSymbol: 'BEER-ELA LP',
    lpAddresses: {
      20: '0xbcA320f6b57b422a7Bf98A5bFaf8635923998d41'
    },
    token: tokens.beer,
    quoteToken: tokens.wela,
  },
  {
    pid: null,
    lpSymbol: 'SLOTH-ELA LP',
    lpAddresses: {
      20: '0x3DCe3e9C2DBe687ab1794E89e48ad0947c4ae48F'
    },
    token: tokens.sloth,
    quoteToken: tokens.wela,
  },
  {
    pid: null,
    lpSymbol: 'BUN-ELA LP',
    lpAddresses: {
      20: '0xb454FC9F6681dCa0D7C3b7a170A89B8bD7bdA71A'
    },
    token: tokens.bun,
    quoteToken: tokens.wela,
  },
]

export default priceHelperLps
