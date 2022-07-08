import { Currency, ETHER, Token } from '@glide-finance/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ELA'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
