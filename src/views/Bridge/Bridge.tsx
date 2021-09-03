import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount } from '@glide-finance/sdk'
import { Flex, Button, Text, ArrowForwardIcon, useModal, Heading } from '@glide-finance/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress } from 'utils/addressHelpers'
import { setupNetwork } from 'utils/wallet'
import bridges from 'config/constants/bridges'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ArrowWrapper, Wrapper } from './components/styleds'
import Select, { OptionProps } from './components/Select'
import { AutoColumn } from '../../components/Layout/Column'
import BridgeInputPanel from './components/BridgeInputPanel'
import { AutoRow } from '../../components/Layout/Row'
import Page from './components/Page'
import Body from './components/Body'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
// import CircleLoader from '../../components/Loader/CircleLoader'
import SwapWarningModal from './components/SwapWarningModal'

const ChainContainer = styled.div`
  align-items: center;
`
const SwitchWarning = styled.div`
  text-align: center;
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
const ChainMap = {
  0: 20,
  1: 1,
  2: 128,
}

const Bridge: React.FC = () => {
  const { t } = useTranslation()
  const [originIndex, setOriginIndex] = useState(0)
  const [destinationIndex, setDestinationIndex] = useState(2)
  const { account, chainId } = useActiveWeb3React()
  const correctChain = ChainMap[originIndex] === chainId

  const handleOriginChange = (option: OptionProps): void => {
    switch (option.value) {
      case 'elastos':
        setOriginIndex(0)
        setDestinationIndex(2)
        setupNetwork(20)
        break
      case 'ethereum':
        setOriginIndex(1)
        setDestinationIndex(0)
        setupNetwork(1)
        break
      case 'heco':
        setOriginIndex(2)
        setDestinationIndex(0)
        setupNetwork(128)
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

  const [allowedSlippage] = useUserSlippageTolerance()
  // swap state
  const { independentField, typedValue } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()
  const {
    wrapType
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


  const tokenToBridge = currencies[Field.INPUT]
  const amountToBridge = formattedAmounts[Field.INPUT]
  const bridgeSelected = `${ChainMap[originIndex]}_${ChainMap[destinationIndex]}`
  const bridgeType = tokenToBridge ? (tokenToBridge.symbol === 'ELA' || tokenToBridge.symbol === 'ETH' || tokenToBridge.symbol === 'HT' ? 'native' : 'token') : undefined

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
            <AutoColumn style={{padding: '0.5rem 0.5rem 0 0.5rem'}}>
              <Flex alignItems="center" justifyContent="space-between">
                  <Text>Max Bridge Amount</Text>
                  <Text>100000000</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                  <Text>Max Bridge Amount</Text>
                  <Text>1000</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                  <Text>Fee</Text>
                  <Text>0</Text>
              </Flex>
            </AutoColumn>
            <AutoColumn gap="md" justify="center" style={{padding: '1rem 0 0 0'}}>
              {!correctChain && (
                <SwitchWarning>
                  <Text color="failure" mb="4px">
                    {t('• Please connect your wallet to the chain you wish to bridge from!')}{"  "}
                    <Button scale="xs" variant="danger" onClick={() => setupNetwork(ChainMap[originIndex])}>Click Here to Switch</Button>
                  </Text>
                </SwitchWarning>
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
