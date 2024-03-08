/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { useQueryClient } from 'wagmi'

import { SearchItem } from '@app/components/@molecules/SearchInput/types'
import { buildQueryParamString } from '@app/utils/buildQueryParamString'
import { calculateRegistrationPrice } from '@app/utils/getRegistrationStatus'

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
  listing_time: null | string | number // TODO: find type
  listing_start_price: null | string | number // TODO: find type
  listing_end_price: null | string
  highest_offer: string | null
  registration_price: number | null
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

  const fetchDomains = async () => {
    const paramString = buildQueryParamString({
      limit: 3,
      offset: 0,
      search_type: '',
      order_type: 'default',
      name: searchTerm.replace('.eth', ''),
      max_domain_length: '', // No upper limit filter
      min_domain_length: '', // Lower limit of 10
      max_listing_price: '',
      min_listing_price: '',
      search_terms: '',
      name_symbols_type: '',
      has_offers_selector: '',
      status_type: '',
    })

    const resPlain = await fetch(`https://jetty.kodex.io/search/plain?${paramString}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const resSimilar = await fetch(`https://jetty.kodex.io/search/similar?${paramString}`, {
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
      ...(jsonSimilar.domains as MarketplaceDomainType[]),
    ]

    if ((jsonPlain.domains as MarketplaceDomainType[]).length === 0)
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
        listing_end_price: null,
        listing_start_price: null,
        listing_time: null,
        taxonomies: null,
        highest_offer: null,
        terms: null,
        views: 0,
      })

    return allDomains
  }

  const data = queryClient.fetchQuery({
    queryKey: ['kodexSearch', searchTerm],
    queryFn: async () => {
      const domains = await fetchDomains()
      setFetchedDomains(domains)
      return domains
    },
  })

  return {
    fetchedDomains,
    data,
    fetchDomains,
    setSearchTerm,
  }
}

export default useKodexSearch