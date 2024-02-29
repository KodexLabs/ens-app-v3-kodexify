import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

export const formatUsd = (price: BigNumber, ethPrice: BigNumber) => {
  return `$${Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: 2,
    notation: 'compact',
  }).format(price.mul(ethPrice).div(BigNumber.from(10).pow(26)).toNumber())}`
}
