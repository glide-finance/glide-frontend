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
]

export default priceHelperLps
