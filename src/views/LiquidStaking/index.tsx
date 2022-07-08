import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, Heading, LinkExternal } from '@glide-finance/uikit'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Page from 'components/Layout/Page'
import { GradientHeader, AppBody } from '../../components/App'
import LiquidStakingCard from './components/LiquidStakingCard'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  grid-template-columns: repeat(1, auto);
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
    padding: 0 16px;
    justify-content: space-between;
  }
`

const StatBox = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 14px;
  margin: 0 16px 16px 0;
`

export default function Pool() {
  const { account, library, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <Page>
      {/* <AppBody> */}
      {/* <GradientHeader title={t('Your Liquidity')} subtitle={t('Deconstruct LP tokens')} />
        <Body>
            Hello
        </Body> */}
      <Flex flexWrap="wrap" justifyContent="center">
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              stELA/ELA price
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              1.0012 ELA
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ≈ $1.56
            </Text>
          </Flex>
        </StatBox>
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              Total ELA staked
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              95,636 ELA
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ≈ $103k
            </Text>
          </Flex>
        </StatBox>
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              Epoch
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              43%
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ETA: 6d 9h 43m
            </Text>
          </Flex>
        </StatBox>
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              APY
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              1.08%
            </Text>
          </Flex>
          <Flex>
            <LinkExternal href="https://coke.com" fontSize="14px" color="secondary">
              See stats
            </LinkExternal>
          </Flex>
        </StatBox>
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              Validators
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              17
            </Text>
          </Flex>
          <Flex>
            <LinkExternal href="https://coke.com" fontSize="14px" color="secondary">
              Methodology
            </LinkExternal>
          </Flex>
        </StatBox>
      </Flex>
      <Flex justifyContent="center" mt="48px">
        <LiquidStakingCard />
      </Flex>
      {/* </AppBody> */}
    </Page>
  )
}
