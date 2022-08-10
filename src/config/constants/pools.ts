import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.glide,
    earningToken: tokens.glide,
    contractAddress: {
      20: '0x7F5489f77Bb8515DE4e0582B60Eb63A7D9959821',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.31078125',
    sortOrder: 1,
    isFinished: false,
  },
  {
    // SwapRewardsChef
    sousId: 1,
    stakingToken: tokens.glide,
    earningToken: tokens.ela,
    contractAddress: {
      20: '0x80f2cF7059336b44a75F00451B81f8d742DD2b94',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0',
    sortOrder: 999,
    isFinished: false,
  },
  {
    // SwapRewardsChef
    sousId: 2,
    stakingToken: tokens.mtrl,
    earningToken: tokens.mtrl,
    contractAddress: {
      20: '0x217da50b13682e74b519b3bb94b586d964e5f3ba',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0',
    sortOrder: 999,
    isFinished: false,
  },
  {
    // PhantzGlideStake
    sousId: 3,
    stakingToken: tokens.glide,
    earningToken: tokens.glide,
    contractAddress: {
      20: '0xbe080A1Fee90c12fC7F308590DC56929E407aA6E',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0',
    sortOrder: 999,
    isFinished: true,
  },
  {
    // PhantzGlideStakeV2
    sousId: 4,
    stakingToken: tokens.glide,
    earningToken: tokens.glide,
    contractAddress: {
      20: '0x6be4661405096e1dEEC1eD03250bB9d38aeA0804',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 5,
    stakingToken: tokens.glide,
    earningToken: tokens.mtrl,
    contractAddress: {
      20: '0xfb0e4c826BC153a2d7A231a641872a8dFd3b3859',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.96450617',
    sortOrder: 999,
    isFinished: true,
  },
  {
    sousId: 6,
    stakingToken: tokens.glide,
    earningToken: tokens.elk,
    contractAddress: {
      20: '0xEa5F2997Ec1B0e783FBFb232978b81a7847055bF',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.00868',
    sortOrder: 999,
    isFinished: true,
  },
  {
    sousId: 7,
    stakingToken: tokens.glide,
    earningToken: tokens.oelk,
    contractAddress: {
      20: '0xEB56783E9df8F3051771CFCE2FBD0E96C34c03E0',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.00868',
    sortOrder: 999,
    isFinished: true,
  },
  {
    sousId: 8,
    stakingToken: tokens.glide,
    earningToken: tokens.mtrl,
    contractAddress: {
      20: '0x010C5C7d921d47a75051EE2381be76f9b77b869E',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.7233796',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 9,
    stakingToken: tokens.glide,
    earningToken: tokens.elk,
    contractAddress: {
      20: '0x00B7724512b909d6d41EAEef70A735eDB5617Dc8',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.00635',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 10,
    stakingToken: tokens.glide,
    earningToken: tokens.mtrl,
    contractAddress: {
      20: '0x4c1f6477cd444d4d78f37af1518548f06289e394',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.7716',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 11,
    stakingToken: tokens.glide,
    earningToken: tokens.mtrl,
    contractAddress: {
      20: '0x211c2B77fb7baA412005DBb004AC75e185EceDB3',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.41795',
    sortOrder: 999,
    isFinished: false,
  },
]

export default pools
