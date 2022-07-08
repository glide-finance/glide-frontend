import React from 'react'
import {
  Flex,
  Text,
  Button,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Skeleton,
  useTooltip,
} from '@glide-finance/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import DividendStakeModal from '../DividendStakeModal'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
}) => {
  const { stakingToken, stakingTokenPrice, stakingLimit, isFinished, userData } = pool
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(<DividendStakeModal isBnbPool={isBnbPool} pool={pool} />)
  const [onPresentUnstake] = useModal(<DividendStakeModal isBnbPool={isBnbPool} pool={pool} isRemovingStake />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this pool!'),
    { placement: 'bottom' },
  )

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
            {stakingTokenPrice !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={stakedTokenDollarBalance}
                  prefix="~"
                  unit=" USD"
                />
              </Text>
            )}
          </>
        </Flex>
        <Flex>
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          {reachStakingLimit ? (
            <span ref={targetRef}>
              <IconButton variant="secondary" disabled>
                <AddIcon color="textDisabled" width="24px" height="24px" />
              </IconButton>
            </span>
          ) : (
            <IconButton
              variant="secondary"
              onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color="primary" width="24px" height="24px" />
            </IconButton>
          )}
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
    ) : (
      <Button
        disabled={isFinished || chainId !== 20}
        onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
      >
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
