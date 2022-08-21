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
    content: `Yes. Marinade allows you to directly swap your stELA back to ELA by using our ‘Unstake now’ option.

    If there is enough liquidity left after you unstake, the fee will be 0.3%. You can learn more about our fee structure here
    You can also unstake without any fee by using our ‘Delayed unstake’ option.`,
  },
  {
    id: 3,
    title: 'Where can I use stELA?',
    content: `stELA has been integrated by many protocols in the ELAana ecosystem! You can find a non-exhaustive list on our DeFi page. You can also track your stELA on sonar.watch and step.finance.

    stELA opens up new opportunities for you to cook your own DeFi recipes, adapted to your own needs and risk appetite. From single staking your stELA without any added risk to adventurous degen strategies, stELA can be marinated in all your DeFi recipes.
    
    Also keep in mind that stELA can be traded at its current value in exchange for any other cryptocurrency on a decentralized exchange without the need to unstake first.`,
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
    <Flex flexDirection="column" flexWrap="wrap">
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
