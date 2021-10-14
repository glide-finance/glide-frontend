import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
// import { simpleRpcProvider } from 'utils/providers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { setBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()
  const { library } = useActiveWeb3React()

  useEffect(() => {
    const interval = setInterval(async () => {
      // const blockNumber = await simpleRpcProvider.getBlockNumber()
      const blockNumber = await library.getBlockNumber()
      // console.log('blocknumber', blockNumber)
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch, library])
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
