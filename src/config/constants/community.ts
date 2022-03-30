import tokens from './tokens'
import { CommunityConfig, PoolCategory } from './types'

const community: CommunityConfig[] = [
  {
    // total 15552000000000 over 1555200 blocks
    sousId: 1000,
    farmSymbol: 'RINU-ELA LP',
    stakingToken: tokens.rinuLP,
    earningToken: tokens.rinu,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0xbe62625c219390800A0de75f45C773Ef8bB9F950',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '10000000',
    isFinished: true,
  },
  {
    // total 15552000000000 over 1555200 blocks
    sousId: 1001,
    farmSymbol: 'FINU-ELA LP',
    stakingToken: tokens.finuLP,
    earningToken: tokens.finu,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0x7c5D6163e5cD8F8dd71e2597f671B18D9a22AF08',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '10000000',
    isFinished: true,
  },
  {
    // total 1555200 over 1555200 blocks
    sousId: 1002,
    farmSymbol: 'BEER-ELA LP',
    stakingToken: tokens.beerLP,
    earningToken: tokens.beer,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0xD20cA396942870b0afE59508270FD2F9af863Eeb',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '1',
    isFinished: true,
  },
  {
    // total 20000000000000 over 518400 blocks
    sousId: 1003,
    farmSymbol: 'SLOTH-ELA LP',
    stakingToken: tokens.slothLP,
    earningToken: tokens.sloth,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0x981465427f6946F4E1A6fa4CC15408695559768d',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '38580246',
    isFinished: true,
  },
  {
    // total 2100000000000000000000 over 518400 blocks
    sousId: 1004,
    farmSymbol: 'BUN-ELA LP',
    stakingToken: tokens.bunLP,
    earningToken: tokens.bun,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0x9A8433315B104ea2211e71Cf167AA8dDFBAF1C16',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.00405',
    isFinished: true,
  },
  {
    // total 15293910 over 12614400 blocks
    sousId: 1005,
    farmSymbol: 'BEER-ELA LP',
    stakingToken: tokens.beerLP,
    earningToken: tokens.beer,
    pairToken: tokens.wela,
    contractAddress: {
      20: '0x2bfC0ae3A5bc2958c602e65686FE1f366C71C7f3',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '1',
  },
]

export default community
