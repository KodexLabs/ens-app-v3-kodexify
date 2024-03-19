import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'

export type FiltersType = {
  status: string[]
  type: string[]
}

export type FilterKeysType = 'status' | 'type'

interface FilterContextProps {
  open: boolean
  filters: FiltersType
  setOpen: (state: boolean) => void
  setFilters: (filters: FiltersType) => void
  toggleFilterStatus: (status: string) => void
  toggleFilterType: (type: string) => void
}

export const filtersDefaultState = {
  status: ['Registered', 'Available', 'Premium'],
  type: ['Letters', 'Numbers'],
}

export const FiltersContext = createContext<FilterContextProps>({
  open: false,
  filters: filtersDefaultState,
  setOpen: () => {},
  setFilters: () => {},
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

  const toggleFilterStatus = useCallback(
    (status: string) => {
      if (filter.status.includes(status)) {
        setFilters({
          status: filter.status.filter((item) => item !== status),
          type: filter.type,
        })

        return
      }

      setFilters({
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
          status: filter.status,
          type: filter.type.filter((item) => item !== type),
        })

        return
      }

      setFilters({
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
      toggleFilterStatus,
      toggleFilterType,
    }),
    [open, filter, setFiltersOpen, setFilters, toggleFilterStatus, toggleFilterType],
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export const useFilters = () => {
  return useContext(FiltersContext)
}
