import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import communityConfig from 'config/constants/community'
import { BIG_ZERO } from 'utils/bigNumber'
import { CommunityState, Pool, AppThunk } from 'state/types'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber, getBalanceAmount } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'
import fetchFarms from '../farms/fetchFarms'
import fetchFarmsPrices from '../farms/fetchFarmsPrices'
import { getTokenPricesFromFarm } from './helpers'

const initialState: CommunityState = {
  data: [...communityConfig],
  userDataLoaded: false,
  cakeVault: {
    totalShares: null,
    pricePerFullShare: null,
    totalCakeInVault: null,
    estimatedCakeBountyReward: null,
    totalPendingCakeHarvest: null,
    fees: {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    },
    userData: {
      isLoading: true,
      userShares: null,
      glideAtLastUserAction: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
    },
  },
  dividendPool: {
    totalStaked: null,
    startBlock: null,
    apr: null,
    stakingTokenPrice: null,
    earningTokenPrice: null,
    userData: {
      isLoading: true,
      allowance: null,
      stakingTokenBalance: null,
      stakedBalance: null,
      pendingReward: null
    },
  },
}

// Thunks
export const fetchCommunityPublicDataAsync = (currentBlock: number) => async (dispatch, getState) => {
  const blockLimits = await fetchPoolsBlockLimits()
  const totalStakings = await fetchPoolsTotalStaking()
  const farms = getState().farms.data
  const farmsWithPriceHelpers = farms.concat(priceHelperLpsConfig)
  const communityFarms = await fetchFarms(farmsWithPriceHelpers)
  const farmsWithPrices = await fetchFarmsPrices(communityFarms)
  const prices = getTokenPricesFromFarm(farmsWithPrices)

  const liveData = communityConfig.map((pool) => {
    const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
    const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
    const isPoolEndBlockExceeded = currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
    const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

    const { farmSymbol } = pool
    // const stakingTokenAddress = pool.stakingToken.address ? getAddress(pool.stakingToken.address).toLowerCase() : null
    const farm = farmsWithPrices.find((f) => f.lpSymbol === farmSymbol)
    const farmTokenPriceInUsd = new BigNumber(farm.token.usdcPrice)
    let lpTokenPrice = BIG_ZERO
    if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
      // Total value of base token in LP
      const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
      // Double it to get overall value in LP
      const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
      // Divide total value of all tokens, by the number of LP tokens
      const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
      lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
    }

    const stakingTokenPrice = Number(lpTokenPrice.toFixed(18))
    // const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

    const earningTokenAddress = pool.earningToken.address ? getAddress(pool.earningToken.address).toLowerCase() : null
    const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
    const apr = !isPoolFinished
      ? getPoolApr(
          stakingTokenPrice,
          earningTokenPrice,
          getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
          parseFloat(pool.tokenPerBlock),
        )
      : 0

    return {
      ...blockLimit,
      ...totalStaking,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      isFinished: isPoolFinished,
    }
  })

  dispatch(setCommunityPublicData(liveData))
}

export const fetchCommunityStakingLimitsAsync = () => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool) => pool.sousId)

  const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)

  const stakingLimitData = communityConfig.map((pool) => {
    if (poolsWithStakingLimit.includes(pool.sousId)) {
      return { sousId: pool.sousId }
    }
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    }
  })

  dispatch(setCommunityPublicData(stakingLimitData))
}

export const fetchCommunityUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    const stakingTokenBalances = await fetchUserBalances(account)
    const stakedBalances = await fetchUserStakeBalances(account)
    const pendingRewards = await fetchUserPendingRewards(account)

    const userData = communityConfig.map((pool) => ({
      sousId: pool.sousId,
      allowance: allowances[pool.sousId],
      stakingTokenBalance: stakingTokenBalances[pool.sousId],
      stakedBalance: stakedBalances[pool.sousId],
      pendingReward: pendingRewards[pool.sousId],
    }))

    dispatch(setCommunityUserData(userData))
  }

export const updateUserAllowance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    dispatch(updateCommunityUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateUserBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account)
    dispatch(updateCommunityUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserStakedBalance =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account)
    dispatch(updateCommunityUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserPendingReward =
  (sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    const pendingRewards = await fetchUserPendingRewards(account)
    dispatch(updateCommunityUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export const CommunitySlice = createSlice({
  name: 'Community',
  initialState,
  reducers: {
    setCommunityPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
    setCommunityUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
      state.userDataLoaded = true
    },
    updateCommunityUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  }
})

// Actions
export const { setCommunityPublicData, setCommunityUserData, updateCommunityUserData } = CommunitySlice.actions

export default CommunitySlice.reducer
