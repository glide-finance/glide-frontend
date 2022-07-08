import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Flex } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import GliderSuccessImage from './peak.png'

const StyledNav = styled.nav`
  align-self: center;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 0;
    margin-left: 20px;
  }
`

const StyledButtonMenu = styled(ButtonMenu)`
  border: none;
`

const Glider = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/pool') ||
    pathname.includes('/create') ||
    pathname.includes('/add') ||
    pathname.includes('/remove') ||
    pathname.includes('/find') ||
    pathname.includes('/liquidity') ||
    pathname.includes('/bridge')
  ) {
    return 1
  }
  return 0
}

const Nav = () => {
  const location = useLocation()
  const { t } = useTranslation()
  return (
    <Flex flexDirection={['row', null, null, 'row']}>
      <Glider>
        <img src={GliderSuccessImage} alt="Submitted" width="80px" height="71px" />
      </Glider>
      <StyledNav>
        <StyledButtonMenu activeIndex={getActiveIndex(location.pathname)} scale="sm" variant="subtle">
          <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
            {t('Swap')}
          </ButtonMenuItem>
          <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
            {t('Liquidity')}
          </ButtonMenuItem>
        </StyledButtonMenu>
      </StyledNav>
    </Flex>
  )
}

export default Nav
