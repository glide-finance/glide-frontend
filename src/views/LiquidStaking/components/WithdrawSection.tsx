import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, BalanceInput, useModal, useMatchBreakpoints } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useLiquidWithdraw from '../hooks/useLiquidWithdraw'
import { useFetchClaimStatus, useFetchEpochTimer } from '../hooks/useFetchClaimStatus'
import StatusModal from './StatusModal'

const StyledFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 8px 12px;
  margin-top: 12px;
  border-radius: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 8px 24px;
  }
`
const WithdrawSection = () => {
  const { isXs, isSm } = useMatchBreakpoints()
  const isMobile = isXs || isSm
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { userApproved, userDenied, pendingTx, complete, onWithdraw } = useLiquidWithdraw()
  const { claimStatusFetched, claimStatus } = useFetchClaimStatus()
  const { epochTimerFetched, epochTimer } = useFetchEpochTimer()

  const onHold = claimStatus.onHold
  const epoch = claimStatus.currentEpoch.toString()
  const withdrawRequestedEpoch = claimStatusFetched ? claimStatus.requestedEpoch.toString() : '0'
  const withdrawRequestedAmount = claimStatusFetched
    ? withdrawRequestedEpoch < epoch
      ? '0'
      : getFullDisplayBalance(claimStatus.requestedAmount, 18, 4)
    : '0'
  const withdrawRequested = Number(withdrawRequestedAmount) > 0
  const withdrawReadyOnHoldAmount = claimStatusFetched
    ? onHold
      ? withdrawRequestedEpoch < epoch
        ? getFullDisplayBalance(claimStatus.readyOnHoldAmount.plus(claimStatus.requestedAmount), 18, 4)
        : getFullDisplayBalance(claimStatus.readyOnHoldAmount, 18, 4)
      : '0'
    : '0'
  const withdrawReadyExactAmount = claimStatusFetched
    ? onHold
      ? claimStatus.readyAmount
      : withdrawRequestedEpoch < epoch
      ? claimStatus.readyAmount.plus(claimStatus.readyOnHoldAmount).plus(claimStatus.requestedAmount)
      : claimStatus.readyAmount.plus(claimStatus.readyOnHoldAmount)
    : new BigNumber(0)

  const withdrawReadyAmount = getFullDisplayBalance(withdrawReadyExactAmount, 18, 4)
  const withdrawReady = Number(withdrawReadyAmount) > 0
  const withdrawReadyOnHold = Number(withdrawReadyOnHoldAmount) > 0

  const [onPresentStatusModal] = useModal(
    <StatusModal
      type="withdraw"
      pendingTx={pendingTx}
      userApproved={userApproved}
      userDenied={userDenied}
      complete={complete}
      amount={withdrawReadyAmount}
    />,
    false,
    true,
    'liquidStakingStatus',
  )

  const handleConfirmClick = async () => {
    try {
      onPresentStatusModal()
      await onWithdraw(withdrawReadyExactAmount.toString(), 18)
    } catch (e) {
      // toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }

  return (
    <Flex flexDirection="column" flexGrow="1">
      <StyledFlex flexDirection="row">
        <Text fontSize="12px" color="textSubtle">
          You will be able to withdraw your tokens after the withdraw request has been processed. To submit a request
          visit the Unstake tab.
        </Text>
      </StyledFlex>
      {withdrawRequested || withdrawReady || withdrawReadyOnHold ? (
        <StyledFlex p="4px" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column" mr="12px">
            <Text fontSize="12px" color="textSubtle" mb="16px">
              AMOUNT
            </Text>
            {withdrawReady && (
              <Text fontSize="14px" p="5.5px 0" mb="10px">
                {withdrawReadyAmount} {!isMobile && 'ELA'}
              </Text>
            )}
            {withdrawReadyOnHold && (
              <Text fontSize="14px" p="5.5px 0" mb="10px">
                {withdrawReadyOnHoldAmount} {!isMobile && 'ELA'}
              </Text>
            )}
            {withdrawRequested && (
              <Text fontSize="14px" p="5.5px 0" mb="10px">
                {withdrawRequestedAmount} {!isMobile && 'ELA'}
              </Text>
            )}
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="12px" color="textSubtle" mb="16px">
              CLAIM TIMER
            </Text>
            {withdrawReady && (
              <Text fontSize="14px" p="5.5px 0" mb="10px" mr="32px">
                Ready
              </Text>
            )}
            {withdrawReadyOnHold && (
              <Text fontSize="14px" p="5.5px 0" mb="10px" mr="32px">
                {'<30m'}
              </Text>
            )}
            {withdrawRequested && (
              <Text fontSize="14px" p="5.5px 0" mb="10px" mr="32px">
                {epochTimerFetched ? epochTimer : '0d 0h 0m'}
              </Text>
            )}
          </Flex>
          <Flex flexDirection="column" mt="34px">
            {withdrawReady && (
              <Button scale="sm" mb="10px" disabled={!withdrawReady || chainId !== 20} onClick={handleConfirmClick}>
                Claim
              </Button>
            )}
            {withdrawReadyOnHold && (
              <Button scale="sm" mb="10px" disabled>
                Claim
              </Button>
            )}
            {withdrawRequested && (
              <Button scale="sm" mb="10px" disabled>
                Claim
              </Button>
            )}
          </Flex>
        </StyledFlex>
      ) : (
        <StyledFlex p="4px" alignItems="center" justifyContent="center">
          <Text color="failure">No tickets found!</Text>
        </StyledFlex>
      )}
    </Flex>
  )
}

export default WithdrawSection
