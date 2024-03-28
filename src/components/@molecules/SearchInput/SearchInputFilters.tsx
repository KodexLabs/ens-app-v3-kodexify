/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect } from 'react'
// import FiltersSvg from 'src/assets/filters-2.svg'
import styled, { css } from 'styled-components'

import { CheckSVG } from '@ensdomains/thorin'

import { FilterKeysType, filtersDefaultState, useFilters } from './SearchInputFIltersProvider'

const FiltersWrapper = styled.div(
  () => css`
    position: relative;
    width: fit-content;
    width: 80px;
    height: 80px;

    @media only screen and (max-width: 640px) {
      width: 65px;
    }
  `,
)

const FiltersButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    position: relative;
    width: 80px;
    height: 80px;
    background: white;
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2xLarge']};
    border-color: ${theme.colors.border};
    border-width: 1px;
    &:hover {
      opacity: 0.8;
    }

    @media only screen and (max-width: 640px) {
      width: 65px;
    }
  `,
)

const FiltersContainer = styled.div<{ $open: boolean }>(
  ({ theme, $open }) => css`
    display: ${$open ? 'flex' : 'none'};
    flex-direction: column;
    gap: 20px;
    padding: 16px;
    transition: all 0.15s ease-in-out;
    position: absolute;
    top: 0;
    width: 200px;
    right: 120%;
    height: 340px;
    background: white;
    box-shadow: 0 2px 12px ${theme.colors.border};
    border-radius: ${theme.radii['2xLarge']};
    border-color: ${theme.colors.border};
    border-width: 1px;

    @media only screen and (max-width: 940px) {
      width: 470px;
      top: -10px;
      left: 0;
      transform: ${$open ? 'translateY(-340px)' : 'translateY(0)'};
    }

    @media only screen and (max-width: 640px) {
      display: flex;
      width: 100%;
      position: fixed;
      z-index: 9999;
      top: 100%;
      left: 0;
      transform: ${$open ? 'translateY(-340px)' : 'translateY(0)'};
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
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
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: black;
    &:hover {
      color: #444;
    }
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

const FilterTitle = styled.p(
  () => css`
    color: gray;
    font-weight: 600;
    font-size: 18px;
  `,
)

// const FiltersIcon = styled.svg(
//   () => css`
//     width: 45px;
//     height: 45px;
//   `,
// )

const CheckIcon = styled.svg(
  () => css`
    width: 14px;
    height: 14px;
    color: #717171;
  `,
)

const LineIndexTransformations = [
  'rotate(45deg) translate(10px, 11px)',
  'rotate(0)',
  'rotate(-45deg) translate(10px, -11px)',
]

const Line = styled.div<{
  $index: number
  $open: boolean
}>(
  ({ $index, $open }) => css`
    display: block;
    width: ${$open ? '45px' : `${45 - $index * 10}px`};
    height: 5px;
    opacity: ${$open && $index === 1 ? 0 : 1};
    background-color: #717171;
    border-radius: 10px;
    transition: 150ms ease-out;
    transform: ${$open ? LineIndexTransformations[$index] : 'rotate(0)'};

    @media only screen and (max-width: 640px) {
      width: ${$open ? '38px' : `${35 - $index * 10}px`};
    }
  `,
)

export const SearchInputFilters = () => {
  const { open, filters, setOpen, toggleFilterResults, toggleFilterStatus, toggleFilterType } =
    useFilters()

  useEffect(() => setOpen(false), [])

  return (
    <FiltersWrapper>
      <FiltersButtonContainer
        onClick={() => {
          setOpen(!open)
        }}
      >
        {/* <FiltersIcon as={FiltersSvg} /> */}
        {/* <p>{open ? 'Close' : 'Open'} Filters</p> */}
        {new Array(3).fill(1).map((_, i) => (
          <Line $index={i} $open={open} />
        ))}
      </FiltersButtonContainer>
      <FiltersContainer $open={open}>
        {Object.keys(filtersDefaultState).map((key) => (
          <FiltersKeyContainer>
            <FilterTitle>{key[0].toUpperCase() + key.slice(1)}</FilterTitle>
            {filtersDefaultState[key as FilterKeysType].map((option) => (
              <FiltersOptionContainer
                key={option}
                onClick={() => {
                  switch (key) {
                    case 'results':
                      toggleFilterResults(option)
                      break
                    case 'status':
                      toggleFilterStatus(option)
                      break
                    case 'type':
                      toggleFilterType(option)
                      break
                    default:
                      break
                  }
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
    </FiltersWrapper>
  )
}
