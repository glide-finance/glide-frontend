import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Glide Finance',
  description:
    'The first incentivized AMM on ESC! Earn GLIDE through yield farming, then stake it in pools to earn more tokens!',
  image: 'https://glidefinance.io/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Glide Finance')}`,
      }
    // case '/competition':
    //   return {
    //     title: `${t('Trading Battle')} | ${t('Glide Finance')}`,
    //   }
    // case '/prediction':
    //   return {
    //     title: `${t('Prediction')} | ${t('Glide Finance')}`,
    //   }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Glide Finance')}`,
      }
    case '/pools':
      return {
        title: `${t('Stake')} | ${t('Glide Finance')}`,
      }
    case '/community':
      return {
        title: `${t('Community')} | ${t('Glide Finance')}`,
    }
    // case '/lottery':
    //   return {
    //     title: `${t('Lottery')} | ${t('Glide Finance')}`,
    //   }
    // case '/collectibles':
    //   return {
    //     title: `${t('Collectibles')} | ${t('Glide Finance')}`,
    //   }
    // case '/ifo':
    //   return {
    //     title: `${t('Initial Farm Offering')} | ${t('Glide Finance')}`,
    //   }
    // case '/teams':
    //   return {
    //     title: `${t('Leaderboard')} | ${t('Glide Finance')}`,
    //   }
    // case '/profile/tasks':
    //   return {
    //     title: `${t('Task Center')} | ${t('Glide Finance')}`,
    //   }
    // case '/profile':
    //   return {
    //     title: `${t('Your Profile')} | ${t('Glide Finance')}`,
    //   }
    default:
      return null
  }
}
