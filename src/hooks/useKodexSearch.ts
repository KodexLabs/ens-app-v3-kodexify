/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { useQueryClient } from 'wagmi'

import { useEthPrice } from './useEthPrice'

import { useFilters } from '@app/components/@molecules/SearchInput/SearchInputFIltersProvider'
import type { SearchItem } from '@app/components/@molecules/SearchInput/types'
import { buildQueryParamString } from '@app/utils/buildQueryParamString'
import { calculateRegistrationPrice } from '@app/utils/getRegistrationPrice'

export type MarketplaceDomainType = {
  name: string
  name_ens: string
  expire_time: number | null
  owner: string | null
  terms: string[] | null
  taxonomies: string[] | null
  last_price: string | null
  last_sale_asset: string | null
  likes: number
  listing_time: null | string | number
  listing_price: null | string
  highest_offer: string | null
  registration_price: number | null
  premium_reg_price: string | null
  has_offers: boolean
  views: number
}

export type MarketplaceDomainItem = MarketplaceDomainType &
  SearchItem & {
    isHistory: boolean
  }

const useKodexSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [fetchedDomains, setFetchedDomains] = useState<MarketplaceDomainType[]>([])

  const queryClient = useQueryClient()
  const { data: ethPrice } = useEthPrice()
  const { filters } = useFilters()

  const fetchDomains = async () => {
    const paramString = buildQueryParamString({
      name: searchTerm.replace('.eth', ''),
      domain_type: filters.type.join(',').toLowerCase(),
      domain_status: filters.status.join(',').toLowerCase(),
      // order_type: 'default',
    })

    const res = await fetch(`https://jetty.kodex.io/search/ens?${paramString}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const json: any = await res.json()
    const allDomains = json.domains as MarketplaceDomainType[]

    if (!(json.domains as MarketplaceDomainType[]).map((d) => d.name_ens).includes(searchTerm))
      allDomains.unshift({
        expire_time: 0,
        name: `${searchTerm.replace('.eth', '')}.eth`,
        name_ens: searchTerm.replace('.eth', ''),
        registration_price:
          calculateRegistrationPrice(searchTerm.replace('.eth', '')).eth * Number(ethPrice || 1),
        has_offers: false,
        last_price: null,
        last_sale_asset: null,
        likes: 0,
        owner: null,
        listing_price: null,
        listing_time: null,
        taxonomies: null,
        highest_offer: null,
        terms: null,
        premium_reg_price: null,
        views: 0,
      })

    return allDomains
  }

  const data = queryClient.fetchQuery({
    queryKey: ['kodexSearch', searchTerm, filters],
    queryFn: async () => {
      if (!searchTerm) {
        setFetchedDomains([])
        return []
      }

      const domains = await fetchDomains()
      setFetchedDomains(domains)
      return domains
    },
    staleTime: 1200000
  })

  return {
    fetchedDomains,
    data,
    fetchDomains,
    setSearchTerm,
  }
}

export default useKodexSearch
