import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, CardBody, Box, ButtonMenu, ButtonMenuItem } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import StakeSection from './StakeSection'
import UnstakeSection from './UnstakeSection'
import WithdrawSection from './WithdrawSection'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  justify-content: center;
  border-radius: 16px;
  min-width: 50%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 500px;
  }
`

const CustomButtonMenu = styled(ButtonMenu)`
  width: 100%;
  margin: 12px 0;
`

const LiquidStakingWidget = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <Body>
      <Flex justifyContent="center" flexDirection="column">
        <Heading scale="lg" color="secondary">
          Stake Elastos
        </Heading>
        <Text fontSize="16px" color="text" mb="8px" mt="8px">
          Stake ELA and use stELA while earning staking rewards
        </Text>
      </Flex>
      <Box>
        <CustomButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="subtle">
          <ButtonMenuItem p="0 12px" as="button">
            {t('Stake')}
          </ButtonMenuItem>
          <ButtonMenuItem p="0 12px" as="button">
            {t('Unstake')}
          </ButtonMenuItem>
          <ButtonMenuItem p="0 12px" as="button">
            {t('Withdraw')}
          </ButtonMenuItem>
        </CustomButtonMenu>
      </Box>
      <Flex>
        {activeIndex === 0 && <StakeSection />}
        {activeIndex === 1 && <UnstakeSection />}
        {activeIndex === 2 && <WithdrawSection />}
      </Flex>
    </Body>
  )
}

export default LiquidStakingWidget
