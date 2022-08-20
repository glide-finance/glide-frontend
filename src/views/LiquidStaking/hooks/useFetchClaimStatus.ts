import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { useBlock } from 'state/block/hooks'
import { useLiquidStaking } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
import { getLiquidStakingAddress } from 'utils/addressHelpers'

interface ClaimStatus {
  requestedAmount: BigNumber
  requestedEpoch: BigNumber
  readyAmount: BigNumber
  readyOnHoldAmount: BigNumber
  onHold: boolean
  currentEpoch: BigNumber
}

const initialState: ClaimStatus = {
  requestedAmount: BIG_ZERO,
  requestedEpoch: BIG_ZERO,
  readyAmount: BIG_ZERO,
  readyOnHoldAmount: BIG_ZERO,
  onHold: false,
  currentEpoch: new BigNumber(1)
}

export const EPOCH_TIME = 871200000 // 10 days, 2 hours (242 hours) in milliseconds

export const useFetchClaimStatus = () => {
  const [claimStatus, setClaimStatus] = useState(initialState)
  const [claimStatusFetched, setClaimStatusFetched] = useState(false)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const liquidStakingContract = useLiquidStaking()

  useEffect(() => {
    const fetchClaimStatus = async () => {
      try {
        const withdrawRequests = (await liquidStakingContract.withdrawRequests(account))
        const withdrawReady = (await liquidStakingContract.withdrawReady(account))
        const onHold = (await liquidStakingContract.onHold())
        const currentEpoch = (await liquidStakingContract.currentEpoch())
        setClaimStatus({requestedAmount: new BigNumber(withdrawRequests[0].toString()), requestedEpoch: new BigNumber(withdrawRequests[1].toString()), readyAmount: new BigNumber(withdrawReady[0].toString()), readyOnHoldAmount: new BigNumber(withdrawReady[1].toString()), onHold, currentEpoch: new BigNumber(currentEpoch.toString()) })
        setClaimStatusFetched(true)
      } catch (error) {
        setClaimStatusFetched(false)
      }
    }

    fetchClaimStatus()
  }, [account, liquidStakingContract, fastRefresh])

  return { claimStatusFetched, claimStatus }
}

export const useFetchEpochTimer = () => {
  const { currentBlock } = useBlock()
  const [epochTimer, setEpochTimer] = useState('')
  const [epochMs, setEpochMs] = useState(0)
  const [epochTimerFetched, setEpochTimerFetched] = useState(false)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const liquidStakingContract = useLiquidStaking()

  useEffect(() => {
    const fetchClaimStatus = async () => {
      try {
        // check previous ~22 days event logs for epoch updates
        const fetchEpochs = await fetch(`https://esc.elastos.io/api?module=logs&action=getLogs&fromBlock=${currentBlock-1900800}&toBlock=latest&address=${getLiquidStakingAddress()}&topic0=0x27d6c6200f2a93b4e2eb544130a14df1a48054c8ca67317d8a7ed5d03e2efe37`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())

        const lastEpochUpdate = parseInt(fetchEpochs.result[fetchEpochs.result.length - 1].timeStamp)*1000
        const timeNow = Date.now()
        const nextEpochTimer = lastEpochUpdate + EPOCH_TIME - timeNow
        const days = Math.floor(nextEpochTimer/(60*60*24*1000))
        const hours = Math.floor(nextEpochTimer/(60*60*1000) - days*24)
        const minutes = Math.floor(nextEpochTimer/(60*1000) - days*24*60 - hours*60)
        setEpochTimer(`${days}d ${hours}h ${minutes}m`)
        setEpochMs(nextEpochTimer)
        setEpochTimerFetched(true)
      } catch (error) {
        setEpochTimerFetched(false)
      }
    }

    fetchClaimStatus()
  }, [account, currentBlock, liquidStakingContract, fastRefresh])

  return { epochTimerFetched, epochTimer, epochMs }
}