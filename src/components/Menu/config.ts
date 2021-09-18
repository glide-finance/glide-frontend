import { MenuEntry } from '@glide-finance/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Swap'), // Trade
    icon: 'TradeIcon',
    href: '/swap',
  },
  // {
  //   label: t('Liquidity'),
  //   icon: 'TradeIcon',
  //   href: '/pool',
  // },
  {
    label: t('Farm'), // Farms
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Stake'), // Pools
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Bridge'),
    icon: 'TradeIcon',
    href: '/bridge',
  },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: t('Collectibles'),
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
  // {
  //   label: t('Info'),
  //   icon: 'InfoIcon',
  //   href: 'https://pancakeswap.info',
  // },
  // {
  //   label: t('IFO'),
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  // {
  //   label: t('More'),
  //   icon: 'MoreIcon',
  //   items: [
  //     // {
  //     //   label: t('Voting'),
  //     //   href: '/voting',
  //     // },
  //     {
  //       label: t('Github'),
  //       href: 'https://github.com/glide-finance',
  //     },
  //     {
  //       label: t('Docs'),
  //       href: 'https://docs.glidefinance.io/',
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://medium.com/glide-finance',
  //     },
  //     // {
  //     //   label: t('Merch'),
  //     //   href: 'https://pancakeswap.creator-spring.com/',
  //     // },
  //   ],
  // },
]

export default config
