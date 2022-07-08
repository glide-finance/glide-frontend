import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@glide-finance/sdk'
import { Text } from '@glide-finance/uikit'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
// import { wrappedCurrency } from 'utils/wrappedCurrency'
// import { LightGreyCard } from 'components/Card'
// import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedActiveList } from 'state/lists/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useIsUserAddedToken } from 'hooks/Tokens'
import Column from 'components/Layout/Column'
import { RowFixed, RowBetween } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import CircleLoader from 'components/Loader/CircleLoader'
import { isTokenOnList } from 'utils'
// import ImportRow from './ImportRow'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

// const FixedContentRow = styled.div`
//   padding: 4px 28px;
//   height: 56px;
//   display: grid;
//   grid-gap: 16px;
//   align-items: center;
// `

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 4px 28px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

function CurrencyRow({
  origin,
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  origin: number
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const token = currency ? Object.prototype.hasOwnProperty.call(currency, 'address') : undefined

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} chain={origin} />
      <Column>
        {/* <Text bold>{token ? currency.symbol : currency.symbol === 'ELA' && chainId === 1 ? 'ETH' : currency.symbol === 'ELA' && chainId === 128 ? 'HT' : currency.symbol}</Text> */}
        <Text bold>
          {token
            ? currency.symbol
            : origin === 20
            ? 'ELA'
            : origin === 1
            ? 'ETH'
            : origin === 128
            ? 'HT'
            : origin === 56 && 'BNB'}
        </Text>
        {/* <Text color="textSubtle" small ellipsis maxWidth="200px">
          {!isOnSelectedList && customAdded && 'Added by user •'} {token ? currency.name : currency.symbol === 'ELA' && chainId === 1 ? 'Ethereum' : currency.symbol === 'ELA' && chainId === 128 ? 'Huobi Token' : currency.symbol === 'ELA' && chainId === 20 ? 'Elastos' : currency.name }
        </Text> */}
        <Text color="textSubtle" small ellipsis maxWidth="200px">
          {!isOnSelectedList && customAdded && t('Added by user')}
          {'• '}
          {token
            ? currency.name
            : origin === 20
            ? 'Elastos'
            : origin === 1
            ? 'Ethereum'
            : origin === 128
            ? 'Huobi Token'
            : origin === 56 && 'Binance Coin'}
        </Text>
      </Column>
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <CircleLoader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  origin,
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  // showImportView,
  // setImportToken,
  breakIndex,
}: {
  origin: number
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  // showImportView: () => void
  // setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencies] : currencies
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, showETH])

  // const { chainId } = useActiveWeb3React()

  // const inactiveTokens: {
  //   [address: string]: Token
  // } = useAllInactiveTokens()

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)

      // const token = wrappedCurrency(currency, chainId)
      // const showImport = inactiveTokens && token && Object.keys(inactiveTokens).includes(token.address)

      // if (index === breakIndex || !data) {
      //   return (
      //     <FixedContentRow style={style}>
      //       <LightGreyCard padding="8px 12px" borderRadius="8px">
      //         <RowBetween>
      //           <Text small>{t('Expanded results from inactive Token Lists')}</Text>
      //           <QuestionHelper
      //             text={t(
      //               "Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists.",
      //             )}
      //             ml="4px"
      //           />
      //         </RowBetween>
      //       </LightGreyCard>
      //     </FixedContentRow>
      //   )
      // }

      // if (showImport && token) {
      //   return (
      //     <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
      //   )
      // }
      return (
        <CurrencyRow
          origin={origin}
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [origin, onCurrencySelect, otherCurrency, selectedCurrency],
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
