import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from 'hooks/useRefresh'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchDividendPoolPublicData,
  fetchDividendPoolUserData
} from '.'
import { State, Pool } from '../types'
import { transformPool } from './helpers'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }

    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const useFetchCakeVault = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchCakeVaultUserData({ account }))
  }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
}

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      glideAtLastUserAction: glideAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.cakeVault)

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString)
  }, [estimatedCakeBountyRewardAsString])

  const totalPendingCakeHarvest = useMemo(() => {
    return new BigNumber(totalPendingCakeHarvestAsString)
  }, [totalPendingCakeHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalCakeInVault = useMemo(() => {
    return new BigNumber(totalCakeInVaultAsString)
  }, [totalCakeInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const glideAtLastUserAction = useMemo(() => {
    return new BigNumber(glideAtLastUserActionAsString)
  }, [glideAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      glideAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

export const useFetchDividendPool = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchDividendPoolPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchDividendPoolUserData({ account }))
  }, [dispatch, fastRefresh, account])
}

export const useDividendPool = () => {
  const {
    totalStaked: totalStakedAsString,
    startBlock,
    apr,
    stakingTokenPrice,
    earningTokenPrice,
    userData: {
      isLoading,
      allowance: allowanceAsString,
      stakingTokenBalance: stakingTokenBalanceAsString,
      stakedBalance: stakedBalanceAsString,
      pendingReward: pendingRewardAsString
    },
  } = useSelector((state: State) => state.pools.dividendPool)

  const totalStaked = useMemo(() => {
    return new BigNumber(totalStakedAsString)
  }, [totalStakedAsString])

  const allowance = useMemo(() => {
    return new BigNumber(allowanceAsString)
  }, [allowanceAsString])

  const stakingTokenBalance = useMemo(() => {
    return new BigNumber(stakingTokenBalanceAsString)
  }, [stakingTokenBalanceAsString])

  const stakedBalance = useMemo(() => {
    return new BigNumber(stakedBalanceAsString)
  }, [stakedBalanceAsString])

  const pendingReward = useMemo(() => {
    return new BigNumber(pendingRewardAsString)
  }, [pendingRewardAsString])

  // const userShares = useMemo(() => {
  //   return new BigNumber(userSharesAsString)
  // }, [userSharesAsString])

  // const glideAtLastUserAction = useMemo(() => {
  //   return new BigNumber(glideAtLastUserActionAsString)
  // }, [glideAtLastUserActionAsString])
//
  return {
    totalStaked,
    startBlock,
    apr,
    stakingTokenPrice,
    earningTokenPrice,
    userData: {
      isLoading,
      allowance,
      stakingTokenBalance,
      stakedBalance,
      pendingReward
    },
  }
}