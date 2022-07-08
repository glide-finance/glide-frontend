import { ChainId, JSBI, Percent, Token, WETH } from '@glide-finance/sdk'
import { USDC, GLIDE, WELA } from './tokens'

export const ROUTER_ADDRESS = '0xec2f2b94465Ee0a7436beB4E38FC8Cf631ECf7DF'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [],
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], GLIDE[ChainId.MAINNET], USDC[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WETH[ChainId.TESTNET], GLIDE[ChainId.TESTNET], USDC[ChainId.TESTNET]],
  [ChainId.BINANCE]: [],
  [ChainId.HECO]: [],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [],
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], USDC[ChainId.MAINNET], GLIDE[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WETH[ChainId.TESTNET], GLIDE[ChainId.TESTNET], USDC[ChainId.TESTNET]],
  [ChainId.BINANCE]: [],
  [ChainId.HECO]: [],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [],
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], USDC[ChainId.MAINNET], GLIDE[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WETH[ChainId.TESTNET], GLIDE[ChainId.TESTNET], USDC[ChainId.TESTNET]],
  [ChainId.BINANCE]: [],
  [ChainId.HECO]: [],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [[GLIDE[ChainId.MAINNET], WELA]],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const VALIDATOR_TIMEOUT = 300000 // Milliseconds

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = []

export const APPROVE_BALANCE_ADDRESSES: string[] = [
  '0xaA9691BcE68ee83De7B518DfCBBfb62C04B1C0BA', // Gold
  '0x44F57DF34e7873191f5aF7065B8348dD581c34DC', // Beer
]

export { default as farmsConfig } from './farms'
export { default as poolsConfig } from './pools'
export { default as communityConfig } from './community'
export { default as ifosConfig } from './ifo'
