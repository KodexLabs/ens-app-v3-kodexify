import { buildQueryParamString } from "@app/utils/buildQueryParamString"

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

const useKodexSearch = (searchTerm: string) => {
  const = useQuery({
    queryKey: ['kodexSearch', searchTerm],
    queryFn: async () => {
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
        // .filter((t) => t !== 'Emojis') // TODO - find why emojis not valid
        has_offers_selector: '',
        status_type: '',
      })
    
      const res = await fetch(`https://jetty.kodex.io/search/plain?${paramString}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    

    }
  })
}