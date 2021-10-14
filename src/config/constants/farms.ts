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
      20: '0xd88F23867f329fF0B1D145c096b78050825F701A'
    },
    token: tokens.sugar,
    quoteToken: tokens.wela,
  },
  {
    pid: 1,
    lpSymbol: 'GLIDE-ELA LP',
    lpAddresses: {
      20: '0x4e06B7673a16b628489275cF4c430C03B45940d2'
    },
    token: tokens.glide,
    quoteToken: tokens.wela,
  },
  {
    pid: 2,
    lpSymbol: 'USDC-ELA LP', 
    lpAddresses: {
      20: '0xDBB317d34Fbf91B62381ffB69a2F3a8b997Fbf70'
    },
    token: tokens.usdc,
    quoteToken: tokens.wela,
  },
  {
    pid: 3,
    lpSymbol: 'ETH-ELA LP',
    lpAddresses: {
      20: '0x0424088a053876261440bA35B5B9c63d9af394eF'
    },
    token: tokens.eth,
    quoteToken: tokens.wela,
  },
  {
    pid: 4,
    lpSymbol: 'HUSD-USDC LP',
    lpAddresses: {
      20: '0xF90d0eBD444A87b21C2446001c22FCfaFD0E2caf'
    },
    token: tokens.husd,
    quoteToken: tokens.usdc,
  },
  {
    pid: 5,
    lpSymbol: 'GLIDE-USDC LP',
    lpAddresses: {
      20: '0x97533701f1D555fB3414E0Ab8aE33E6d18943155'
    },
    token: tokens.glide,
    quoteToken: tokens.usdc,
  },
  {
    pid: 6,
    lpSymbol: 'HT-ELA LP',
    lpAddresses: {
      20: '0xd20521F660aFAdBad047239B0c3390A24F8b0cFf'
    },
    token: tokens.ht,
    quoteToken: tokens.wela,
  }
]

export default farms
