import { Token as SDKToken, Pair, ChainId } from '@glide-finance/sdk'
import tokens from './tokens'
import { FarmAuctionBidderConfig, Token } from './types'

const getLpAddress = (token: string, quoteToken: Token) => {
  const tokenAsToken = new SDKToken(ChainId.MAINNET, token, 18)
  const quoteTokenAsToken = new SDKToken(ChainId.MAINNET, quoteToken.address[56], 18)
  return Pair.getAddress(tokenAsToken, quoteTokenAsToken)
}

export const whitelistedBidders: FarmAuctionBidderConfig[] = [
  // {
  //   account: '0x9Ed5a62535A5Dd2dB2d9bB21bAc42035Af47F630',
  //   farmName: 'NAV-BNB',
  //   tokenAddress: '0xbfef6ccfc830d3baca4f6766a0d4aaa242ca9f3d',
  //   quoteToken: tokens.wela,
  //   tokenName: 'Navcoin',
  //   projectSite: 'https://navcoin.org/en',
  // },
  
].map((bidderConfig) => ({
  ...bidderConfig,
  lpAddress: getLpAddress(bidderConfig.tokenAddress, bidderConfig.quoteToken),
}))

const UNKNOWN_BIDDER: FarmAuctionBidderConfig = {
  account: '',
  tokenAddress: '',
  quoteToken: tokens.wela,
  farmName: 'Unknown',
  tokenName: 'Unknown',
}

export const getBidderInfo = (account: string): FarmAuctionBidderConfig => {
  const matchingBidder = whitelistedBidders.find((bidder) => bidder.account === account)
  if (matchingBidder) {
    return matchingBidder
  }
  return { ...UNKNOWN_BIDDER, account }
}
