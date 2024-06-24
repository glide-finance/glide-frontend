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
    const params = BRIDGE_NETWORKS[chainId]
    try {
      // Switch to the network if it's already added
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: params.chainId }],
      })
      return true
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add the network to MetaMask
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: params.chainId,
                chainName: params.chainName,
                nativeCurrency: params.nativeCurrency,
                rpcUrls: params.rpcUrls,
                blockExplorerUrls: params.blockExplorerUrls,
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Failed to add the network to MetaMask:', addError)
          return false
        }
      } else {
        console.error('Failed to switch the network in MetaMask:', switchError)
        return false
      }
    }
  } else {
    console.error("Can't setup the network on MetaMask because window.ethereum is undefined")
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
