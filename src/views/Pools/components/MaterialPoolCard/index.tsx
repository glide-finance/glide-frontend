import React from 'react'
import styled from 'styled-components'
import { CardBody, Flex, Text } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import tokens from 'config/constants/tokens'
import { useMaterialPool } from 'state/pools/hooks'
import { Pool } from 'state/types'
import AprRow from '../PoolCard/AprRow'
import { StyledCard } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import StyledCardHeader from '../PoolCard/StyledCardHeader'
// import VaultCardActions from './VaultCardActions'
import DividendCardActions from './DividendCardActions'
// import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
// import RecentCakeProfitRow from './RecentCakeProfitRow'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface MaterialPoolProps {
  pool: Pool
  showStakedOnly: boolean
}

const MaterialPoolCard: React.FC<MaterialPoolProps> = ({ pool, showStakedOnly }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    userData: { isLoading, allowance, stakingTokenBalance, materialStakedBalance: stakedBalance, pendingReward },
    apr,
  } = useMaterialPool()

  const materialPool = {
    ...pool,
    userData: { allowance, stakingTokenBalance, stakedBalance, pendingReward },
    apr,
  }

  const accountHasSharesStaked = stakedBalance && stakedBalance.gt(0)
  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard isActive>
      <StyledCardHeader
        isStaking={accountHasSharesStaked}
        isMaterialPool
        earningToken={tokens.mtrl}
        stakingToken={tokens.mtrl}
      />
      <StyledCardBody isLoading={isLoading}>
        <AprRow pool={materialPool} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            // <VaultCardActions pool={pool} accountHasSharesStaked={accountHasSharesStaked} isLoading={isLoading} />
            <DividendCardActions pool={materialPool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter pool={materialPool} account={account} />
    </StyledCard>
  )
}

export default MaterialPoolCard
