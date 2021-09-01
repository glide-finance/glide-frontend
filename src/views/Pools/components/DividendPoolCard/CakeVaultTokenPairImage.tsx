import React from 'react'
import { TokenPairImage, ImageProps } from '@glide-finance/uikit'
import tokens from 'config/constants/tokens'
import { getAddress } from 'utils/addressHelpers'

const CakeVaultTokenPairImage: React.FC<Omit<ImageProps, 'src'>> = (props) => {
  const primaryTokenSrc = `/images/tokens/${getAddress(tokens.glide.address)}.svg`
  const secondaryTokenSrc = `/images/tokens/${getAddress(tokens.ela.address)}.svg`

  return <TokenPairImage primarySrc={primaryTokenSrc} secondarySrc={secondaryTokenSrc} {...props} />
}

export default CakeVaultTokenPairImage
