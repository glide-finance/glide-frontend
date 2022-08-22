import React from 'react'
import styled from 'styled-components'
import { HelpIcon, useTooltip } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'

const ReferenceElement = styled.div`
  display: inline-block;
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const LimitExplainer: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('The maximum number of ELA that can be staked at the moment'),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  return (
    <Container>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="text" width="16px" height="16px" mt="2px" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default LimitExplainer
