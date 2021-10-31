import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.glide,
    earningToken: tokens.glide,
    contractAddress: {
      20: '0x7F5489f77Bb8515DE4e0582B60Eb63A7D9959821'
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.4875',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 1,
    stakingToken: tokens.glide,
    earningToken: tokens.ela,
    contractAddress: {
      20: '0x80f2cF7059336b44a75F00451B81f8d742DD2b94'
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0',
    sortOrder: 999,
    isFinished: false,
  },
  // {
  //   sousId: 211,
  //   stakingToken: tokens.cake,
  //   earningToken: tokens.ramp,
  //   contractAddress: {
  //     97: '',
  //     56: '0x401b9b97bdbc3197c1adfab9652dc78040bd1e13',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '0.9837',
  // },
  // {
  //   sousId: 210,
  //   stakingToken: tokens.cake,
  //   earningToken: tokens.pots,
  //   contractAddress: {
  //     97: '',
  //     56: '0xBeDb490970204cb3CC7B0fea94463BeD67d5364D',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '0.0868',
  // },
]

export default pools
