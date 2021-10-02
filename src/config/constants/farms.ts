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
      20: '0x3983cD2787A1e63c6Fb189CE0C06B9B44E382c31'
    },
    token: tokens.sugar,
    quoteToken: tokens.wela,
  },
  {
    pid: 1,
    lpSymbol: 'GLIDE-ELA LP',
    lpAddresses: {
      20: '0xE4225468888E06A870B1Ec85F4E7761C9032DD50'
    },
    token: tokens.glide,
    quoteToken: tokens.wela,
  },
  {
    pid: 2,
    lpSymbol: 'USDC-ELA LP', 
    lpAddresses: {
      20: '0x6860bd8a7CEDEC7CD79480EdFD8583Aa8Fac5a2E'
    },
    token: tokens.usdc,
    quoteToken: tokens.wela,
  },
  {
    pid: 3,
    lpSymbol: 'GLIDE-USDC LP',
    lpAddresses: {
      20: '0xC556F765766151823258545b2b402796C16916D4'
    },
    token: tokens.glide,
    quoteToken: tokens.usdc,
  },
  {
    pid: 4,
    lpSymbol: 'ETH-ELA LP',
    lpAddresses: {
      20: '0xF660A325594999835C2506b0Ec79051D1F7A6EF1'
    },
    token: tokens.eth,
    quoteToken: tokens.wela,
  },
  {
    pid: 5,
    lpSymbol: 'HT-ELA LP',
    lpAddresses: {
      20: '0x48056B7bB775eC158Ba6e379C017fc9720d3Db11'
    },
    token: tokens.ht,
    quoteToken: tokens.wela,
  },
  {
    pid: 6,
    lpSymbol: 'HUSD-USDC LP',
    lpAddresses: {
      20: '0xc8596312A0e6eaEaBB2D8c2c02e6Ec2cd426b731'
    },
    token: tokens.husd,
    quoteToken: tokens.usdc,
  }
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
]

export default farms
