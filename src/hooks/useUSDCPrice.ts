import { ChainId, Currency, currencyEquals, JSBI, Price, WETH } from '@glide-finance/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { USDC, GLIDE } from '../config/constants/tokens'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const USDC_MAINNET = USDC[ChainId.MAINNET]

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
        chainId ? WETH[chainId] : undefined,
      ],
      [wrapped?.equals(USDC_MAINNET) ? undefined : wrapped, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
      [chainId ? WETH[chainId] : undefined, chainId === ChainId.MAINNET ? USDC_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WETH[chainId])
        return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle usdc
    if (wrapped.equals(USDC_MAINNET)) {
      return new Price(USDC_MAINNET, USDC_MAINNET, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(USDC_MAINNET).greaterThan(ethPairETHUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC_MAINNET, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(USDC_MAINNET).greaterThan('0') && ethPair.reserveOf(WETH[chainId]).greaterThan('0')) {
        const ethUsdcPrice = usdcEthPair.priceOf(USDC_MAINNET)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, USDC_MAINNET, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}

export const useCakeUsdcPrice = (): Price | undefined => {
  const { chainId } = useActiveWeb3React()
  const currentChaindId = chainId || ChainId.MAINNET
  const glideUsdcPrice = useUSDCPrice(GLIDE[currentChaindId])
  return glideUsdcPrice
}
