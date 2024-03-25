import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'

export type FiltersType = {
  results: string[]
  status: string[]
  type: string[]
}

export type FilterKeysType = 'status' | 'type'

interface FilterContextProps {
  open: boolean
  filters: FiltersType
  setOpen: (state: boolean) => void
  setFilters: (filters: FiltersType) => void
  toggleFilterResults: (result: string) => void
  toggleFilterStatus: (status: string) => void
  toggleFilterType: (type: string) => void
}

export const filtersDefaultState = {
  results: ['Similar domains'],
  status: ['Registered', 'Available', 'Premium'],
  type: ['Letters', 'Numbers'],
}

export const FiltersContext = createContext<FilterContextProps>({
  open: false,
  filters: filtersDefaultState,
  setOpen: () => {},
  setFilters: () => {},
  toggleFilterResults: () => {},
  toggleFilterStatus: () => {},
  toggleFilterType: () => {},
})

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FiltersType>(filtersDefaultState)

  const setFiltersOpen = useCallback(
    (state: boolean) => {
      setOpen(state)
    },
    [setOpen],
  )

  const setFilters = useCallback((filters: FiltersType) => {
    setFilter(filters)
  }, [])

  const toggleFilterResults = useCallback(
    (result: string) => {
      if (filter.results.includes(result)) {
        setFilters({
          results: filter.results.filter((item) => item !== result),
          status: filter.status,
          type: filter.type,
        })

        return
      }

      setFilters({
        results: filter.results.concat([result]),
        status: filter.status,
        type: filter.type,
      })
    },
    [filter, setFilters],
  )

  const toggleFilterStatus = useCallback(
    (status: string) => {
      if (filter.status.includes(status)) {
        setFilters({
          results: filter.results,
          status: filter.status.filter((item) => item !== status),
          type: filter.type,
        })

        return
      }

      setFilters({
        results: filter.results,
        status: filter.status.concat([status]),
        type: filter.type,
      })
    },
    [filter, setFilters],
  )

  const toggleFilterType = useCallback(
    (type: string) => {
      if (filter.type.includes(type)) {
        setFilters({
          results: filter.results,
          status: filter.status,
          type: filter.type.filter((item) => item !== type),
        })

        return
      }

      setFilters({
        results: filter.results,
        status: filter.status,
        type: filter.type.concat([type]),
      })
    },
    [filter, setFilters],
  )

  const value = useMemo(
    () => ({
      open,
      filters: filter,
      setOpen: setFiltersOpen,
      setFilters,
      toggleFilterResults,
      toggleFilterStatus,
      toggleFilterType,
    }),
    [
      open,
      filter,
      setFiltersOpen,
      setFilters,
      toggleFilterResults,
      toggleFilterStatus,
      toggleFilterType,
    ],
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export const useFilters = () => {
  return useContext(FiltersContext)
}
