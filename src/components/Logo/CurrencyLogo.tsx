import { Currency, ETHER, Token } from '@glide-finance/sdk'
import { ElastosIcon, EthereumIcon, BinanceIcon, HecoIcon } from '@glide-finance/uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  chain,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  chain?: number
}) {
  // console.log(currency)
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    if (chain) {
      switch (chain) {
        case 1:
          return <EthereumIcon width={size} style={style} />
        case 20:
          return <ElastosIcon width={size} style={style} />
        case 56:
          return <BinanceIcon width={size} style={style} />
        case 128:
          return <HecoIcon width={size} style={style} />
        default:
          return <ElastosIcon width={size} style={style} />
      }
    } else {
      return <ElastosIcon width={size} style={style} />
    }
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
