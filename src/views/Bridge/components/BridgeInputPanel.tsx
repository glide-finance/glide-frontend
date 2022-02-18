import React from 'react'
import { Currency, Pair } from '@glide-finance/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex } from '@glide-finance/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../../state/wallet/hooks'
import CurrencySearchModal from './SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../../../components/Logo'

import { RowBetween } from '../../../components/Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem;
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  background: ${({ theme }) => theme.colors.input};
`
// border: 1px solid ${({ theme }) => theme.colors.input};
// background: linear-gradient(250deg, #17264f 0%, hsl(220, 51%, 23%) 100%);

interface CurrencyInputPanelProps {
  value: string
  origin: number
  destination: number
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  // showCommonBases?: boolean
}
export default function CurrencyInputPanel({
  value,
  origin,
  destination,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
}: // showCommonBases,
CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const translatedLabel = label || t('Input')
  const { chainId } = useActiveWeb3React()
  const token = currency ? Object.prototype.hasOwnProperty.call(currency, 'address') : undefined

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      origin={origin}
      destination={destination}
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      // showCommonBases={showCommonBases}
    />,
  )

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
              {account && (
                <Text onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button onClick={onMax} scale="sm" variant="text">
                  MAX
                </Button>
              )}
            </>
          )}
          <CurrencySelectButton
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} chain={chainId} />
              ) : null}
              {pair ? (
                <Text id="pair">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair">
                  {/* {chainId === 1 ? `ETH` : chainId === 128 ? `HT` : (currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select a currency')} */}
                  {currency && currency.symbol
                    ? token
                      ? currency.symbol
                      : chainId === 1 && currency.symbol === 'ELA'
                      ? 'ETH'
                      : chainId === 128 && currency.symbol === 'ELA'
                      ? 'HT'
                      : chainId === 56 && currency.symbol === 'ELA'
                      ? 'BNB'
                      : currency.symbol
                    : t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
