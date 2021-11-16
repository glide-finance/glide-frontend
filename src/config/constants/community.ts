import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const community: PoolConfig[] = [
  {
    sousId: 1000,
    stakingToken: tokens.fildaLP,
    earningToken: tokens.filda,
    contractAddress: {
      20: '0xC31494725feab0094fB0504746Ec6A1c36080d47',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.0000000000000001',
  },
]

export default community
