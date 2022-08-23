import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Flex,
  Text,
  Box,
  BalanceInput,
  MetamaskIcon,
  useModal,
  useMatchBreakpoints,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { ETHER } from '@glide-finance/sdk'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BigNumber from 'bignumber.js'
import useTokenBalance, { useGetBnbBalance, useStelaTotalSupply } from 'hooks/useTokenBalance'
import { getStelaAddress } from 'utils/addressHelpers'
import { getFullDisplayBalance, getBalanceAmount, formatNumber } from 'utils/formatBalance'
import { registerToken } from 'utils/wallet'
import useLiquidStake from '../hooks/useLiquidStake'
import { useFetchExchangeRate } from '../hooks/useFetchExchangeRate'
import StatusModal from './StatusModal'
import LimitExplainer from './LimitExplainer'

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 10px;
  background: none;
`

const InputBox = styled(Box)`
  width: 100%;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;

  :hover {
    border: 2px solid ${({ theme }) => theme.colors.primary};
    margin: -1px;
  }
`

const StyledFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 8px 24px;
  margin-top: 12px;
  border-radius: 12px;
`

const StakeSection = () => {
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const [stakeAmount, setStakeAmount] = useState('')
  const { isXs, isSm } = useMatchBreakpoints()
  const isMobile = isXs || isSm
  const [percent, setPercent] = useState(0)
  const { balance } = useGetBnbBalance()
  const { balance: stelaBalance } = useTokenBalance(getStelaAddress())
  const totalSupply = useStelaTotalSupply()
  const { userApproved, userDenied, pendingTx, complete, onStake } = useLiquidStake()
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const { exchangeRate } = useFetchExchangeRate()

  const handleStakeInputChange = (input: string) => {
    setStakeAmount(input)
  }

  const displayBalance = balance ? getFullDisplayBalance(balance, 18, 6) : '0'
  const sufficientBalance = Number(stakeAmount) > 0 && Number(stakeAmount) < Number(displayBalance)

  const setMax = () => {
    const MIN_ELA = new BigNumber(1e17) // 0.1 ELA remainder for gas
    const displayMax = getFullDisplayBalance(balance.minus(MIN_ELA), 18, 6)
    setStakeAmount(displayMax)
  }

  const RATE_DIVIDER = 10000
  const EXCHANGE_RATE = Number(exchangeRate)
  const stelaAmount = (Number(stakeAmount) * RATE_DIVIDER) / EXCHANGE_RATE
  const [onPresentStatusModal] = useModal(
    <StatusModal
      type="stake"
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
      await onStake(stakeAmount, 18)
    } catch (e) {
      // toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }

  const stakedTotal = getBalanceAmount(totalSupply).toNumber()
  const stakedLimit = 100000 // 100k ELA
  const stakedPercentage =
    stakedTotal > 0
      ? (stakedTotal / stakedLimit) * 100 > 100
        ? '100'
        : ((stakedTotal / stakedLimit) * 100).toFixed(2)
      : '0'

  return (
    <Flex flexDirection="column" flexGrow="1">
      <InputBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={ETHER} size="24px" style={{ marginRight: 8 }} />
            <Text>ELA</Text>
          </Flex>
          <Flex>
            <StyledBalanceInput
              value={stakeAmount}
              onUserInput={handleStakeInputChange}
              // placeholder="Enter ELA Amount"
              // currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
              // isWarning
              decimals={18}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center">
          <Text fontSize="11px" color="textSubtle">
            Balance: {getFullDisplayBalance(balance, 18, 4)} ELA
          </Text>
          {Number(displayBalance) > 0 && (
            <Text
              fontSize="11px"
              color="primary"
              onClick={setMax}
              ml="6px"
              paddingRight="24px"
              style={{ display: 'inline', cursor: 'pointer' }}
            >
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
            <img src="/images/tokens/stela.svg" width="24px" height="24px" alt="stELA" />
            <Text ml="8px">stELA</Text>
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
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="11px" color="textSubtle">
            Balance: {getFullDisplayBalance(stelaBalance, 18, 4)} stELA
          </Text>
          {account && isMetaMaskInScope && (
            <Button p="0 6px" height="auto" onClick={() => registerToken(getStelaAddress(), 'stELA', 18)}>
              <Text color="text" fontSize="11px">
                {t('+ Add stELA')}
              </Text>
              <MetamaskIcon ml="4px" />
            </Button>
          )}
        </Flex>
      </Flex>
      <StyledFlex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text fontSize="14px" mr="8px">
            {!isMobile && 'Staking'} Limit
          </Text>
          <LimitExplainer />
        </Flex>
        <Flex>
          <Text fontSize="14px" color="text">
            {stakedTotal > 0 ? `${(stakedTotal / 1000).toFixed(2)}k` : `0.00k`} / {stakedLimit / 1000}k ELA{' '}
            {!isMobile && `(${stakedPercentage}%)`}
          </Text>
        </Flex>
      </StyledFlex>
      <Flex mt="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button
            // isLoading={requestedApproval}
            // endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={!sufficientBalance || chainId !== 20 || stakedTotal > stakedLimit}
            onClick={() => {
              handleConfirmClick()
            }}
            width="100%"
          >
            {t('Stake ELA')}
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export default StakeSection
