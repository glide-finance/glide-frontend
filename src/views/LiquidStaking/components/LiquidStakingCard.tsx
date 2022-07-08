import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, Text, CardBody } from '@glide-finance/uikit'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  justify-content: center;
  border-radius: 16px;
  min-width: 50%;
`

const LiquidStakingCard = () => {
  return (
    <Body>
      <Flex justifyContent="center" flexDirection="column">
        <Heading scale="xl" color="secondary">
          Stake Elastos
        </Heading>
        <Text fontSize="16px" color="text" mb="8px">
          Stake ELA and use stELA while earning rewards
        </Text>
      </Flex>
    </Body>
  )
}

export default LiquidStakingCard
