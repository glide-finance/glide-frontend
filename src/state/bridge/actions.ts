import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('bridge/selectCurrency')
export const switchCurrencies = createAction<void>('bridge/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('bridge/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('bridge/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('bridge/setRecipient')
