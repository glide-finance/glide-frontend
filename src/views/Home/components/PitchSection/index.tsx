import React from 'react'
import {
  // Heading,
  GradientHeading,
  Flex,
  // Text,
  // Skeleton,
  // ChartIcon,
  // CommunityIcon,
  // SwapIcon,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
// import { useGetStats } from 'hooks/api'
import useTheme from 'hooks/useTheme'
// import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import GraphicCard, { GraphicCardData } from '../GraphicCard'
import StatCardContent from './StatCardContent'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const TradeCardData: GraphicCardData = {
    icon: <img src="/images/home/pitch/trade.png"  alt={t('Trade')} />,
  }

  const LiquidityCardData: GraphicCardData = {
    icon: <img src="/images/home/pitch/wallet.png"  alt={t('Trade')} />,
  }

  const EarnCardData: GraphicCardData = {
    icon: <img src="/images/home/pitch/percent.png"  alt={t('Trade')} />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <GradientHeading textAlign="center" scale="xl" color="glide" mb="32px">
        {t('Why DeFi?')}
      </GradientHeading>
      {/* <Heading textAlign="center" scale="xl" mb="32px">
        {t('Trusted with billions.')}
      </Heading> */}
      {/* <Text textAlign="center" color="textSubtle">
        {t('PancakeSwap has the most users of any decentralized platform, ever.')}
      </Text>
      <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          {entrusting}
          <>{data ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
          {inFunds}
        </Text>
      </Flex>

      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Will you join them?')}
      </Text> */}

      <Flex flexDirection={['column', null, null, 'row']}>
        <GraphicCard {...TradeCardData} mr={['16px']} mb={['16px']}>
          <StatCardContent
            headingText={t('Trade Tokens')}
            bodyText={t('Swap tokens with minimal fees and arbitrage against other exchanges')}
            highlightColor={theme.colors.secondary}
          />
        </GraphicCard>
        <GraphicCard {...LiquidityCardData} mr={['16px']} mb={['16px']}>
          <StatCardContent
            headingText={t('Supply Liquidity')}
            bodyText={t('Contribute to a pool and collect swap fees')}
            highlightColor={theme.colors.primaryBright}
          />
        </GraphicCard>
        <GraphicCard {...EarnCardData} mr={['16px']} mb={['16px']}>
          <StatCardContent
            headingText={t('Earn at Farms')}
            bodyText={t('Stake your liquidity provider tokens in farms to earn GLIDE!')}
            highlightColor={theme.colors.secondary}
          />
        </GraphicCard>
      </Flex>
    </Flex>
  )
}

export default Stats
