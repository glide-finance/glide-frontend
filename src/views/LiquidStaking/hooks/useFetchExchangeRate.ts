import { useEffect, useState } from 'react'
import { useLiquidStaking } from 'hooks/useContract'

export const useFetchExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState('')
  const [exchangeRateFetched, setExchangeRateFetched] = useState(false)
  const liquidStakingContract = useLiquidStaking()

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = (await liquidStakingContract.exchangeRate()).toString()
        setExchangeRate(response)
        setExchangeRateFetched(true)
      } catch (error) {
        setExchangeRateFetched(false)
      }
    }

    fetchExchangeRate()
  }, [liquidStakingContract])

  return { exchangeRateFetched, exchangeRate }
}