import { BigNumber } from '@ethersproject/bignumber'

export const formatEtherPrice = (
  price: string | number,
  returnNumber?: boolean,
  maximumFractionDigits?: number,
) => {
  if (!price) return ''

  const locale = typeof window === 'undefined' ? 'default' : navigator.language

  const transformedPrice =
    BigNumber.from(price.toString().replaceAll(',', '').replaceAll(' ', '').replace('.', ''))
      .div(BigNumber.from(10).pow(10))
      .toNumber() /
    10 ** 8

  if (returnNumber) return transformedPrice

  if (transformedPrice === 0) return 0

  if (transformedPrice < 0.0001) return '< 0.0001 ETH'

  if (transformedPrice < 0.001)
    return `${transformedPrice.toLocaleString(locale, {
      maximumFractionDigits: 4,
    })}ETH`

  if (transformedPrice < 0.01)
    return `${transformedPrice.toLocaleString(locale, {
      maximumFractionDigits: 3,
    })}ETH`

  if (transformedPrice < 1)
    return `${transformedPrice.toLocaleString(locale, {
      maximumFractionDigits: maximumFractionDigits ?? 2,
    })}ETH`

  return `${transformedPrice.toLocaleString(locale, {
    maximumFractionDigits: maximumFractionDigits ?? 1,
  })} ETH`
}
