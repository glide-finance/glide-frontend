import { useEffect } from 'react'
import { useCakeUsdcPrice } from 'hooks/useUSDCPrice'

const useGetDocumentTitlePrice = () => {
  const cakePriceUsdc = useCakeUsdcPrice()
  useEffect(() => {
    const cakePriceUsdcString = cakePriceUsdc ? cakePriceUsdc.toFixed(2) : ''
    document.title = `Pancake Swap - ${cakePriceUsdcString}`
  }, [cakePriceUsdc])
}
export default useGetDocumentTitlePrice