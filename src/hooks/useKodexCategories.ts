import { useState } from 'react'
import { useQueryClient } from 'wagmi'

type CategoriesResponseType = {
  domains: {
    categories: string[]
    domain: string
  }[]
}

export const useKodexCategories = (domainId: string) => {
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([])

  const queryClient = useQueryClient()

  const fetchCategories = async () => {
    const res = await fetch(`https://jetty.kodex.io/info/domain/categories?domains=${domainId}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const json: CategoriesResponseType = await res.json()
    const categories = json?.domains ? json.domains[0]?.categories : []

    return categories
  }

  const data = queryClient.fetchQuery({
    queryKey: ['kodexSearch', domainId],
    queryFn: async () => {
      const categories = await fetchCategories()
      setFetchedCategories(categories)
      return categories
    },
  })

  return {
    categories: fetchedCategories,
    data,
  }
}
