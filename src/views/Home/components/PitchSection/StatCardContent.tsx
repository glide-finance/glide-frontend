import React from 'react'
import { Heading, Flex, Text } from '@glide-finance/uikit'

const StatCardContent: React.FC<{ headingText: string; bodyText: string; highlightColor: string }> = ({
  headingText,
  bodyText,
  highlightColor,
}) => {
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <Flex
      // minHeight={[null, null, null, '168px']}
      // minWidth="232px"
      // width="200px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={[null, null, null, '24px']}
    >
      <Heading scale="xl">{remainingWords}</Heading>
      <Heading color={highlightColor} scale="xl" mb="24px">
        {lastWord}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        {bodyText}
      </Text>
    </Flex>
  )
}

export default StatCardContent
