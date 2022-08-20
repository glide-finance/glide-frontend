import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, Box, BalanceInput, useModal } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { ETHER } from '@glide-finance/sdk'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTokenBalance from 'hooks/useTokenBalance'
import { getStelaAddress } from 'utils/addressHelpers'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useLiquidUnstake from '../hooks/useLiquidUnstake'
import { useFetchExchangeRate } from '../hooks/useFetchExchangeRate'
import StatusModal from './StatusModal'

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 10px;
  background: none;
`

const StyledFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 8px 24px;
  margin-top: 12px;
  border-radius: 12px;
`

const InputBox = styled(Box)`
  width: 100%;
  padding: 4px 16px;
  border: 1px solid;
  border-radius: 16px;
  border-color: ${({ theme }) => theme.colors.tertiary};
  :hover {
    border-width: 2px;
  }
`

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`

const UnstakeSection = () => {
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const { balance } = useTokenBalance(getStelaAddress())
  const { userApproved, userDenied, pendingTx, complete, onUnstake } = useLiquidUnstake()
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const { exchangeRate } = useFetchExchangeRate()

  const handleUnstakeInputChange = (input: string) => {
    setUnstakeAmount(input)
  }

  const displayBalance = balance ? getFullDisplayBalance(balance, 18, 6) : '0'
  const sufficientBalance = Number(unstakeAmount) > 0 && Number(unstakeAmount) <= Number(displayBalance)

  const setMax = () => {
    const displayMax = getFullDisplayBalance(balance, 18, 18)
    setUnstakeAmount(displayMax)
  }

  const RATE_DIVIDER = 10000
  const EXCHANGE_RATE = Number(exchangeRate)
  const stelaAmount = (Number(unstakeAmount) * EXCHANGE_RATE) / RATE_DIVIDER
  const [onPresentStatusModal] = useModal(
    <StatusModal
      type="unstake"
      pendingTx={pendingTx}
      userApproved={userApproved}
      userDenied={userDenied}
      complete={complete}
      amount={formatNumber(stelaAmount, 0, 6)}
    />,
    false,
    true,
    'liquidStakingStatus',
  )

  const handleConfirmClick = async () => {
    try {
      onPresentStatusModal()
      await onUnstake(unstakeAmount, 18)
      // toastSuccess(
      //   `${t('Unstaked')}!`,
      //   t('Your %symbol% earnings have also been harvested to your wallet!', {
      //     symbol: earningToken.symbol,
      //   }),
      // )
      // onDismiss()
    } catch (e) {
      // toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }

  return (
    <Flex flexDirection="column" flexGrow="1">
      <InputBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <img src="/images/tokens/stela.svg" width="24px" height="24px" alt="stELA" />
            <Text ml="8px">stELA</Text>
          </Flex>
          <Flex>
            <StyledBalanceInput
              value={unstakeAmount}
              onUserInput={handleUnstakeInputChange}
              // placeholder="Enter stELA Amount"
              // currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
              // isWarning
              decimals={18}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center">
          <Text fontSize="11px" color="textSubtle">
            Balance: {getFullDisplayBalance(balance, 18, 4)} stELA
          </Text>
          {Number(displayBalance) > 0 && (
            <Text fontSize="11px" color="primary" onClick={setMax} ml="6px" paddingRight="24px">
              (Max)
            </Text>
          )}
        </Flex>
      </InputBox>
      <Flex flexDirection="column" mt="20px" padding="4px 16px">
        <Text fontSize="11px" fontWeight="bold" mb="6px">
          You will receive
        </Text>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={ETHER} size="24px" style={{ marginRight: 8 }} />
            <Text ml="8px">ELA</Text>
          </Flex>
          <Flex>
            {stelaAmount > 0 ? (
              <Text ml="11px" mr="11px" color="text">
                {formatNumber(stelaAmount, 0, 6)}
              </Text>
            ) : (
              <Text ml="11px" mr="11px" color="textSubtle">
                0.0
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
      <StyledFlex flexDirection="row">
        <Text fontSize="12px" color="textSubtle">
          Withdrawing ELA will take up to <HighlightText>10 days</HighlightText> as per Elastos&#39;s minimum stake
          period. Monitor your ticket using the Withdraw tab.
        </Text>
        {/* <Text fontSize="12px" color="textSubtle">Swap on a DEX for instant liquidity and arbitrage opportunities</Text> */}
      </StyledFlex>
      <Flex mt="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          // ) : !isLiquidStakingApproved && !approvalComplete ? (
          //   <Button
          //     width="100%"
          //     onClick={handleApprove}
          //     disabled={!sufficientBalance || chainId !== 20}
          //     isLoading={requestedApproval}
          //     endIcon={requestedApproval ? <AutoRenewIcon color="currentColor" spin /> : null}
          //   >
          //     {requestedApproval ? t('Approving') : t('Enable')}
          //   </Button>
          // ) : (
          <Button
            // isLoading={requestedApproval}
            // endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={!sufficientBalance || chainId !== 20}
            onClick={() => {
              handleConfirmClick()
            }}
            width="100%"
          >
            {t('Unstake')}
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export default UnstakeSection
