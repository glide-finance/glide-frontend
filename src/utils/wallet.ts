// Set of helper functions to facilitate wallet setup
import { BASE_URL } from 'config'
import { BRIDGE_NETWORKS } from 'config/constants/networks'
import { Web3Provider } from '@ethersproject/providers'
// import useActiveWeb3React from '../hooks/useActiveWeb3React'
// import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add esc as a network on Metamask, or switch to eSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId: number, library?: Web3Provider) => {
  const provider = library ? library.provider : window.ethereum
  if (provider) {
    // const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
    const params = BRIDGE_NETWORKS[chainId]
    try {
      if (chainId === 1) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        })
      } else {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      }
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
      },
    },
  })

  return tokenAdded
}
