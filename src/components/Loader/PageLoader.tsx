import React from 'react'
import styled from 'styled-components'
import { ButterflyLoader } from '@glide-finance/uikit'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <ButterflyLoader />
    </Wrapper>
  )
}

export default PageLoader
