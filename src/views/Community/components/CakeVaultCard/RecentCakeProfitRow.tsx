import React from 'react'
import { Flex, Text } from '@glide-finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeUsdc } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

const RecentCakeProfitCountdownRow = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { glideAtLastUserAction, userShares, lastUserActionTime },
  } = useCakeVault()
  const cakePriceUsdc = usePriceCakeUsdc()
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    glideAtLastUserAction,
    userShares,
    pricePerFullShare,
    cakePriceUsdc.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent GLIDE profit')}:`}</Text>
      {hasAutoEarnings && (
        <RecentCakeProfitBalance
          cakeToDisplay={autoCakeToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
