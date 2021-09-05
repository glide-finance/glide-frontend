import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import bridgesConfig from 'config/constants/bridges'
// import isArchivedPid from 'utils/bridgeHelpers'
// import priceHelperLpsConfig from 'config/constants/priceHelperLps'
// import { fetchBridgeUserAllowances } from './fetchBridgeUser'
// import { BridgesState, Bridge } from '../types'

// const noAccountBridgeConfig = bridgesConfig.map((bridge) => ({
//   ...bridge,
//   userData: {
//     allowance: '0'
//   },
// }))

// const initialState: BridgesState = { data: noAccountBridgeConfig, loadArchivedBridgesData: false, userDataLoaded: false }

// export const nonArchivedBridges = bridgesConfig.filter(({ pid }) => !isArchivedPid(pid))

// interface BridgeUserDataResponse {
//   pid: number
//   allowance: string
//   tokenBalance: string
//   stakedBalance: string
//   earnings: string
// }

// export const fetchBridgeUserDataAsync = createAsyncThunk<BridgeUserDataResponse[], { account: string; pids: number[] }>(
//   'bridges/fetchBridgeUserDataAsync',
//   async ({ account, pids }) => {
//     const bridgesToFetch = bridgesConfig.filter((bridgeConfig) => pids.includes(bridgeConfig.pid))
//     const userBridgeAllowances = await fetchBridgeUserAllowances(account, bridgesToFetch)
//     const userBridgeTokenBalances = await fetchBridgeUserTokenBalances(account, bridgesToFetch)
//     const userStakedBalances = await fetchBridgeUserStakedBalances(account, bridgesToFetch)
//     const userBridgeEarnings = await fetchBridgeUserEarnings(account, bridgesToFetch)

//     return userBridgeAllowances.map((bridgeAllowance, index) => {
//       return {
//         pid: bridgesToFetch[index].pid,
//         allowance: userBridgeAllowances[index],
//         tokenBalance: userBridgeTokenBalances[index],
//         stakedBalance: userStakedBalances[index],
//         earnings: userBridgeEarnings[index],
//       }
//     })
//   },
// )

// export const bridgesSlice = createSlice({
//   name: 'Bridges',
//   initialState,
//   reducers: {
//     setLoadArchivedBridgesData: (state, action) => {
//       const loadArchivedBridgesData = action.payload
//       state.loadArchivedBridgesData = loadArchivedBridgesData
//     },
//   },
//   extraReducers: (builder) => {
//     // Update bridges with user data
//     builder.addCase(fetchBridgeUserDataAsync.fulfilled, (state, action) => {
//       action.payload.forEach((userDataEl) => {
//         const { pid } = userDataEl
//         const index = state.data.findIndex((bridge) => bridge.pid === pid)
//         state.data[index] = { ...state.data[index], userData: userDataEl }
//       })
//       state.userDataLoaded = true
//     })
//   },
// })

// // Actions
// export const { setLoadArchivedBridgesData } = bridgesSlice.actions

// export default bridgesSlice.reducer

export {}