import { useQuery } from 'wagmi'

import { normalise } from '@ensdomains/ensjs/utils/normalise'

import { useEns } from '@app/utils/EnsProvider'
import { tryBeautify } from '@app/utils/beautify'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export const usePrimary = (address?: string, skip?: any) => {
  const { ready, getName } = useEns()

  return useQuery(
    useQueryKeys().primary(address!),
    async () => {
      const res = await getName(address!)
      if (!res || !res.name || !res.match || res.name !== normalise(res.name)) return null
      return {
        ...res,
        name: res.name as string | undefined,
        beautifiedName: tryBeautify(res.name),
      }
    },
    {
      enabled: ready && !skip && !!address,
      cacheTime: 60,
    },
  )
}
