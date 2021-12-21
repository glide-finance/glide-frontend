import { ChainId } from '@glide-finance/sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const ESC_BLOCK_TIME = 5

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://esc.elastos.io',
  [ChainId.TESTNET]: 'https://eth-testnet.elastos.io',
}

export const GLIDE_PER_BLOCK = new BigNumber(3)
export const BLOCKS_PER_YEAR = new BigNumber((60 / ESC_BLOCK_TIME) * 60 * 24 * 365) // 6307200
// export const GLIDE_PER_YEAR = GLIDE_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const GLIDE_START_BLOCK = new BigNumber(9255555)
export const GLIDE_BONUS_PERIOD = new BigNumber(1572480)
export const GLIDE_REDUCTION_PERIOD = new BigNumber(3144960)
export const BASE_URL = 'https://glidefinance.io'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_URL}/pool`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 300000
export const DEFAULT_GAS_PRICE = 1
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
