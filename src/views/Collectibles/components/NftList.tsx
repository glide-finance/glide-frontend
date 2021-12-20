// @ts-nocheck
import React from 'react'
// import orderBy from 'lodash/orderBy'
// import { useWeb3React } from '@web3-react/core'
// import nfts from 'config/constants/nfts'
// import { useAppDispatch } from 'state'
// import { fetchWalletNfts } from 'state/collectibles'
import { useGetCollectibles } from 'state/collectibles/hooks'
// import NftCard from './NftCard'
// import NftGrid from './NftGrid'

// const nftComponents = {
//   'easter-storm': EasterNftCard,
//   'easter-flipper': EasterNftCard,
//   'easter-caker': EasterNftCard,
// }

const NftList = () => {
  const { tokenIds, isLoading } = useGetCollectibles()
  // const dispatch = useAppDispatch()
  // const { account } = useWeb3React()

  // const handleRefresh = () => {
  //   dispatch(fetchWalletNfts(account))
  // }

  return (
    <div>
      {!isLoading &&
        tokenIds.map((token) => {
          return (
            <img
              key={token.name}
              src={`https://ipfs0.trinity-feeds.app/ipfs/${token.asset.split(':')[2]}`}
              alt=""
              height={200}
              width={200}
            />
          )
        })}
    </div>
  )
  // return (
  //   <NftGrid>
  //     {orderBy(nfts, 'sortOrder').map((nft) => {
  //       const Card = nftComponents[nft.identifier] || NftCard

  //       return (
  //         <div key={nft.name}>
  //           <Card nft={nft} tokenIds={tokenIds[nft.identifier]} refresh={handleRefresh} />
  //         </div>
  //       )
  //     })}
  //   </NftGrid>
  // )
}

export default NftList
