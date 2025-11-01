import { useEffect, useState } from 'react'
import { getLiquidStakingContract } from 'utils/contractHelpers'
import useRefresh from 'hooks/useRefresh'

export const useFetchExchangeRate = () => {
  const { slowRefresh } = useRefresh()
  const [exchangeRate, setExchangeRate] = useState('10000')
  const [exchangeRateFetched, setExchangeRateFetched] = useState(false)
  const liquidStakingContract = getLiquidStakingContract()

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
  }, [liquidStakingContract, slowRefresh])

  return { exchangeRateFetched, exchangeRate }
}
