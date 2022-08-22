import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, Text, CardBody, Box, ChevronDownIcon, ChevronUpIcon } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'

const FAQContainer = styled(Box)`
  justify-content: center;
  border-radius: 16px;
  min-width: 45%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 480px;
  }
`

const accordionData = [
  {
    id: 1,
    title: 'How do I get my staking rewards?',
    content: `stELA represents both your deposit and the rewards you earn on your ELA each epoch. There is no need to claim your rewards. Instead, stELA acts as a share of the total pool of staked ELA. Since this pool accumulates staking rewards, your share (represented by your stELA) enables you to withdraw more ELA each epoch.`,
  },
  {
    id: 2,
    title: 'Can I unstake at any time?',
    content: `Yes. The protocol allows users to unstake without any fee, but it will take up to 10 days for the funds to be available for withdrawal. For an instant option, users can swap on a supported DEX or use our instant swap feature (not yet available) for a fee.`,
  },
  {
    id: 3,
    title: 'Where can I use stELA?',
    content: `As of now, stELA is only supported on Glide via the stELA-ELA liquidity pool, allowing users to earn fees and token incentives without risk of impermanent loss. In the future, the hope to expand the use cases for stELA, such as use as collateral on lending protocols to enable more advanced DeFi recipes.`,
  },
  {
    id: 4,
    title: 'Why is the staking APY so low?',
    content: `ELA's annual inflation rate is less than 2%, of which only 35% is issued to stakers. In addition, the current DPoS model does not mandate rewards for delegators, but this is expected to change with the rollout of DPoS 2.0 and should result in more predictable yield.`,
  },
]

const FAQ = () => {
  const { t } = useTranslation()
  const [selectedItem, setSelectedItem] = useState(0)

  const handleClick = (id: number) => {
    setSelectedItem(id)
  }

  return (
    <FAQContainer>
      <Flex flexDirection="column" justifyContent="center">
        <Text bold fontSize="24px" textAlign="left">
          FAQ
        </Text>
        <Flex flexDirection="column" justifyContent="center" p="16px">
          {accordionData.map(({ title, content, id }) => (
            <Accordion
              key={id}
              id={id}
              title={title}
              content={content}
              onClick={handleClick}
              selectedItem={selectedItem}
            />
          ))}
        </Flex>
      </Flex>
    </FAQContainer>
  )
}

export default FAQ

const Accordion = ({ title, content, id, onClick, selectedItem }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onToggle = (itemId: number) => {
    onClick(itemId)
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    setIsOpen(selectedItem === id)
  }, [selectedItem, id])

  return (
    <Flex flexDirection="column" flexWrap="wrap" mb="12px" style={{ display: 'inline', cursor: 'pointer' }}>
      <Box onClick={() => onToggle(id)}>
        <Flex justifyContent="space-between">
          <Text fontSize="18px">{title}</Text>
          {isOpen ? <ChevronUpIcon width="24px" /> : <ChevronDownIcon width="24px" />}
        </Flex>
      </Box>
      {isOpen && (
        <Text padding="12px 12px" fontSize="14px">
          {content}
        </Text>
      )}
    </Flex>
  )
}
