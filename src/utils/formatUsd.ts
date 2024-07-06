import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

export const formatUsd = (price: string, ethPrice: BigNumber) => {
  return `$${Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: 2,
    notation: 'compact',
  }).format(BigNumber.from(price).mul(ethPrice).div(BigNumber.from(10).pow(26)).toNumber())}`
}
