/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import FiltersSvg from 'src/assets/Filter.svg'
import styled, { css } from 'styled-components'

import { CheckSVG } from '@ensdomains/thorin'

import { FilterKeysType, filtersDefaultState, useFilters } from './SearchInputFIltersProvider'

const FiltersWrapper = styled.div(
  () => css`
    position: relative;
    width: fit-content;
    width: 100%;
    height: 50px;
  `,
)

const FiltersButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: gray;
    align-items: center;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    position: relative;
    width: fit-content;
    height: 50px;
    padding: 7px 15px 5px;
    background: white;
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2xLarge']};
    border-color: ${theme.colors.border};
    border-width: 1px;
    &:hover {
      opacity: 0.8;
    }
  `,
)

const FiltersContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
    transition: all 0.15s ease-in-out;
    position: absolute;
    top: 0;
    width: 200px;
    right: 102.5%;
    height: 255px;
    background: white;
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2xLarge']};
    border-color: ${theme.colors.border};
    border-width: 1px;
  `,
)

const FiltersKeyContainer = styled.div(
  () => css`
    gap: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
)

const FiltersOptionContainer = styled.div(
  () => css`
    gap: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  `,
)

const Checkbox = styled.div(
  () => css`
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid gray;
    border-radius: 5px;
  `,
)

const FiltersIcon = styled.svg(
  () => css`
    width: 25px;
    height: 25px;
  `,
)

const CheckIcon = styled.svg(
  () => css`
    width: 15px;
    height: 15px;
  `,
)

export const SearchInputFilters = () => {
  const { open, filters, setOpen, toggleFilterStatus, toggleFilterType } = useFilters()

  // const filtersRef = useRef<HTMLDivElement>(null)

  // const handleClickOutside = (e: any) => {
  //   if (filtersRef.current && !filtersRef.current.contains(e.target)) {
  //     setOpen(false)
  //   }
  // }

  // useEffect(() => {
  //   if (open) {
  //     document.addEventListener('mousedown', handleClickOutside)
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filtersRef, open])

  return (
    <FiltersWrapper>
      <FiltersButtonContainer
        onClick={() => {
          setOpen(!open)
        }}
      >
        <FiltersIcon as={FiltersSvg} />
        <p>{open ? 'Close' : 'Open'} Filters</p>
      </FiltersButtonContainer>
      {open && (
        <FiltersContainer>
          {Object.keys(filtersDefaultState).map((key) => (
            <FiltersKeyContainer>
              <p>{key[0].toUpperCase() + key.slice(1)}</p>
              {filtersDefaultState[key as FilterKeysType].map((option) => (
                <FiltersOptionContainer
                  key={option}
                  onClick={() => {
                    if (key === 'status') toggleFilterStatus(option)
                    if (key === 'type') toggleFilterType(option)
                  }}
                >
                  <p>{option}</p>
                  <Checkbox>
                    {filters[key as FilterKeysType].includes(option) ? (
                      <CheckIcon as={CheckSVG} />
                    ) : null}
                  </Checkbox>
                </FiltersOptionContainer>
              ))}
            </FiltersKeyContainer>
          ))}
        </FiltersContainer>
      )}
    </FiltersWrapper>
  )
}
