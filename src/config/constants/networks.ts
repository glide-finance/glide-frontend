import { ChainId } from '@glide-finance/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.elastos.io/eth',
  [ChainId.TESTNET]: 'https://api-testnet.elastos.io/eth',
}

export default NETWORK_URLS
