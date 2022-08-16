import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, Text, CardBody, Box } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'

const FAQ = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" mb="12px">
        <Text>How do I get my staking rewards?</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="12px">
        <Text>Can I unstake at any time?</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="12px">
        <Text>Where can I use stELA?</Text>
      </Flex>
    </Box>
  )
}

export default FAQ
