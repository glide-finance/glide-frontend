import React, { useState } from 'react'
import { Button, Heading, Skeleton, Text } from '@glide-finance/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeUsdc } from 'state/farms/hooks'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
  const { toastSuccess, toastError } = useToast()
  const earningsBigNumber = new BigNumber(userData.earnings)
  const cakePrice = usePriceCakeUsdc()
  let earnings = BIG_ZERO
  let earningsUsdc = 0
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsUsdc = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          GLIDE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading>{displayBalance}</Heading>
          {earningsUsdc > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsUsdc} unit=" USD" prefix="~" />
          )}
        </div>
        <Button
          disabled={earnings.eq(0) || pendingTx || !userDataReady || chainId !== 20}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onReward()
              toastSuccess(
                `${t('Harvested')}!`,
                t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'GLIDE' }),
              )
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              console.error(e)
            } finally {
              setPendingTx(false)
            }
            dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
          }}
          ml="4px"
        >
          {t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
