// import BigNumber from 'bignumber.js'
// import erc20ABI from 'config/abi/erc20.json'
// import masterchefABI from 'config/abi/masterchef.json'
// import multicall from 'utils/multicall'
// import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
// import { FarmConfig } from 'config/constants/types'

// export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
//   const masterChefAddress = getMasterChefAddress()

//   const calls = farmsToFetch.map((farm) => {
//     const lpContractAddress = getAddress(farm.lpAddresses)
//     return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
//   })

//   const rawLpAllowances = await multicall(erc20ABI, calls)
//   const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
//     return new BigNumber(lpBalance).toJSON()
//   })
//   return parsedLpAllowances
// }

export {}