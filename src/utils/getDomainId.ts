import { BigNumber } from '@ethersproject/bignumber'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'

export const getDomainHexId = (name: string) => {
  return BigNumber.from(keccak256(toUtf8Bytes(name))).toHexString()
}
