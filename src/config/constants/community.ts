import tokens from './tokens'
import { CommunityConfig, PoolCategory } from './types'

const community: CommunityConfig[] = [
  {
    sousId: 1000,
    farmSymbol: "FILDA-ELA LP",
    stakingToken: tokens.fildaLP,
    earningToken: tokens.filda,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0x2C3B3eb958ad0E1884A1Ff1BFaAd386a23097A85',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.0025',
  },
  { 
    sousId: 1001,
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
