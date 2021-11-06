import { ContextApi } from 'contexts/Localization/types'
import { MenuItemsType, DropdownMenuItemType } from '@glide-finance/uikit'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Home'),
    icon: 'Home',
    href: '/',
    showItemsOnMobile: false,
    showOnMobile: false
  },
  {
    label: t('Trade'),
    icon: 'Trade',
    href: '/swap',
    showItemsOnMobile: false
  },
  {
    label: t('Farm'),
    icon: 'Farm',
    href: '/farms',
    showItemsOnMobile: false
  },
  {
    label: t('Stake'),
    icon: 'Pool',
    href: '/pools',
    showItemsOnMobile: false
  },
  {
    label: t('Bridge'),
    icon: 'Bridge',
    href: '/bridge',
    showItemsOnMobile: false
  },
  {
    label: '',
    href: '/info',
    icon: 'More',
    hideSubNav: true,
    showOnDesktop: false,
    items: [
      {
        type: DropdownMenuItemType.PRICE,
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        type: DropdownMenuItemType.SOCIALS,
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: t('Docs & Help'),
        href: 'https://docs.glidefinance.io',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Info'),
        href: '/info',
      },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/glide-finance',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // }
    ],
  },
]

export default config

