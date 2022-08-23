import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, Heading, LinkExternal } from '@glide-finance/uikit'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Page from 'components/Layout/Page'
import { usePriceBnbUsdc } from 'state/farms/hooks'
import { getBalanceAmount, formatNumber } from 'utils/formatBalance'
import { useStelaTotalSupply } from 'hooks/useTokenBalance'
import { useFetchClaimStatus, useFetchEpochTimer, EPOCH_TIME } from './hooks/useFetchClaimStatus'
import { useFetchExchangeRate } from './hooks/useFetchExchangeRate'
import { GradientHeader, AppBody } from '../../components/App'
import LiquidStakingWidget from './components/LiquidStakingWidget'
import FAQ from './components/FAQ'

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
  const [liquidStakingTabIndex, setLiquidStakingTabIndex] = useState(0)
  const totalSupply = useStelaTotalSupply()
  const { exchangeRate } = useFetchExchangeRate()
  const elaPriceUsd = usePriceBnbUsdc()
  const { claimStatusFetched, claimStatus } = useFetchClaimStatus()
  const { epochTimerFetched, epochTimer, epochMs } = useFetchEpochTimer()

  const epochPercentage = (100 - (epochMs / EPOCH_TIME) * 100).toFixed(0)

  const stelaTotal = getBalanceAmount(totalSupply).toNumber() > 0 ? getBalanceAmount(totalSupply).toNumber() : 0

  return (
    <Page>
      <Flex flexWrap="wrap" justifyContent="center">
        <StatBox>
          <Flex>
            <Text fontSize="16px" mb="8px" color="secondary">
              stELA/ELA price
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="24px" mb="8px" color="text">
              {(Number(exchangeRate) / 10000).toFixed(4)} ELA
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ≈ ${stelaTotal > 0 ? (elaPriceUsd.toNumber() * (Number(exchangeRate) / 10000)).toFixed(2) : `0.00`}
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
              {stelaTotal > 0
                ? (stelaTotal * (Number(exchangeRate) / 10000)).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : `0.00`}{' '}
              ELA
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ≈ $
              {stelaTotal > 0
                ? formatNumber(elaPriceUsd.toNumber() * Number(getBalanceAmount(totalSupply)), 0, 0)
                : `0.00`}
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
              {epochPercentage}%
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="14px" color="textSubtle">
              ETA: {epochTimer}
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
              ~1.00%
            </Text>
          </Flex>
          <Flex>
            {/* <LinkExternal href="https://elanodes.com" fontSize="14px" color="secondary">
              See stats
            </LinkExternal> */}
            <Text fontSize="14px" color="textSubtle">
              (Pre-DPoS 2.0)
            </Text>
          </Flex>
        </StatBox>
      </Flex>
      <Flex justifyContent="center" mt="48px">
        <LiquidStakingWidget
          activeIndex={liquidStakingTabIndex}
          setActiveIndex={(index) => setLiquidStakingTabIndex(index)}
        />
      </Flex>
      <Flex justifyContent="center" mt="48px">
        <FAQ />
      </Flex>
    </Page>
  )
}
