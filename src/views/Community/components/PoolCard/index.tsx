import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@glide-finance/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Community } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: Community; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, pairToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    // <StyledCard
    //   isFinished={isFinished && sousId !== 0}
    //   ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    // >
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardHeader
        earningToken={earningToken}
        stakingToken={stakingToken}
        pairToken={pairToken}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow pool={pool} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
