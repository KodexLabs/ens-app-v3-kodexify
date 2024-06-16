/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { useQueryClient } from 'wagmi'

import { useFilters } from '@app/components/@molecules/SearchInput/SearchInputFIltersProvider'
import { SearchItem } from '@app/components/@molecules/SearchInput/types'
import { buildQueryParamString } from '@app/utils/buildQueryParamString'
import { calculateRegistrationPrice } from '@app/utils/getRegistrationPrice'

import { useEthPrice } from './useEthPrice'

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

const MARKETPLACE_STATUS_PARAM_OPTIONS: Record<string, string> = {
  Available: 'previously_owned',
  Premium: 'premium',
}

const useKodexSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [fetchedDomains, setFetchedDomains] = useState<MarketplaceDomainType[]>([])

  const queryClient = useQueryClient()
  const { data: ethPrice } = useEthPrice()
  const { filters } = useFilters()

  const isSearchSimilar = filters.type.includes('Similar')

  const fetchDomains = async () => {
    const paramString = buildQueryParamString({
      limit: isSearchSimilar ? 3 : 6,
      offset: 0,
      search_type:
        filters.status.includes('Registered') ? 'marketplace' : '',
      order_type: 'default',
      name: searchTerm.replace('.eth', ''),
      max_domain_length: '',
      min_domain_length: '',
      max_listing_price: '',
      min_listing_price: '',
      search_terms: '',
      name_symbols_type:
        filters.type.length > 0
          ? filters.type
              .filter((e) => e !== 'Similar')
              .join(',')
              .toLowerCase()
          : '',
      has_offers_selector: '',
      status_type:
        filters.status.length < 3
          ? filters.status
              .map((statusValue) => MARKETPLACE_STATUS_PARAM_OPTIONS[statusValue])
              .filter((e) => e)[0] || ''
          : '',
    })

    const resPlain = await fetch(`https://jetty.kodex.io/ens/search/plain?${paramString}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const resSimilar = await fetch(`https://jetty.kodex.io/ens/search/similar?${paramString}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const jsonPlain: any = await resPlain.json()
    const jsonSimilar: any = await resSimilar.json()

    const allDomains = [
      ...(jsonPlain.domains as MarketplaceDomainType[]),
      ...(isSearchSimilar ? (jsonSimilar.domains as MarketplaceDomainType[]) : []),
    ]

    if (!(jsonPlain.domains as MarketplaceDomainType[]).map((d) => d.name_ens).includes(searchTerm))
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
