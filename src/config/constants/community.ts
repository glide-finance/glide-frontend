import tokens from './tokens'
import { CommunityConfig, PoolCategory } from './types'

const community: CommunityConfig[] = [
  { 
    sousId: 1000,
    farmSymbol: "RINU-ELA LP",
    stakingToken: tokens.rinuLP,
    earningToken: tokens.rinu,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0xE084e16eA848Ea280596f8872c07ED8a710E5Aa3',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '1',
  },
]

export default community
