import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import DOMPurify from 'dompurify'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const ARHTML = `<h1>Testing AR Input</h1>`;

const mySafeHTML = DOMPurify.sanitize(ARHTML);

const SafeARHTML = () => <div dangerouslySetInnerHTML={{ __html: mySafeHTML }} />;

export default SafeARHTML