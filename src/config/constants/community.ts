import tokens from './tokens'
import { CommunityConfig, PoolCategory } from './types'

const community: CommunityConfig[] = [
  { // total 15552000000000 over 1555200 blocks
    sousId: 1000,
    farmSymbol: "RINU-ELA LP",
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
  },
  { // total 15552000000000 over 1555200 blocks
    sousId: 1001,
    farmSymbol: "FINU-ELA LP",
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
  },
  { // total 1555200 over 1555200 blocks
    sousId: 1002,
    farmSymbol: "BEER-ELA LP",
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
  },
]

export default community
