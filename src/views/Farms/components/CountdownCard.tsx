import React from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  Heading,
  Skeleton,
} from '@glide-finance/uikit'
import { ESC_BLOCK_TIME } from 'config'
import { useTranslation } from 'contexts/Localization'

interface CountdownCardProps {
  currentBlock: number
  targetBlock: number
}

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const CountdownCard: React.FC<CountdownCardProps> = ({ currentBlock, targetBlock }) => {
  const { t } = useTranslation()

  // const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
  //   placement: 'bottom-end',
  //   tooltipOffset: [20, 10],
  // })

  const blocksToGo = targetBlock - currentBlock < 0 ? 0 : targetBlock - currentBlock
  const timeRemaining = blocksToGo * ESC_BLOCK_TIME

  const days = Math.floor(timeRemaining / (60 * 60 * 24))
  const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((timeRemaining % (60 * 60)) / (60))
  const seconds = Math.floor((timeRemaining % (60)))

  return (
    <>
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="20px" bold color="textSubtle" mr="4px">
                {t('GLIDE Farming Start')}
              </Text>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {currentBlock ? (
                  <>
                    <Text fontSize="18px">{blocksToGo} {t('blocks')}</Text>
                    <Text fontSize="18px">{days}d, {hours}h, {minutes}m, {seconds}s</Text>
                  </>
                ) : (
                  <Skeleton height={18} width={96} mb="2px" />
                )}
                
                {/* { blocksToGo > 0 ? (
                  <Balance fontSize="20px" bold value={targetBlock} decimals={0} />
                ) : (
                  // <Skeleton height={20} width={96} mb="2px" />
                  <Balance fontSize="20px" bold value={0} decimals={0} />
                  <Text fontSize="20px">{t('')}</Text>

                )} */}
              </Heading>
            </Flex>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default CountdownCard
