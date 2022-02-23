import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Currency, CurrencyAmount, ETHER, Token } from '@glide-finance/sdk'
import {
  Flex,
  Button,
  Text,
  ArrowForwardIcon,
  useModal,
  AutoRenewIcon,
  LinkExternal,
  Image,
} from '@glide-finance/uikit'
// import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress } from 'utils/addressHelpers'
import { setupNetwork } from 'utils/wallet'
import BRIDGES from 'config/constants/bridges'
import { usePollBlockNumber } from 'state/block/hooks'
// import useTokenBalance from '../../hooks/useTokenBalance'
// import { useBridgeableTokens } from 'hooks/Tokens'
import BigNumber from 'bignumber.js'
import { useCheckMediatorApprovalStatus, useApproveMediator } from './hooks/useApprove'
import { useCheckFaucetStatus } from './hooks/useFaucet'
import { useCheckFees } from './hooks/useFees'
import { useBridgeMediator } from './hooks/useBridgeMediator'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ArrowWrapper, Wrapper } from './components/styleds'
import Select, { OptionProps } from './components/Select'
import { AutoColumn } from '../../components/Layout/Column'
import BridgeInputPanel from './components/BridgeInputPanel'
import { AutoRow } from '../../components/Layout/Row'
import Page from './components/Page'
import Body from './components/Body'
import { GradientHeader } from '../../components/App'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/bridge/actions'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/bridge/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
// import CircleLoader from '../../components/Loader/CircleLoader'
import SwapWarningModal from './components/SwapWarningModal'
import BRIDGE_TOKEN_LIST from '../../config/constants/tokenLists/glide-bridge.tokenlist.json'

const BridgePage = styled(Page)`
  padding-top: 10vh;

  ${({ theme }) => theme.mediaQueries.lg} {
    background: radial-gradient(40% 55% at 45% 57.5%, #f2ad6c 0%, rgba(242, 173, 108, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%),
      radial-gradient(40% 45% at 55% 47.5%, #48b9ff 0%, rgba(72, 185, 255, 0.4) 25%, rgba(6, 9, 20, 0) 72.5%);
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    background-position-y: -2vh;
  }
`

const ChainContainer = styled.div`
  align-items: center;
  border-radius: 14px;
`
const Warning = styled.div`
  text-align: center;
`
const Emphasize = styled.div`
  text-align: center;
  background: ${({ theme }) => theme.colors.gradients.inverseBubblegum};
  border: 1px solid ${({ theme }) => theme.colors.input};
  border-radius: 14px;
  padding: 10px;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`
const ArrowContainer = styled.div`
  align-items: center;
  border-radius: 20px;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
  background-color: ${({ theme }) => theme.colors.input};
`

const ElkNotice = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 16px;
  max-width: 478px;
  width: 100%;
`

// move to config popsicle
const IndexMap = {
  0: 'Elastos',
  1: 'Ethereum',
  2: 'Heco',
  3: 'Binance',
}
const ChainMap = {
  0: 20,
  1: 1,
  2: 128,
  3: 56,
}
const SymbolMap = {
  20: 'ELA',
  1: 'ETH',
  128: 'HT',
  56: 'BNB',
}

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const Bridge: React.FC = () => {
  const { t } = useTranslation()
  const [originIndex, setOriginIndex] = useState(0)
  const [destinationIndex, setDestinationIndex] = useState(2)
  const { account, chainId, library } = useActiveWeb3React()
  const correctChain = ChainMap[originIndex] === chainId
  usePollBlockNumber()

  // const [requestedApproval, setRequestedApproval] = useState<boolean>(false)

  const handleOriginChange = (option: OptionProps): void => {
    clearInput()
    switch (option.value) {
      case 'elastos':
        setOriginIndex(0)
        setDestinationIndex(2)
        setupNetwork(20, library)
        break
      case 'ethereum':
        setOriginIndex(1)
        setDestinationIndex(0)
        setupNetwork(1, library)
        break
      case 'heco':
        setOriginIndex(2)
        setDestinationIndex(0)
        setupNetwork(128, library)
        break
      case 'binance':
        setOriginIndex(3)
        setDestinationIndex(0)
        setupNetwork(56, library)
        break
      default:
        setOriginIndex(2)
        setDestinationIndex(0)
        break
    }
  }

  const handleDestinationChange = (option: OptionProps): void => {
    clearInput()
    switch (option.value) {
      case 'elastos':
        setDestinationIndex(0)
        if (originIndex === 1 || originIndex === 2) return
        if (originIndex === 0) setOriginIndex(2)
        break
      case 'ethereum':
        setDestinationIndex(1)
        if (originIndex === 0) return
        if (originIndex === 1 || originIndex === 2) setOriginIndex(0)
        break
      case 'heco':
        setDestinationIndex(2)
        if (originIndex === 0) return
        if (originIndex === 1 || originIndex === 2) setOriginIndex(0)
        break
      case 'binance':
        setDestinationIndex(3)
        if (originIndex === 0) return
        if (originIndex === 1 || originIndex === 2) setOriginIndex(0)
        break
      default:
        setDestinationIndex(0)
        break
    }
  }

  const reverseBridge = () => {
    clearInput()
    setOriginIndex(destinationIndex)
    setDestinationIndex(originIndex)
  }

  const switchNetwork = (id) => {
    setupNetwork(id, library)
    clearInput()
  }

  const [allowedSlippage] = useUserSlippageTolerance()
  // swap state
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()

  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  const [approval] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
  const exceedsMax = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.greaterThan(maxAmountInput))
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      const warningTokenAddress = getAddress(warningTokenData.address)
      return swapCurrency.address === warningTokenAddress
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onUserInput(Field.INPUT, '')
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onUserInput, onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const clearInput = useCallback(() => {
    onUserInput(Field.INPUT, '')
    onCurrencySelection(Field.INPUT, undefined)
  }, [onUserInput, onCurrencySelection])

  const tokenToBridge = currencies[Field.INPUT]
  const amountToBridge =
    Number(formattedAmounts[Field.INPUT]) >= 0 ? new BigNumber(formattedAmounts[Field.INPUT]) : new BigNumber(0)
  const symbol =
    currencyKey(tokenToBridge) === 'ETHER' ? SymbolMap[chainId] : tokenToBridge ? tokenToBridge.symbol : undefined
  const bridgeSelected = `${ChainMap[originIndex]}_${ChainMap[destinationIndex]}`
  const bridgeDestinationSelected = `${ChainMap[destinationIndex]}_${ChainMap[originIndex]}`
  const bridgeType = tokenToBridge
    ? tokenToBridge.symbol === 'ELA' ||
      tokenToBridge.symbol === 'ETH' ||
      tokenToBridge.symbol === 'HT' ||
      tokenToBridge.symbol === 'BNB'
      ? 'native'
      : 'token'
    : undefined // popsicle

  // eslint-disable-next-line prefer-const
  let bridgeParams =
    bridgeType && chainId === ChainMap[originIndex] ? BRIDGES[bridgeSelected][bridgeType][chainId] : undefined
  const bridgeParamsOtherSide =
    bridgeType && chainId === ChainMap[originIndex]
      ? BRIDGES[bridgeSelected][bridgeType][ChainMap[destinationIndex]]
      : undefined
  const reverseBridgeParams =
    bridgeType && chainId === ChainMap[originIndex]
      ? BRIDGES[bridgeDestinationSelected][bridgeType][chainId]
      : undefined
  const reverseBridgeParamsOtherSide =
    bridgeType && chainId === ChainMap[originIndex]
      ? BRIDGES[bridgeDestinationSelected][bridgeType][ChainMap[destinationIndex]]
      : undefined
  const correctParams = bridgeParams !== undefined
  const needsApproval = useCheckMediatorApprovalStatus(tokenToBridge, bridgeParams, amountToBridge, reverseBridgeParams)
  const faucetAvailable = useCheckFaucetStatus(tokenToBridge, correctParams, ChainMap[destinationIndex])

  const { handleApprove, requestedApproval, approvalComplete } = useApproveMediator(
    tokenToBridge,
    bridgeParams,
    reverseBridgeParams,
  )
  const { handleBridgeTransfer, requestedBridgeTransfer } = useBridgeMediator(
    tokenToBridge,
    amountToBridge,
    bridgeType,
    bridgeParams,
    bridgeParamsOtherSide,
    reverseBridgeParams,
    reverseBridgeParamsOtherSide,
    ChainMap[originIndex],
    ChainMap[destinationIndex],
  )

  // const minTx = useCheckFees(tokenToBridge, bridgeParams, reverseBridgeParams)

  let minTransfer = correctParams ? bridgeParams.minTx : '0'
  let feePercent = correctParams ? bridgeParams.fee : '0'
  if (tokenToBridge instanceof Token) {
    const tokenInfo = BRIDGE_TOKEN_LIST.tokens.filter((token) => token.address === tokenToBridge.address)[0]
    if (tokenInfo?.minTx !== undefined) {
      minTransfer = tokenInfo.minTx
    }
    if (tokenInfo?.fee !== undefined) {
      feePercent = tokenInfo.fee
    }
  }

  const feeAmount =
    correctParams && amountToBridge.gt(0)
      ? new BigNumber(feePercent).div(new BigNumber(100)).times(amountToBridge).toPrecision(3)
      : 0
  const isBridgeable =
    correctParams && amountToBridge >= minTransfer && amountToBridge <= bridgeParams.maxTx && !exceedsMax

  return (
    <>
      <BridgePage>
        <ElkNotice>
          <AutoRow justify="center">
            <Text bold color="primary" mb="8px">
              {t(`Not the chains you're looking for? Check out Elk and bridge to Elastos from 14 different networks!`)}
            </Text>
            <Image src="/images/tokens/elk.svg" width={36} height={36} mr="16px" mt="0px" />
            <LinkExternal
              color="text"
              href="https://app.elk.finance/?utm_source=glide&utm_medium=banner&utm_campaign=elknet&utm_id=projectpromo#/elknet"
            >
              {t('Elk Finance')}
            </LinkExternal>
          </AutoRow>
        </ElkNotice>
        <Body>
          <GradientHeader title={t('Bridge')} subtitle={t('Map tokens to and from the Elastos Smart Chain')} noConfig />
          <Wrapper id="bridge-page">
            <AutoRow justify="center">
              <AutoColumn gap="md" style={{ padding: '1rem 0' }}>
                <ChainContainer>
                  <AutoRow justify="center">
                    <Text color="textSubtle">{t('From')}</Text>
                  </AutoRow>
                  <AutoRow justify="center" style={{ padding: '0.5rem' }}>
                    <img src={`images/networks/${IndexMap[originIndex]}.png`} alt={IndexMap[originIndex]} width={75} />
                  </AutoRow>
                  <AutoRow justify="center">
                    <FilterContainer>
                      <LabelWrapper>
                        <Select
                          chainIndex={originIndex}
                          options={[
                            {
                              label: 'Elastos',
                              value: 'elastos',
                            },
                            {
                              label: 'Ethereum',
                              value: 'ethereum',
                            },
                            {
                              label: 'Heco',
                              value: 'heco',
                            },
                            {
                              label: 'Binance',
                              value: 'binance',
                            },
                          ]}
                          onChange={handleOriginChange}
                        />
                      </LabelWrapper>
                    </FilterContainer>
                  </AutoRow>
                </ChainContainer>
              </AutoColumn>
              <AutoColumn gap="md" style={{ padding: '1rem 0' }}>
                <ArrowContainer>
                  <ArrowWrapper clickable onClick={reverseBridge}>
                    <ArrowForwardIcon width="24px" />
                  </ArrowWrapper>
                </ArrowContainer>
              </AutoColumn>
              <AutoColumn gap="md" style={{ padding: '1rem 0' }}>
                <ChainContainer>
                  <AutoRow justify="center">
                    <Text color="textSubtle">{t('To')}</Text>
                  </AutoRow>
                  <AutoRow justify="center" style={{ padding: '0.5rem' }}>
                    <img
                      src={`images/networks/${IndexMap[destinationIndex]}.png`}
                      alt={IndexMap[destinationIndex]}
                      width={75}
                    />
                  </AutoRow>
                  <AutoRow justify="center">
                    <FilterContainer>
                      <LabelWrapper>
                        <Select
                          chainIndex={destinationIndex}
                          options={[
                            {
                              label: 'Elastos',
                              value: 'elastos',
                            },
                            {
                              label: 'Ethereum',
                              value: 'ethereum',
                            },
                            {
                              label: 'Heco',
                              value: 'heco',
                            },
                            {
                              label: 'Binance',
                              value: 'binance',
                            },
                          ]}
                          onChange={handleDestinationChange}
                        />
                      </LabelWrapper>
                    </FilterContainer>
                  </AutoRow>
                </ChainContainer>
              </AutoColumn>
            </AutoRow>
            <AutoColumn gap="md">
              <BridgeInputPanel
                label={t('Token to bridge')}
                origin={ChainMap[originIndex]}
                destination={ChainMap[destinationIndex]}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
            </AutoColumn>
            {correctParams && (
              <AutoColumn style={{ padding: '0.5rem 0.5rem 0 0.5rem' }}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="textSubtle">{t('Min Bridge Amount')}</Text>
                  <Text color="textSubtle">
                    {minTransfer.toLocaleString()} {symbol}
                  </Text>
                </Flex>
                {/* <Flex alignItems="center" justifyContent="space-between">
                  <Text color="textSubtle">{t('Max Bridge Amount')}</Text>
                  <Text color="textSubtle">
                    {bridgeParams.maxTx.toLocaleString()} {symbol}
                  </Text>
                </Flex> */}
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="textSubtle">
                    {t('Fee')} ({feePercent}%)
                  </Text>
                  <Text color="textSubtle">
                    {feeAmount > 0 ? feeAmount.toLocaleString() : 0} {symbol}
                  </Text>
                </Flex>
              </AutoColumn>
            )}
            <AutoColumn gap="md" justify="center" style={{ padding: '1rem 0 0 0' }}>
              {!correctChain && (
                <Warning>
                  <Text color="failure" mb="4px">
                    • {t('Please connect your wallet to the chain you wish to bridge from!')}
                    {'  '}
                    <Button scale="xs" variant="danger" onClick={() => switchNetwork(ChainMap[originIndex])}>
                      {t('Click Here to Switch')}
                    </Button>
                  </Text>
                </Warning>
              )}
              {correctParams && amountToBridge.lt(minTransfer) ? (
                <Warning>
                  <Text color="failure" mb="4px">
                    • {t('Below minimum bridge amount')}
                  </Text>
                </Warning>
              ) : (
                exceedsMax && (
                  <Warning>
                    <Text color="failure" mb="4px">
                      • {t('Insufficient balance')}
                    </Text>
                  </Warning>
                )
              )}
              {correctParams && chainId === 1 && tokenToBridge.name !== 'ELA on Ethereum' && (
                <Warning>
                  <Text color="primary" mb="4px">
                    {t(`Warning! Bridging assets back to Ethereum includes a fee (1-2%) to cover gas.`)}
                  </Text>
                </Warning>
              )}
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : needsApproval && !approvalComplete ? (
                <Button
                  width="100%"
                  onClick={handleApprove}
                  disabled={!isBridgeable}
                  isLoading={requestedApproval}
                  endIcon={requestedApproval ? <AutoRenewIcon color="currentColor" spin /> : null}
                >
                  {requestedApproval ? t('Approving') : t('Enable')}
                </Button>
              ) : (
                <Button
                  width="100%"
                  onClick={handleBridgeTransfer}
                  disabled={!isBridgeable}
                  isLoading={requestedBridgeTransfer}
                  endIcon={requestedBridgeTransfer ? <AutoRenewIcon color="currentColor" spin /> : null}
                >
                  {requestedBridgeTransfer ? t('Bridging') : t('Bridge Token')}
                </Button>
              )}
            </AutoColumn>
            {isBridgeable && faucetAvailable && (
              <AutoColumn gap="md" justify="center" style={{ padding: '1rem 0 0 0' }}>
                <Emphasize>
                  <Text mb="4px">
                    {t('Faucet available! As part of this transaction you will receive 0.01 ELA for use as gas on ESC')}
                  </Text>
                </Emphasize>
              </AutoColumn>
            )}
          </Wrapper>
        </Body>
      </BridgePage>
    </>
  )
}

export default Bridge
