import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Flex,
  Heading,
  Text,
  CardBody,
  Box,
  ButtonMenu,
  ButtonMenuItem,
  BalanceInput,
  MetamaskIcon,
  Modal,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
  InjectedModalProps,
  useModal,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { ETHER } from '@glide-finance/sdk'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BigNumber from 'bignumber.js'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getFullDisplayBalance, formatNumber, formatBigNumber, getDecimalAmount } from 'utils/formatBalance'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { registerToken } from 'utils/wallet'
import useLiquidStake from '../hooks/useLiquidStake'

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 10px;
  background: none;
`

const InputBox = styled(Box)`
  width: 100%;
  padding: 4px 16px;
  border: 1px solid;
  border-radius: 16px;
  border-color: ${({ theme }) => theme.colors.primary};
  :hover {
    border-width: 2px;
  }
`
interface LiquidStakingModalProps extends InjectedModalProps {
  pendingTx?: boolean
  userDenied?: boolean
  userApproved?: boolean
  complete?: boolean
  onDismiss?: InjectedModalProps['onDismiss']
}

const STELA = '0x30E110119eAA152abF9a073689Bd6aF109c23e67' // hardcoded stELA address for now

const StakeSection = () => {
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const [stakeAmount, setStakeAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const { balance } = useGetBnbBalance()
  const { balance: stelaBalance } = useTokenBalance(STELA)
  const { userApproved, userDenied, pendingTx, complete, onStake } = useLiquidStake()
  // const [pendingTx, setPendingTx] = useState(false)
  // const [userDenied, setUserDenied] = useState(false)
  // const [userApproved, setUserApproved] = useState(false)
  // const [complete, setComplete] = useState(false)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask

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
  const EXCHANGE_RATE = 10000
  const stelaAmount = (Number(stakeAmount) * RATE_DIVIDER) / EXCHANGE_RATE
  const [onPresentStatusModal] = useModal(
    <StatusModal pendingTx={pendingTx} userApproved={userApproved} userDenied={userDenied} complete={complete} />,
    false,
    true,
    'liquidStakingStatus',
  )

  const handleConfirmClick = async () => {
    try {
      onPresentStatusModal()
      await onStake(stakeAmount, 18)
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
            Balance: {getFullDisplayBalance(balance, 18, 2)} ELA
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
            Balance: {getFullDisplayBalance(stelaBalance, 18, 2)} stELA
          </Text>
          {account && isMetaMaskInScope && (
            <Button p="0 6px" height="auto" onClick={() => registerToken(STELA, 'stELA', 18)}>
              <Text color="text" fontSize="11px">
                {t('+ Add stELA')}
              </Text>
              <MetamaskIcon ml="4px" />
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex mt="24px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button
            // isLoading={requestedApproval}
            // endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={!sufficientBalance || chainId !== 20}
            onClick={() => {
              // setPendingTx(true)
              // setUserApproved(false)
              // setUserDenied(false)
              // setComplete(false)
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

const StatusModal: React.FC<LiquidStakingModalProps> = ({
  onDismiss,
  pendingTx,
  userDenied,
  userApproved,
  complete,
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (userDenied) {
      onDismiss()
    }
  }, [userDenied, onDismiss])

  return (
    <Modal title={t('Recent Transactions')} minWidth="320px" onDismiss={onDismiss}>
      <UIKitModalHeader>
        {/* <ModalTitle>
        <Heading>{t('Your Wallet')}</Heading>
      </ModalTitle>
      <IconButton variant="text" onClick={onDismiss}>
        <CloseIcon width="24px" color="text" />
      </IconButton> */}
        Hello
      </UIKitModalHeader>
      <ModalBody p="24px" maxWidth="400px" width="100%">
        {/* {view === WalletView.WALLET_INFO && <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />}
      {view === WalletView.TRANSACTIONS && <WalletTransactions />} */}
        {pendingTx && !userApproved && <Text>AWAITING</Text>}
        {pendingTx && userApproved && <Text>CONFIRMING</Text>}
        {!pendingTx && complete && <Text>COMPLETE</Text>}
      </ModalBody>
    </Modal>
  )
}
