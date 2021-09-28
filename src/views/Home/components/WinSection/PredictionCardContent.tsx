import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Skeleton, Link, Button, ArrowForwardIcon, Heading } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { usePriceBnbUsdc } from 'state/farms/hooks'

const StyledLink = styled(Link)`
  width: 100%;
`

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { slowRefresh } = useRefresh()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbUsdcPrice = usePriceBnbUsdc()
  const [bnbWon, setBnbWon] = useState(0)
  const [bnbWonInUsd, setBnbWonInUsd] = useState(0)

  const localisedBnusdcString = formatLocalisedCompactNumber(bnbWonInUsd)
  const bnbWonText = t('$%bnbWonInUsd% in BNB won so far', { bnbWonInUsd: localisedBnusdcString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnusdcString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const fetchMarketData = async () => {
      const totalWon = await getTotalWon()
      setBnbWon(totalWon)
    }

    if (loadData) {
      fetchMarketData()
    }
  }, [slowRefresh, loadData])

  useEffect(() => {
    if (bnbUsdcPrice.gt(0) && bnbWon > 0) {
      setBnbWonInUsd(bnbUsdcPrice.times(bnbWon).toNumber())
    }
  }, [bnbUsdcPrice, bnbWon])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <div ref={observerRef} />
        <Text color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </Text>
        {bnbWonInUsd ? (
          <Heading color="#280D5F" my="8px" scale="xl" bold>
            {pretext}
            {localisedBnusdcString}
          </Heading>
        ) : (
          <>
            <Skeleton width={230} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="#280D5F" mb="24px" bold fontSize="16px">
          {wonSoFar}
        </Text>
        <Text color="#280D5F" mb="40px">
          {t('Will BNB price rise or fall? guess correctly to win!')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink href="/prediction" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
