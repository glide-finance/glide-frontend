import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from 'hooks/useRefresh'
// import { getDividendPoolContract, getCakeContract } from 'utils/contractHelpers'
import {
  fetchCommunityPublicDataAsync,
  fetchCommunityUserDataAsync,
  fetchCommunityStakingLimitsAsync,
} from '.'
import { State, Pool } from '../types'
// import { transformPool, getTokenPricesFromFarm } from './helpers'
import { transformPool } from './helpers'

export const useFetchPublicCommunityData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchCommunityPublicData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(fetchCommunityPublicDataAsync(blockNumber))
    }

    fetchCommunityPublicData()
    dispatch(fetchCommunityStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const useCommunityChef = (account): { community: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchCommunityUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { community, userDataLoaded } = useSelector((state: State) => ({
    community: state.community.data,
    userDataLoaded: state.community.userDataLoaded,
  }))
  return { community: community.map(transformPool), userDataLoaded }
}

export const useCommunityChefPublicData = (): { community: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fetchCommunityPublicData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(fetchCommunityPublicDataAsync(blockNumber))
    }

    fetchCommunityPublicData()
  }, [dispatch, fastRefresh])

  const { community, userDataLoaded } = useSelector((state: State) => ({
    community: state.community.data,
    userDataLoaded: state.community.userDataLoaded,
  }))
  return { community: community.map(transformPool), userDataLoaded }
}