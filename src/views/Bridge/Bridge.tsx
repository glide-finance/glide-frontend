import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@glide-finance/sdk'
import { Button, Text, ArrowForwardIcon, ArrowLastIcon, Box, useModal, Heading, connectorLocalStorageKey, ConnectorNames } from '@glide-finance/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress } from 'utils/addressHelpers'
import { setupNetwork } from 'utils/wallet'
import useAuth from 'hooks/useAuth'

import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'

import Select, { OptionProps } from './components/Select'
import Column, { AutoColumn } from '../../components/Layout/Column'
import BridgeInputPanel from './components/BridgeInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import Page from './components/Page'
import Header from './components/Header'
import Body from './components/Body'

import { useIsTransactionUnsupported } from '../../hooks/Trades'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from '../../components/Card'

import ConfirmSwapModal from './components/ConfirmSwapModal'

import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import TradePrice from './components/TradePrice'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'

import { AppHeader, AppBody } from '../../components/App'

import { INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import SwapWarningModal from './components/SwapWarningModal'

const ChainContainer = styled.div`
  align-items: center;
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
  background-color: ${({ theme }) => theme.colors.input};
  padding: 0.25rem;
  margin-bottom: 1.5rem;
`
// move to config
const IndexMap = {
  0: 'Elastos',
  1: 'Ethereum',
  2: 'Heco',
}

const Bridge: React.FC = () => {
  const { t } = useTranslation()
  const [originIndex, setOriginIndex] = useState(0)
  const [destinationIndex, setDestinationIndex] = useState(2)
  const { account } = useActiveWeb3React()
  const correctChain = true
  const { login } = useAuth()

  const handleOriginChange = (option: OptionProps): void => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    switch (option.value) {
      case 'elastos':
        setOriginIndex(0)
        setDestinationIndex(2)
        setupNetwork(20)
        break
      case 'ethereum':
        setOriginIndex(1)
        setDestinationIndex(0)
        // Unable to switch the default network to metamask
        break
      case 'heco':
        setOriginIndex(2)
        setDestinationIndex(0)
        setupNetwork(128)
        // login(connectorId)
        break
      default:
        setOriginIndex(2)
        setDestinationIndex(0)
        break
    }
  }

  const handleDestinationChange = (option: OptionProps): void => {
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
      default:
        setDestinationIndex(0)
        break
    }
  }

  const reverseBridge = () => {
    setOriginIndex(destinationIndex)
    setDestinationIndex(originIndex)
  }

  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
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

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

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

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
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
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  // const [onPresentImportTokenWarningModal] = useModal(
  //   <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  // )

  // useEffect(() => {
  //   if (importTokensNotInDefault.length > 0) {
  //     onPresentImportTokenWarningModal()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Bridge')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Map assets to and from Elastos')}
        </Heading>
      </PageHeader>
      <Page>
        <Body>
          <Wrapper id="bridge-page">
            <AutoRow justify="center" style={{ padding: '0.5rem 0' }}>
              <AutoColumn gap="md" style={{ padding: '1rem 0' }}>
                <ChainContainer>
                  <AutoRow justify="center">
                    <Text color="textSubtle">From Chain</Text>
                  </AutoRow>
                  <AutoRow justify="center" style={{ padding: '0.5rem' }}>
                    {/* <Ethereum height="48px" width="48px" mb="24px" /> */}
                    <img src={`images/networks/${IndexMap[originIndex]}.png`} alt={IndexMap[originIndex]} width={75} />
                  </AutoRow>
                  <AutoRow justify="center">
                    <FilterContainer>
                      <LabelWrapper>
                        <Select
                          chainIndex={originIndex}
                          options={[
                            {
                              label: t('Elastos'),
                              value: 'elastos',
                            },
                            {
                              label: t('Ethereum'),
                              value: 'ethereum',
                            },
                            {
                              label: t('Heco'),
                              value: 'heco',
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
                    <Text color="textSubtle">To Chain</Text>
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
                              label: t('Elastos'),
                              value: 'elastos',
                            },
                            {
                              label: t('Ethereum'),
                              value: 'ethereum',
                            },
                            {
                              label: t('Heco'),
                              value: 'heco',
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
                  label={t('Select token to bridge')}
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
            <AutoColumn gap="md" justify="center" style={{padding: '1rem 0 0 0'}}>
              {!correctChain && (
                <Text color="textSubtle" mb="4px">
                  {t('Please connect your wallet to the chain you wish to bridge from!')}
                </Text>
              )}
              {!account ? <ConnectWalletButton width="100%" /> : <Button width="100%">Bridge Token</Button>}
            </AutoColumn>
          </Wrapper>
        </Body>
      </Page>
    </>
  )
}

export default Bridge
