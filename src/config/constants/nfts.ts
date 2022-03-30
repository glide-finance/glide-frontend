import { Nft, NftSource, NftType } from './types'

// export const IPFS_GATEWAY = 'https://cloudflare-ipfs.com'
export const IPFS_GATEWAY = 'https://ipfs0.trinity-feeds.app/'

export const nftSources: NftSource = {
  [NftType.PHANTZ]: {
    address: {
      20: '0x020c7303664bc88ae92cE3D380BF361E03B78B81',
    },
    creator: 'https://assist.trinity-feeds.app/sticker/api/v1/query?creator=0x44016ed8638f5B517a5beC7a722A56d1DEBefef7',
    identifierKey: 'image',
  },
}
//
/**
 * NOTE: https://cloudflare-ipfs.com does not support video streaming so for the video URLS we need to use
 * https://gateway.pinata.cloud
 */

const Nfts: Nft[] = [
  {
    name: 'Phantz Club',
    description:
      'Phantz are here to improve the formation of Web3 communities. Only 2822 memberships to the Phantz Club will be created, ever. Your NFT is a unique identity and programmatically generated to provide exclusive access to the club!',
    images: {
      lg: 'phantz.png',
      md: 'phantz.png',
      sm: 'phantz.png',
      ipfs: 'https://ipfs0.trinity-feeds.app/ipfs/QmPGtSuHX1eY9eZbSD2bzDtiRBvAhTR1v4fK9a1K4wpzxF',
    },
    sortOrder: 999,
    identifier: 'phantz',
    type: NftType.PHANTZ,
    variationId: 1,
  }
]

export default Nfts
