import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'

export interface ElaPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const ELA_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      elaPrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      elaPrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      elaPrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      elaPrice
    }
  }
`

interface PricesResponse {
  current: {
    elaPrice: string
  }
  oneDay: {
    elaPrice: string
  }
  twoDay: {
    elaPrice: string
  }
  oneWeek: {
    elaPrice: string
  }
}

const fetchElaPrices = async (
  block24: number,
  block48: number,
  blockWeek: number,
): Promise<{ elaPrices: ElaPrices | undefined; error: boolean }> => {
  try {
    const data = await request<PricesResponse>(INFO_CLIENT, ELA_PRICES, {
      block24,
      block48,
      blockWeek,
    })
    return {
      error: false,
      elaPrices: {
        current: parseFloat(data.current?.elaPrice ?? '0'),
        oneDay: parseFloat(data.oneDay?.elaPrice ?? '0'),
        twoDay: parseFloat(data.twoDay?.elaPrice ?? '0'),
        week: parseFloat(data.oneWeek?.elaPrice ?? '0'),
      },
    }
  } catch (error) {
    console.error('Failed to fetch ELA prices', error)
    return {
      error: true,
      elaPrices: undefined,
    }
  }
}

/**
 * Returns ELA prices at current, 24h, 48h, and 7d intervals
 */
export const useElaPrices = (): ElaPrices | undefined => {
  const [prices, setPrices] = useState<ElaPrices | undefined>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  useEffect(() => {
    const fetch = async () => {
      const [block24, block48, blockWeek] = blocks
      const { elaPrices, error: fetchError } = await fetchElaPrices(block24.number, block48.number, blockWeek.number)
      if (fetchError) {
        setError(true)
      } else {
        setPrices(elaPrices)
      }
    }
    if (!prices && !error && blocks && !blockError) {
      fetch()
    }
  }, [error, prices, blocks, blockError])

  return prices
}
